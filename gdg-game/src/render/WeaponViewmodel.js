/**
 * WeaponViewmodel — 3D Weapon Models & Telescopic Sniper Optics
 *
 * Implements:
 *   - Two Weapon Classes:
 *       1. M4A1 Tactical Carbine (1x / 2x Holo sight, 45° FOV)
 *       2. DL-50 Heavy Sniper Rifle (8x - 16x Telescopic Scope, 12° FOV)
 *   - Frame-rate independent ADS interpolation
 *   - Figure-8 Lissajous breathing sway math with breath hold stabilization
 *   - Outward physical recoil (pitch kick, subtle recovery, zero camera clipping)
 *   - Full telescopic sniper scope alignment
 */
import * as THREE from 'three';

const HIP_POS = new THREE.Vector3(0.20, -0.19, -0.42);
const ADS_HOLO_POS = new THREE.Vector3(0, -0.082, -0.30);
const ADS_SNIPER_POS = new THREE.Vector3(0, -0.065, -0.25);

export class WeaponViewmodel {
  /**
   * @param {THREE.Camera} camera
   */
  constructor(camera) {
    this.camera = camera;
    this.weaponGroup = new THREE.Group();
    this.camera.add(this.weaponGroup);

    // Current Weapon Class: 'CARBINE' or 'SNIPER'
    this.currentWeapon = 'SNIPER'; // Default to requested DL-50 Sniper!

    // ADS & Zoom States
    this.isADS = false;
    this.adsProgress = 0; // 0 (hip) to 1 (ADS)
    this.defaultFov = 75;
    this.opticZoomFov = 12; // Telescopic DL-50 8x zoom (12° FOV)

    // Breath hold & Stamina
    this.isHoldingBreath = false;
    this.stamina = 1.0;
    this.MAX_HOLD_TIME = 4.5;
    this.exhausted = false;
    this.exhaustionTimer = 0;

    // Recoil state (clamped to prevent camera clipping)
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    this.recoilZ = 0;

    // Sub-groups for weapons
    this.carbineMesh = new THREE.Group();
    this.sniperMesh = new THREE.Group();
    this.muzzlePoint = new THREE.Object3D();

    this._buildCarbine();
    this._buildDL50Sniper();

    this.weaponGroup.add(this.carbineMesh);
    this.weaponGroup.add(this.sniperMesh);
    this.weaponGroup.add(this.muzzlePoint);

    this.setWeapon(this.currentWeapon);

    this._elapsedTime = 0;
  }

  /* ── Weapon Switcher ─────────────────── */

  setWeapon(type) {
    this.currentWeapon = type;
    if (type === 'SNIPER') {
      this.carbineMesh.visible = true; // Use sniper mesh
      this.sniperMesh.visible = true;
      this.opticZoomFov = 12; // 8x Telescopic magnification
      this.muzzlePoint.position.set(0, 0.015, -0.85); // Longer sniper barrel
    } else {
      this.carbineMesh.visible = true;
      this.sniperMesh.visible = false;
      this.opticZoomFov = 45; // 2x Holo sight
      this.muzzlePoint.position.set(0, 0.01, -0.58);
    }
  }

  toggleWeapon() {
    const next = this.currentWeapon === 'SNIPER' ? 'CARBINE' : 'SNIPER';
    this.setWeapon(next);
    return next;
  }

  /* ── 3D Procedural Meshes ─────────────── */

