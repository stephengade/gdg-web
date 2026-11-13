/**
 * BallisticsSolver — 3D Sub-Stepped Projectile Kinematics (Outward Ballistics)
 *
 * Implements:
 *   - Frame-to-frame sub-stepped raycast anti-tunneling
 *   - Outward-facing 3D glowing tracer lines (head at bullet.position, tail behind)
 *   - High-velocity profiles (450 m/s for Rifle, 850 m/s for DL-50 Sniper)
 *   - Realistic downward gravity (9.81 m/s²) and crosswind drift
 *   - Impact sparks along surface normal
 *   - Zero-allocation object pool
 */
import * as THREE from 'three';

const MAX_PROJECTILES = 32;
const MAX_SPARKS = 64;

export class BallisticsSolver {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.windX = 0; // m/s crosswind

    // Pre-allocated Projectile Pool
    this.projectiles = [];
    const tracerMat = new THREE.LineBasicMaterial({
      color: 0xffd23f, // Bright gold-orange glowing tracer
      linewidth: 3,
    });

    for (let i = 0; i < MAX_PROJECTILES; i++) {
      // Dynamic 2-point buffer geometry (updated per frame with exact world coords)
      const positions = new Float32Array(6);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const tracerLine = new THREE.Line(geo, tracerMat);
      tracerLine.frustumCulled = false;
      tracerLine.visible = false;
      this.scene.add(tracerLine);

      this.projectiles.push({
        active: false,
        position: new THREE.Vector3(),
        prevPos: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        spawnPos: new THREE.Vector3(),
        tracer: tracerLine,
        lifetime: 0,
      });
    }

