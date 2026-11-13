# PHASES.md — OAU Cadet Training (3D WebGL Ballistics Edition)

> **CRITICAL DIRECTIVE FOR AI AGENT:**
> 1. **Strict Phase Isolation:** Implement ONLY features listed in the currently active phase.
> 2. **Approved Tech Stack:** Vanilla ES6+ JavaScript, **Three.js** (via ESM CDN `https://unpkg.com/three@0.160.0/build/three.module.js`), HTML5/CSS3 Tactical HUD Overlay, and Web Audio API.
> 3. **NO Point-and-Click:** Never allow the player to click directly on targets with a free mouse cursor. Aiming MUST use FPS Camera rotation (Pointer Lock on Desktop, Dual-Thumb Touch on Mobile).
> 4. **NO Instant Hitscan:** Every fired round is a physical 3D projectile with velocity, gravity drop, wind drift, and frame-to-frame sub-stepped raycast collision.

---

## Phase 0: 3D Range Environment, FPS Camera & Viewmodel
**Goal:** Establish a 60+ FPS Three.js scene, Pointer-Lock/Touch camera controls, and a procedural 3D rifle with Hip-Fire to ADS (Aim Down Sights) interpolation.

### In-Scope Deliverables
* `Three.WebGLRenderer`, `PerspectiveCamera`, lighting, ground plane, distance lane markers (`25m`, `50m`, `100m`, `150m`, `200m`), sandbag firing line, and `THREE.FogExp2`.
* **FPS Aim Controller:**
  * Desktop: `requestPointerLock()` on canvas click; `mousemove` rotates camera yaw/pitch.
  * Mobile: Left-screen drag rotates camera yaw/pitch; right-screen touch buttons for `FIRE`, `ADS`, `BREATH`, `RELOAD`.
* **3D Rifle Viewmodel:** Procedural 3D carbine + holographic optic attached to camera.
* **Hip-Fire vs. ADS:** Holding Right-Click (or `ADS` button) smoothly lerps the weapon to screen center `(0, 0, -z)` and narrows camera FOV from `75°` to `45°` (or `25°` for 4x ACOG in Mission 5).
* **State Machine:** `MENU`, `BRIEFING`, `ACTIVE_MISSION`, `AAR_SUMMARY`, `FAIL_SCREEN`.

### Definition of Done
- [ ] Player can look around the 3D firing range using Mouse Pointer Lock or Mobile Touch drag.
- [ ] Holding Right-Click smoothly aligns the 3D rifle's glowing optic reticle with the center of the screen.

---

## Phase 1: True 3D Projectile Ballistics, Sway, Recoil & Mission 1
**Goal:** Build the projectile physics solver, weapon sway/recoil mechanics, 3D hinged targets, and Mission 1 (Basic Zeroing).

### In-Scope Deliverables
* **3D Projectile Physics:** On fire, spawn a `BulletProjectile` from the muzzle with:
  * Muzzle velocity (`450 m/s`), downward gravity (`9.81 m/s²`), and visible glowing 3D tracer line.
  * Frame-to-frame raycast sub-stepping (`prevPos` $\rightarrow$ `nextPos`) to detect exact 3D intersection on target meshes.
* **Weapon Sway & Breath Hold:** Figure-8 Lissajous breathing oscillation on the barrel; holding `Spacebar` stabilizes sway by 85% for up to `4.0s` (with HUD stamina bar and exhaustion penalty).
* **Recoil Kick:** Upward pitch kick (`+1.8°` to `+2.6°`), horizontal yaw jitter (`±0.6°`), and backward Z-axis kick on every shot. Hip-fire adds a `±3.5°` spread cone.
* **3D Reactive Targets & Scoring:** Hinged 3D silhouettes at true Z-depths (`-25m` to `-200m`). Local-space hit zoning: Head/Inner Bullseye (`100 pts`), Torso (`50 pts`), Periphery (`25 pts`), Miss (`-100 pts`). Targets rotate `90°` backward on hinge when neutralized.
* **Mission 1 Config:** 15 rounds, 45 seconds, static targets at `25m`, `50m`, `100m`. Pass threshold: $\ge 75\%$ accuracy and $\ge 1,000$ pts.

### Definition of Done
- [ ] Firing at a 100m target shows a visible tracer arc with gravity drop requiring slight elevation holdover.
- [ ] Rapid firing kicks the camera upward, requiring downward mouse compensation.

---

## Phase 2: Dynamic 3D Targets — Missions 2 & 3 (Reflex & Strafe Lead)
**Goal:** Add hinged pop-up rotation actuators and lateral rail movement requiring horizontal target leading.

### In-Scope Deliverables
* **Mission 2 (Snap Reflex):** Targets hinge up from `90°` flat to `0°` upright for `2.2s` before dropping back down. Qualification: 15/20 targets hit, $< 1.1\text{s}$ avg reaction time.
* **Mission 3 (Strafe Tracking):** Targets move laterally along 3D rails at `3m/s` to `6m/s` across `50m`–`150m` lanes. Because bullets have travel time, players must aim ahead of moving targets. Qualification: $\ge 70\%$ accuracy and $\ge 1,800$ pts.

### Definition of Done
- [ ] Hitting a moving 100m target in Mission 3 requires aiming ahead of its movement vector.

---

## Phase 3: ROE Discrimination & Night Ballistics — Missions 4 & 5
**Goal:** Add Friend-or-Foe silhouettes, crosswind ballistic drift, and Night-Ops optics.

### In-Scope Deliverables
* **Mission 4 (Friend or Foe):** High-speed 3D pop-ups mixing Hostiles (armed dark silhouettes) and Non-Combatants (high-vis blue/white silhouettes). Hitting a Non-Combatant triggers an instant ROE failure.
* **Mission 5 (Deployment Qual):**
  * Night-Ops environment lighting + optional Green Phosphor NVG HUD shader/overlay and 4x ACOG scope (`25°` FOV with mil-dot holdover lines).
  * Crosswind acceleration vector (`windSpeed` applied to `projectile.velocity.x`) with a mid-mission wind shift at `t = 30s` and HUD wind gauge (m/s + direction arrow).

### Definition of Done
- [ ] In Mission 5, crosswind visibly curves the 3D bullet tracer laterally over 100m–200m distances.

---

## Phase 4: 3D Impact Polish, Object Pooling & Web Audio Synthesizer
**Goal:** Zero-GC pooling for projectiles/sparks/decals and procedural Web Audio API sound effects.

### In-Scope Deliverables
* Pre-allocated pools for `BulletProjectile`, 3D impact spark bursts, muzzle flash point lights, and 3D bullet-hole decals parented to target meshes.
* Procedural Web Audio API synthesizer: Gunshot transient + low-end punch, supersonic crack, distance-delayed metallic target clang, dry-fire click, reload latch, and heartbeat audio when breath stamina is low.