  _buildCarbine() {
    const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x181c19, metalness: 0.8, roughness: 0.35 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0x242a26, metalness: 0.6, roughness: 0.45 });

    // Receiver
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.08, 0.28), gunMetalMat);
    this.carbineMesh.add(receiver);

    // Handguard
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.055, 0.22), railMat);
    handguard.position.set(0, 0.005, -0.22);
    this.carbineMesh.add(handguard);

    // Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 12), gunMetalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, -0.42);
    this.carbineMesh.add(barrel);

    // Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.065), new THREE.MeshStandardMaterial({ color: 0x111412 }));
    mag.position.set(0, -0.10, -0.06);
    mag.rotation.x = 0.15;
    this.carbineMesh.add(mag);

    // Grip
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.12, 0.045), new THREE.MeshStandardMaterial({ color: 0x1f2621 }));
    grip.position.set(0, -0.08, 0.10);
    grip.rotation.x = -0.35;
    this.carbineMesh.add(grip);

    // Holographic Sight
    const opticBase = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.055, 0.09), gunMetalMat);
    opticBase.position.set(0, 0.068, -0.04);
    this.carbineMesh.add(opticBase);

    // Holo reticle dot
    const reticle = new THREE.Mesh(
      new THREE.CircleGeometry(0.003, 16),
      new THREE.MeshBasicMaterial({ color: 0xff2a2a, depthTest: false })
    );
    reticle.position.set(0, 0.085, -0.041);
    this.carbineMesh.add(reticle);
  }

  _buildDL50Sniper() {
    const sniperMat = new THREE.MeshStandardMaterial({ color: 0x141815, metalness: 0.85, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x3a423d, metalness: 0.9, roughness: 0.2 });

    // Long Fluted Sniper Barrel (Extends outward to z = -0.80)
    const longBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.45, 12), sniperMat);
    longBarrel.rotation.x = Math.PI / 2;
    longBarrel.position.set(0, 0.015, -0.58);
    this.sniperMesh.add(longBarrel);

    // Massive .50 Cal Muzzle Brake
    const brake = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.03, 0.07), chromeMat);
    brake.position.set(0, 0.015, -0.82);
    this.sniperMesh.add(brake);

    // Heavy Telescopic Scope Tube
    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.24, 16), sniperMat);
    scopeTube.rotation.x = Math.PI / 2;
    scopeTube.position.set(0, 0.095, -0.08);
    this.sniperMesh.add(scopeTube);

    // Scope Mount Rings
    const ring1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.02), chromeMat);
    ring1.position.set(0, 0.075, -0.02);
    const ring2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.02), chromeMat);
    ring2.position.set(0, 0.075, -0.15);
    this.sniperMesh.add(ring1);
    this.sniperMesh.add(ring2);

    // Bipod legs folded forward
    const bipod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 8), chromeMat);
    bipod.rotation.x = Math.PI / 2 - 0.2;
    bipod.position.set(0.025, -0.02, -0.45);
    this.sniperMesh.add(bipod);
  }

  /* ── Physical Recoil Kick ─────────────── */

  triggerRecoil() {
    const isSniper = this.currentWeapon === 'SNIPER';
    // Sniper kicks harder up, carbine kicks faster
    const pitchKick = isSniper ? 0.048 : 0.028;
    this.recoilPitch += pitchKick;
    this.recoilYaw += (Math.random() - 0.5) * 0.015;

    // Small, safe recoil Z (max 0.025m so gun never clips into player)
    this.recoilZ = Math.min(0.025, this.recoilZ + (isSniper ? 0.022 : 0.014));
  }

  getMuzzleWorldPosition(targetVec) {
    this.weaponGroup.updateMatrixWorld(true);
    this.muzzlePoint.getWorldPosition(targetVec);
    return targetVec;
  }

  /* ── Frame Update ─────────────────────── */

  update(dt, isADSRequested, isBreathRequested) {
    this._elapsedTime += dt;
    this.isADS = isADSRequested;

    // 1. Breath Hold Stamina
    if (this.exhausted) {
      this.exhaustionTimer -= dt;
      if (this.exhaustionTimer <= 0) this.exhausted = false;
      this.isHoldingBreath = false;
      this.stamina = Math.min(1.0, this.stamina + (dt / 5.0));
    } else if (isBreathRequested && this.stamina > 0.05) {
      this.isHoldingBreath = true;
      this.stamina = Math.max(0, this.stamina - (dt / this.MAX_HOLD_TIME));
      if (this.stamina <= 0) {
        this.exhausted = true;
        this.exhaustionTimer = 2.5;
      }
    } else {
      this.isHoldingBreath = false;
      this.stamina = Math.min(1.0, this.stamina + (dt / 3.0));
    }

    // 2. ADS Interpolation
    const adsSpeed = this.currentWeapon === 'SNIPER' ? 12 : 16;
    const adsFactor = 1 - Math.exp(-adsSpeed * dt);
    const targetPos = this.isADS
      ? (this.currentWeapon === 'SNIPER' ? ADS_SNIPER_POS : ADS_HOLO_POS)
      : HIP_POS;

    this.weaponGroup.position.lerp(targetPos, adsFactor);

    // In Sniper ADS, fade out 3D gun mesh so user looks directly through the telescopic scope
    if (this.currentWeapon === 'SNIPER') {
      const isFullScope = this.adsProgress > 0.85;
      this.weaponGroup.visible = !isFullScope;
    } else {
      this.weaponGroup.visible = true;
    }

    // Camera FOV Zoom
    const targetFov = this.isADS ? this.opticZoomFov : this.defaultFov;
    this.camera.fov += (targetFov - this.camera.fov) * adsFactor;
    this.camera.updateProjectionMatrix();

    this.adsProgress = THREE.MathUtils.lerp(this.adsProgress, this.isADS ? 1 : 0, adsFactor);

    // 3. Lissajous Breathing Sway
    let swayAmp;
    if (this.exhausted) {
      swayAmp = 0.014;
    } else if (this.isHoldingBreath) {
      swayAmp = 0.0003; // Almost perfectly still
    } else if (this.isADS) {
      swayAmp = this.currentWeapon === 'SNIPER' ? 0.0018 : 0.0024;
    } else {
      swayAmp = 0.006;
    }

    const swayX = Math.sin(this._elapsedTime * 1.8) * swayAmp;
    const swayY = Math.cos(this._elapsedTime * 3.6) * swayAmp;

    this.weaponGroup.rotation.x = this.recoilPitch + swayY;
    this.weaponGroup.rotation.y = this.recoilYaw + swayX;

    // Apply safe recoil recovery
    const recoveryFactor = Math.exp(-14 * dt);
    this.recoilPitch *= recoveryFactor;
    this.recoilYaw *= recoveryFactor;
    this.recoilZ *= recoveryFactor;
  }
}
