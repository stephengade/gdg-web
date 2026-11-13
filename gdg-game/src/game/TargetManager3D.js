/**
 * TargetManager3D — Reactive Hinged 3D Silhouette Targets
 *
 * Implements:
 *   - Hinged 3D targets placed at exact negative Z meters (-25m to -200m)
 *   - Local-space 3-zone hit scoring:
 *       • Head / Bullseye: 100 pts
 *       • Torso:           50 pts
 *       • Periphery:       25 pts
 *   - Reactive 90° backward hinge drop on impact
 *   - Pop-up actuator for Mission 2, 4, 5 (upright for duration, then drops)
 *   - Lateral rail strafing for Mission 3, 4, 5 (speed in m/s)
 *   - Hostile vs Non-Combatant (Civilian) target types
 */
import * as THREE from 'three';

export class TargetManager3D {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.targets = [];
    this.activeMeshes = []; // Meshes queried by the BallisticsSolver raycaster
    this.tracks = [];       // Motorized ground rail tracks
    this.isMovementEnabled = true; // Cadet choice: Static vs Moving targets
  }

  /**
   * Spawn targets based on mission configuration.
   * @param {object} mission
   */
  setupMission(mission) {
    this.clearAll();

    const lanes = mission.lanesMeters;
    const allowCivs = mission.allowCivilians;
    const speed = mission.targetSpeedMps > 0 ? mission.targetSpeedMps : 2.2; // All missions have moving targets!
    const popupDuration = mission.targetPopupDurationSec;

    // Staggered offsets by lane distance to guarantee 100% unobstructed sightlines
    const laneOffsetMap = {
      25: [-3.5, 3.5],
      50: [-6.5, 0.0, 6.5],
      75: [-4.8, 4.8],
      100: [-9.0, -2.5, 2.5, 9.0],
      125: [-5.5, 5.5],
      150: [-7.5, 0.0, 7.5],
      200: [-8.5, -2.0, 2.0, 8.5],
    };

    // Distribute targets across configured lanes
    for (let i = 0; i < lanes.length; i++) {
      const dist = lanes[i];
      const z = -dist;
      const offsets = laneOffsetMap[dist] || [-5, 0, 5];

      for (let j = 0; j < offsets.length; j++) {
        const x = offsets[j];
        // Decide whether hostile or non-combatant
        const isCivilian = allowCivs && (Math.random() < 0.28);
        this._createTarget(x, z, dist, isCivilian, speed, popupDuration);
      }
    }
  }

  _createTarget(x, z, distanceMeters, isCivilian, speed, popupDuration) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // 1. Concrete Ground Base & Hinge Post
    const baseGeo = new THREE.BoxGeometry(0.7, 0.15, 0.5);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x3d352b });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.075, 0);
    base.receiveShadow = true;
    group.add(base);

    // 2. Hinged Pivot Arm (Rotates 0° upright to 90° flat backward)
    const hingePivot = new THREE.Group();
    hingePivot.position.set(0, 0.15, 0);
    group.add(hingePivot);

    // Silhouette Board
    const boardW = 0.50;
    const boardH = 0.90;
    const boardGeo = new THREE.BoxGeometry(boardW, boardH, 0.02);

    // Hostile vs Civilian Colors
    const fillColor = isCivilian ? 0xe2e8f0 : 0x1a211c;
    const boardMat = new THREE.MeshStandardMaterial({
      color: fillColor,
      roughness: 0.8,
    });
    const silhouette = new THREE.Mesh(boardGeo, boardMat);
    silhouette.position.set(0, 0.45, 0);
    silhouette.castShadow = true;
    silhouette.receiveShadow = true;
    hingePivot.add(silhouette);

    // Torso Scoring Ring (Visual Texture / Mesh Accent)
    const torsoRingGeo = new THREE.RingGeometry(0.12, 0.14, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isCivilian ? 0x38bdf8 : 0xd8e2dc,
      side: THREE.DoubleSide,
    });
    const torsoRing = new THREE.Mesh(torsoRingGeo, ringMat);
    torsoRing.position.set(0, 0.45, 0.012);
    hingePivot.add(torsoRing);

    // Center Bullseye Pip / Civilian Badge
    const bullseyeGeo = new THREE.CircleGeometry(0.055, 16);
    const bullseyeMat = new THREE.MeshBasicMaterial({
      color: isCivilian ? 0x00b4d8 : 0xff5400, // Safety Blaze Orange for hostile bullseye
      side: THREE.DoubleSide,
    });
    const bullseye = new THREE.Mesh(bullseyeGeo, bullseyeMat);
    bullseye.position.set(0, 0.45, 0.013);
    hingePivot.add(bullseye);

    // Head Silhouette
    const headGeo = new THREE.BoxGeometry(0.20, 0.22, 0.02);
    const head = new THREE.Mesh(headGeo, boardMat);
    head.position.set(0, 0.98, 0);
    head.castShadow = true;
    hingePivot.add(head);

    this.scene.add(group);

    // Motorized Rail Track beneath target's lateral patrol corridor
    const span = Math.min(2.4, Math.max(1.5, distanceMeters * 0.028));
    const minX = x - span;
    const maxX = x + span;

    if (speed > 0) {
      const trackWidth = (maxX - minX) + 0.8;
      const trackGeo = new THREE.BoxGeometry(trackWidth, 0.03, 0.28);
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x1f2420,
        metalness: 0.8,
        roughness: 0.45,
      });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set((minX + maxX) / 2, 0.015, z);
      track.receiveShadow = true;
      this.scene.add(track);
      this.tracks.push(track);
    }

    // Varied target speed so silhouettes don't move in lockstep
    const individualSpeed = speed * (0.86 + Math.random() * 0.28);

    // State object for target
    const targetData = {
      group,
      hingePivot,
      silhouetteMesh: silhouette,
      headMesh: head,
      distanceMeters,
      isCivilian,
      isDown: false,
      fallRotation: 0,
      baseX: x,
      speed: individualSpeed,
      moveDir: Math.random() > 0.5 ? 1 : -1,
      minX,
      maxX,
      isPopup: popupDuration !== null,
      popupDuration: popupDuration || 0,
      popupTimer: 0,
      spawnTimestamp: performance.now(),
    };

    // Store reference on meshes for raycast identification
    silhouette.userData = targetData;
    head.userData = targetData;

    this.targets.push(targetData);
    this.activeMeshes.push(silhouette, head);
  }

  setMovementEnabled(enabled) {
    this.isMovementEnabled = !!enabled;
    for (const tr of this.tracks) {
      tr.visible = this.isMovementEnabled;
    }
  }

  toggleMovement() {
    this.setMovementEnabled(!this.isMovementEnabled);
    return this.isMovementEnabled;
  }

  /* ── Frame Update (Animations, Pop-ups, Rails) ─── */

  update(dt) {
    for (const t of this.targets) {
      // 1. Reactive Hinge Fall / Pop-up Animation
      if (t.isDown) {
        // Fall back 90° (Math.PI / 2) smoothly
        if (t.fallRotation < Math.PI / 2) {
          t.fallRotation = Math.min(Math.PI / 2, t.fallRotation + 12 * dt);
          t.hingePivot.rotation.x = t.fallRotation;
        }
      } else if (t.isPopup) {
        // Upright pop-up timer countdown
        t.popupTimer += dt;
        if (t.popupTimer >= t.popupDuration) {
          // Drop target back down unhit
          t.isDown = true;
        }
      }

      // 2. Lateral Rail Strafe Movement (Active only in MOVING target mode)
      if (this.isMovementEnabled && t.speed > 0 && !t.isDown) {
        t.group.position.x += t.moveDir * t.speed * dt;
        if (t.group.position.x >= t.maxX) {
          t.group.position.x = t.maxX;
          t.moveDir = -1;
        } else if (t.group.position.x <= t.minX) {
          t.group.position.x = t.minX;
          t.moveDir = 1;
        }
      }
    }
  }

  /**
   * Process a hit on a target mesh from BallisticsSolver.
   * @param {THREE.Mesh} hitMesh
   * @param {THREE.Vector3} hitPoint
   * @returns {{ points: number, isCenterMass: boolean, isCivilian: boolean, distanceMeters: number, reactionMs: number } | null}
   */
  processHit(hitMesh, hitPoint) {
    const targetData = hitMesh.userData;
    if (!targetData || targetData.isDown) return null;

    // Trigger reactive hinge drop
    targetData.isDown = true;

    // Remove from active raycast meshes so bullets can pass
    const idx1 = this.activeMeshes.indexOf(targetData.silhouetteMesh);
    if (idx1 !== -1) this.activeMeshes.splice(idx1, 1);
    const idx2 = this.activeMeshes.indexOf(targetData.headMesh);
    if (idx2 !== -1) this.activeMeshes.splice(idx2, 1);

    const reactionMs = performance.now() - targetData.spawnTimestamp;

    // Check hit zone in local silhouette coordinate space
    const localHit = hitPoint.clone();
    targetData.hingePivot.worldToLocal(localHit);

    // Bullseye center is at local y = 0.45, head is at local y >= 0.85
    const distFromBullseye = Math.hypot(localHit.x, localHit.y - 0.45);
    const isHeadshot = localHit.y >= 0.85;

    let points = 25;
    let isCenterMass = false;

    if (distFromBullseye <= 0.065 || isHeadshot) {
      points = 100;
      isCenterMass = true;
    } else if (distFromBullseye <= 0.16) {
      points = 50;
    }

    return {
      points,
      isCenterMass,
      isCivilian: targetData.isCivilian,
      distanceMeters: targetData.distanceMeters,
      reactionMs,
    };
  }

  getActiveCount() {
    return this.targets.filter(t => !t.isDown && !t.isCivilian).length;
  }

  clearAll() {
    for (const t of this.targets) {
      this.scene.remove(t.group);
    }
    for (const tr of this.tracks) {
      this.scene.remove(tr);
    }
    this.targets.length = 0;
    this.activeMeshes.length = 0;
    this.tracks.length = 0;
  }
}

