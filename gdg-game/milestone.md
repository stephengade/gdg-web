
# PHASES.md — Operation Sharp Sight Execution Roadmap

> **CRITICAL DIRECTIVE FOR AI AGENT:**
>
> 1. **Strict Phase Isolation:** You are ONLY permitted to implement features explicitly listed in the **currently active phase**. Do NOT pre-build abstractions, classes, or hooks for future phases.
> 2. **Zero External Libraries:** Use strictly Vanilla ES6+ JavaScript, HTML5 2D `<canvas>`, and Web Audio API. No Three.js, PixiJS, Phaser, or CSS frameworks unless explicitly instructed.
> 3. **Single-Run Architecture:** No save states, localStorage persistence, or mid-mission checkpoints unless specified.
> 4. **Phase Gate Rule:** At the end of each phase, STOP and output a verification summary. Wait for human approval before proceeding to the next phase.

---

## Phase 0: Core Engine & Loop Skeleton (No Gameplay Rules)

**Goal:** Establish a rock-solid 60+ FPS delta-time canvas loop, unified pointer input, and basic state switching.

### In-Scope Deliverables

* `index.html`, `style.css`, and modular ES6 entry point (`main.js`).
* Responsive `<canvas>` element locked to a 16:9 aspect ratio with coordinate normalization (mapping screen `clientX/Y` to internal 1920x1080 logical canvas coordinates).
* `GameLoop` using `requestAnimationFrame` with strict `deltaTime` ($\Delta t$) calculation in seconds.
* `StateMachine` supporting 4 barebones states: `MENU`, `BRIEFING`, `ACTIVE_MISSION`, `AAR_SUMMARY`.
* Unified `InputHandler` listening to `pointerdown` and `pointermove` (supporting both mouse and touch) and `keydown` (`R` for reload).

### Strict Anti-Goals (DO NOT BUILD YET)

* **NO** weapon recoil, bloom, or sway math.
* **NO** mission configurations or target movement logic.
* **NO** audio synthesis or particle systems.
* **NO** complex UI styling—use simple canvas debug text or basic HTML overlay buttons to test state transitions.

### Definition of Done (Verification)

- [ ] Clicking "Start" transitions from `MENU` $\rightarrow$ `BRIEFING` $\rightarrow$ `ACTIVE_MISSION`.
- [ ] Clicking anywhere on the canvas logs normalized `(x, y)` coordinates to the console and draws a temporary red dot at the click location.

---

## Phase 1: Combat Core & Mission 1 (Basic Zeroing)

**Goal:** Build the foundational shooting mechanics, hit-zone math, HUD telemetry, and Mission 1 static drill.

### In-Scope Deliverables

* **Target Entity:** Static silhouette renderer scaled by distance tier (`25m`, `50m`, `100m`).
* **Hitbox Math:** Concentric zone evaluation on `pointerdown`:
  * Center Mass / Head: `100 pts`
  * Torso: `50 pts`
  * Periphery: `25 pts`
  * Miss: `-100 pts` and resets streak multiplier.
* **Weapon State:** 15-round magazine, manual reload (`R` key = `1.2s`), empty auto-reload (`2.0s`), and reticle bloom/recoil spread ($\Delta x, \Delta y$ offset on rapid fire).
* **HUD & AAR:** Timer countdown, live score, streak multiplier ($1.5\times$ to $3\times$), visual ammo counter, and After-Action Report (Accuracy %, Center-Mass ratio, Avg Reaction Time, Retry/Next buttons).
* **Mission 1 Config:** 15 rounds, 45 seconds, static targets, pass threshold $\ge 80\%$ accuracy and $\ge 1,000$ pts.

### Strict Anti-Goals (DO NOT BUILD YET)

* **NO** moving targets or velocity vectors ($v_x$).
* **NO** pop-up disappearance timers.
* **NO** civilian/non-combatant target types.
* **NO** wind drift or night-vision shaders.

### Definition of Done (Verification)