    // Pre-allocated Impact Sparks Pool
    this.sparks = [];
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff8c00,
      size: 0.16,
      transparent: true,
    });
    for (let i = 0; i < MAX_SPARKS; i++) {
      const pGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
      const point = new THREE.Points(pGeo, sparkMat);
      point.visible = false;
      this.scene.add(point);

      this.sparks.push({
        active: false,
        mesh: point,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
      });
    }

    // Module-level reused math instances (Zero-GC loop)
    this._raycaster = new THREE.Raycaster();
    this._rayDir = new THREE.Vector3();
  }

  setWind(windMps) {
    this.windX = windMps;
  }

  /**
   * Fire a physical 3D bullet round outward downrange.
   * @param {THREE.Vector3} muzzlePos
   * @param {THREE.Vector3} aimDir
   * @param {boolean} isHipFire
   * @param {number} muzzleSpeed - e.g. 450 m/s for Rifle, 850 m/s for DL-50 Sniper
   */
  spawnBullet(muzzlePos, aimDir, isHipFire = false, muzzleSpeed = 450) {
    // Find free projectile in pool
    let bullet = null;
    for (const p of this.projectiles) {
      if (!p.active) {
        bullet = p;
        break;
      }
    }
    if (!bullet) return;

    bullet.active = true;
    bullet.position.copy(muzzlePos);
    bullet.prevPos.copy(muzzlePos);
    bullet.spawnPos.copy(muzzlePos);
    bullet.lifetime = 2.5;

    // Direction vector + slight hip-fire dispersion cone
    const dir = aimDir.clone().normalize();
    if (isHipFire) {
      const spread = (2.2 * Math.PI) / 180;
      dir.x += (Math.random() - 0.5) * spread;
      dir.y += (Math.random() - 0.5) * spread;
      dir.normalize();
    }

    bullet.velocity.copy(dir).multiplyScalar(muzzleSpeed);

    // Initialize tracer positions
    const posAttr = bullet.tracer.geometry.attributes.position;
    posAttr.setXYZ(0, bullet.position.x, bullet.position.y, bullet.position.z);
    posAttr.setXYZ(1, bullet.position.x, bullet.position.y, bullet.position.z);
    posAttr.needsUpdate = true;
    bullet.tracer.visible = true;
  }

  /**
   * Frame-by-frame physics integration & sub-stepped raycast collision check.
   * @param {number} dt
   * @param {THREE.Mesh[]} targetMeshes
   * @param {function(object): void} onHitCallback
   */
  update(dt, targetMeshes, onHitCallback) {
    // 1. Advance Active Bullets
    for (const bullet of this.projectiles) {
      if (!bullet.active) continue;

      bullet.prevPos.copy(bullet.position);

      // Downward gravity (9.81 m/s²) and crosswind acceleration
      bullet.velocity.y -= 9.81 * dt;
      bullet.velocity.x += this.windX * dt;

      // Position step
      bullet.position.addScaledVector(bullet.velocity, dt);
      bullet.lifetime -= dt;

      // ── Sub-Stepped Raycasting (prevPos -> bullet.position) ──
      this._rayDir.subVectors(bullet.position, bullet.prevPos);
      const stepDistance = this._rayDir.length();
      this._rayDir.normalize();

      this._raycaster.set(bullet.prevPos, this._rayDir);
      this._raycaster.far = stepDistance;

      let hitOccurred = false;
      if (targetMeshes && targetMeshes.length > 0) {
        const hits = this._raycaster.intersectObjects(targetMeshes, false);
        if (hits.length > 0) {
          const hit = hits[0];
          hitOccurred = true;

          // Impact sparks along surface normal
          this.triggerSparks(hit.point, hit.face ? hit.face.normal : new THREE.Vector3(0, 0, 1));

          const flightDistance = bullet.spawnPos.distanceTo(hit.point);

          onHitCallback({
            hitObject: hit.object,
            point: hit.point,
            uv: hit.uv,
            distanceMeters: flightDistance,
          });

          this._recycleBullet(bullet);
        }
      }

      // Check ground collision (y <= 0)
      if (!hitOccurred && bullet.position.y <= 0) {
        this.triggerSparks(bullet.position, new THREE.Vector3(0, 1, 0));
        this._recycleBullet(bullet);
        continue;
      }

      // Despawn on lifetime or far distance (z < -320)
      if (bullet.lifetime <= 0 || bullet.position.z < -320) {
        this._recycleBullet(bullet);
        continue;
      }

      // ── Update 3D Outward Tracer Geometry ──
      if (bullet.active) {
        const posAttr = bullet.tracer.geometry.attributes.position;
        // Vertex 0: Head of bullet (current position)
        posAttr.setXYZ(0, bullet.position.x, bullet.position.y, bullet.position.z);
        // Vertex 1: Tail of bullet (trailing behind along velocity vector)
        const tailLen = 0.035; // 35ms trail
        const tailX = bullet.position.x - bullet.velocity.x * tailLen;
        const tailY = bullet.position.y - bullet.velocity.y * tailLen;
        const tailZ = bullet.position.z - bullet.velocity.z * tailLen;
        posAttr.setXYZ(1, tailX, tailY, tailZ);
        posAttr.needsUpdate = true;
      }
    }

    // 2. Advance Sparks
    for (const spk of this.sparks) {
      if (!spk.active) continue;

      spk.pos.addScaledVector(spk.vel, dt);
      spk.vel.y -= 9.8 * dt;
      spk.life -= dt;

      spk.mesh.position.copy(spk.pos);

      if (spk.life <= 0) {
        spk.active = false;
        spk.mesh.visible = false;
      }
    }
  }

  hasActiveBullets() {
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i].active) return true;
    }
    return false;
  }

  _recycleBullet(bullet) {
    bullet.active = false;
    bullet.tracer.visible = false;
  }

  triggerSparks(point, normal) {
    let count = 0;
    for (const spk of this.sparks) {
      if (!spk.active && count < 8) {
        spk.active = true;
        spk.mesh.visible = true;
        spk.pos.copy(point);
        spk.life = 0.24;

        const speed = 5 + Math.random() * 8;
        spk.vel.copy(normal).multiplyScalar(speed);
        spk.vel.x += (Math.random() - 0.5) * 6;
        spk.vel.y += Math.random() * 4;
        spk.vel.z += (Math.random() - 0.5) * 6;

        count++;
      }
    }
  }
}
