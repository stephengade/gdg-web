---
name: 3d-ballistics-engine
description: Standards for Three.js WebGL rendering, Pointer Lock FPS camera math, ADS viewmodel interpolation, sub-stepped projectile kinematics (velocity, gravity drop, wind drift), and zero-GC 3D object pooling.
---

# 3D WebGL & Ballistics Physics Engine Rules

## 1. Scene Scale & Coordinate System
- **1 Three.js Unit = 1 Meter:**
  - Firing line camera position: `(0, 1.6, 0)` (standing eye height `1.6m`).
  - Downrange targets placed at exact negative Z coordinates: `z = -25`, `-50`, `-100`, `-150`, `-200`.

## 2. Sub-Stepped Projectile Kinematics (Anti-Tunneling)
- Fast bullets (`450 m/s`) travel `7.5 meters` per frame at 60 FPS and will pass right through thin 3D target meshes unless raycasted between frames.
- On every `update(dt)` for each active `BulletProjectile`:
  ```js
  prevPos.copy(bullet.position);
  // Apply gravity and wind acceleration
  bullet.velocity.y -= 9.81 * dt;
  bullet.velocity.x += currentWindX * dt;
  // Advance position
  bullet.position.addScaledVector(bullet.velocity, dt);
  // Raycast segment from prevPos to bullet.position
  rayDirection.subVectors(bullet.position, prevPos).normalize();
  const stepDistance = prevPos.distanceTo(bullet.position);
  raycaster.set(prevPos, rayDirection);
  raycaster.far = stepDistance;
  const hits = raycaster.intersectObjects(activeTargetMeshes, false);
  ```

## 3. Weapon Viewmodel, Sway & Recoil Math
- Attach `weaponGroup` as a child of `camera`.
- **ADS Interpolation:** Lerp `weaponGroup.position` between `HIP_POS (0.22, -0.20, -0.45)` and `ADS_POS (0, -0.085, -0.32)` and `camera.fov` between `75` and `45` (or `25` for 4x scope) using frame-rate-independent damping: `1 - Math.exp(-14 * dt)`.
- **Lissajous Breathing Sway:**
  ```js
  const swayAmp = isHoldingBreath ? 0.0004 : (isADS ? 0.0025 : 0.006);
  const swayX = Math.sin(elapsedTime * 1.8) * swayAmp;
  const swayY = Math.cos(elapsedTime * 3.6) * swayAmp;
  ```
- **Zero-Allocation Loop:** Reuse `THREE.Vector3`, `THREE.Euler`, `THREE.Quaternion`, and `THREE.Raycaster` instances declared at module scope. Never call `new THREE.Vector3()` inside `requestAnimationFrame`.