- [ ] Player can play Mission 1 from briefing to AAR screen in a single run.
- [ ] Rapid clicking visibly expands reticle bloom and offsets shot placement.
- [ ] Failing to hit 80% accuracy or 1,000 pts forces a "Retry Mission" state; passing unlocks Mission 2 placeholder.

---

## Phase 2: Dynamic Target Spawners — Missions 2 & 3 (Reflex & Tracking)

**Goal:** Extend the Target and Weapon systems to support time-limited pop-ups, lateral movement, and breathing sway.

### In-Scope Deliverables

* **Mission 2 (Snap Reflex) Logic:**
  * Target pop-up lifecycle (`SPAWNING` $\rightarrow$ `ACTIVE` for `1.8s` $\rightarrow$ `EXPIRED`).
  * Per-target reaction timer (timestamp from spawn to hit).
  * Qualification check: 16/20 targets hit and $< 0.9\text{s}$ average reaction time.
* **Mission 3 (Strafe Tracking) Logic:**
  * Horizontal rail velocity ($v_x \cdot \Delta t$) with boundary reversal/despawn.
  * Reticle breathing sway (sinusoidal offset applied to aim coordinates during `ACTIVE_MISSION`).
  * Qualification check: $\ge 75\%$ accuracy and $\ge 1,800$ pts.

### Strict Anti-Goals (DO NOT BUILD YET)

* **NO** friendly-fire / civilian targets.
* **NO** environmental wind vectors or low-visibility overlays.
* **NO** Web Audio synthesizer or particle pooling yet.

### Definition of Done (Verification)

- [ ] Targets in Mission 2 automatically drop after `1.8s` if unshot and count as missed targets.
- [ ] Targets in Mission 3 move at identical speeds on both 60Hz and 144Hz refresh rates.

---

## Phase 3: Rules of Engagement & Environment — Missions 4 & 5

**Goal:** Implement target discrimination (Friend or Foe) and environmental modifiers (Night Ops + Wind).

### In-Scope Deliverables

* **Mission 4 (Friend or Foe) Logic:**
  * `targetType` property (`HOSTILE` vs. `NON_COMBATANT`) with distinct visual silhouettes/markers.
  * Instant-fail interrupt: Hitting a `NON_COMBATANT` immediately terminates `ACTIVE_MISSION` and routes to `FAIL_SCREEN` ("Rules of Engagement Violated").
* **Mission 5 (Deployment Qual) Logic:**
  * Crosswind modifier: Horizontal ballistic drift offset applied to shot impact based on target distance tier and current wind vector.
  * Mid-mission wind shift event at `t = 30s` with HUD wind indicator arrow.
  * Low-visibility canvas overlay (darkness mask / night-vision green tint via lightweight 2D canvas composite operations).

### Strict Anti-Goals (DO NOT BUILD YET)

* **NO** 3D WebGL migration or external shader libraries.
* **NO** extra missions beyond Mission 5.

### Definition of Done (Verification)

- [ ] Shooting a non-combatant in Mission 4 ends the run on the exact frame of impact.
- [ ] In Mission 5, shots at 100m targets require aiming into the wind to hit center mass.

---

## Phase 4: Juice, Object Pooling & Web Audio Polish

**Goal:** Add tactile military feedback, zero-allocation particle effects, and synthesized audio without altering core gameplay rules.

### In-Scope Deliverables

* **Object Pooling:** Pre-allocated fixed-size pools for bullet holes, muzzle flashes, and floating score pop-ups (`+100`, `MISS`) to guarantee zero Garbage Collection stutters.
* **Web Audio API Synthesizer:** Procedural/buffer sound effects (no external MP3 assets required unless provided) for:
  * Gunshot transient
  * Metallic target ding (higher frequency pitch for 100-pt center-mass hits)
  * Dry-fire click on empty mag
  * Reload mechanical latch

### Strict Anti-Goals

* **NO** refactoring of working mission rules or state logic.
* **NO** addition of leaderboards, accounts, or backend APIs.

### Definition of Done (Verification)

- [ ] All 5 missions run sequentially with full audio and visual hit feedback.
- [ ] Memory profile in browser DevTools shows flat heap allocation during rapid-fire drills.
