
# Product Requirements Document (PRD): Operation Sharp Sight

**Platform:** Desktop & Mobile Web Browser (HTML5 Canvas / WebGL)

**Core Tech Stack:** Vanilla JavaScript (ES6+), HTML5 `<canvas>`, Web Audio API

**Game Mode:** Single-Session Arcade / Tactical Sim (Continuous Single-Run Missions)

---

## 1. Product Overview & Core Loop

**Operation Sharp Sight** is a browser-based military marksmanship simulator designed to test and train shooter accuracy, target acquisition speed, and trigger discipline prior to deployment.

* **Perspective:** First-person static firing line facing a dynamic downrange environment.
* **The "Single-Run" Rule:** Each mission is a self-contained, continuous drill. There are no mid-mission checkpoints; failing to meet the minimum qualification score or running out of ammunition/time requires a full mission restart.
* **Core Loop:** Briefing $\rightarrow$ Countdown $\rightarrow$ Active Firing Drill $\rightarrow$ After-Action Report (AAR) $\rightarrow$ Next Mission Unlock.

---

## 2. Core Mechanics & Scoring Engine

* **Hitbox Zoning:** Targets are divided into three concentric scoring zones:
* **Center Mass (Inner Ring / Head):** 100 pts (Critical Hit)
* **Torso (Middle Ring):** 50 pts
* **Periphery (Outer Edge):** 25 pts
* **Miss / Civilian Target:** -100 pts (Breaks combo multiplier)
* **Weapon Handling Mechanics:**
* **Recoil & Spread:** Rapid clicking expands the reticle bloom, introducing randomized coordinate offset ($\Delta x, \Delta y$) to shots. Players must pace shots to maintain pinpoint accuracy.
* **Reloading:** Fixed magazine capacity (e.g., 15 rounds). Manual reload (`R` key or tap icon) takes 1.2 seconds; empty-mag auto-reload takes 2.0 seconds.
* **Accuracy Multiplier:** Consecutive center-mass hits build a $1.5\times$ to $3\times$ streak multiplier.

---

## 3. Campaign Milestones (Mission Breakdown)

| Mission             | Codename                  | Target Behavior                                                                 | Constraints & Modifiers                                                                                          | Qualification Threshold                                 |
| ------------------- | ------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Mission 1** | **Basic Zeroing**   | Static frontal silhouette targets at 25m, 50m, and 100m.                        | 15 rounds, 45 seconds. No environmental interference.                                                            | $\ge 80\%$ accuracy; min 1,000 pts.                   |
| **Mission 2** | **Snap Reflex**     | Targets pop up for 1.8 seconds at randomized lanes before dropping.             | 20 rounds, 40 seconds. Requires rapid mouse flicking/touch tracking.                                             | Hit 16/20 targets; $< 0.9\text{s}$ avg reaction time. |
| **Mission 3** | **Strafe Tracking** | Targets move laterally across rails at varying speeds ($v_x$).                | 25 rounds, 45 seconds. Introduces minor reticle sway (breathing mechanic).                                       | $\ge 75\%$ accuracy; min 1,800 pts.                   |
| **Mission 4** | **Friend or Foe**   | High-speed pop-ups mixing hostile targets (armed) and non-combatants (unarmed). | 20 Hostiles, 10 Non-combatants. **Zero-tolerance rule:** hitting a non-combatant triggers an instant fail. | Neutralize 18/20 hostiles; 0 friendly fire incidents.   |
| **Mission 5** | **Deployment Qual** | Night/low-visibility range with crosswind drift, moving targets, and decoys.    | 30 rounds, 60 seconds. Wind vector shifts halfway through, requiring horizontal lead adjustment.                 | $\ge 85\%$ overall score rating ("Marksman" badge).   |

---

## 4. Technical Architecture (JS Engine Specs)

### A. Game Loop & Frame Timing

* Built on `window.requestAnimationFrame()` using **Delta Time ($\Delta t$)** calculations so target movement speeds and pop-up timers remain identical across 60Hz, 120Hz, and 144Hz monitors.
* **State Machine:** Strictly decoupled states (`BOOT`, `MENU`, `BRIEFING`, `ACTIVE_MISSION`, `AAR_SUMMARY`, `FAIL_SCREEN`) managed by a central `MissionController`.

### B. Hit Detection & Input Handling

* **Zero-DOM Gameplay:** All targets are rendered on a single 2D `<canvas>` layer to prevent DOM manipulation lag or CSS layout thrashing.
* **Raycasting / Point-in-Polygon:** On `pointerdown` (unified mouse and touch input), capture normalized canvas coordinates and run immediate bounding-box + circular distance checks against active target entities in that exact frame.
* **Object Pooling:** Pre-allocate arrays for Targets, Bullet Holes, and Muzzle Flash particles at mission start to prevent JavaScript Garbage Collection (GC) micro-stutters during rapid fire.

### C. Audio & Feedback (Juice)

* **Web Audio API Synthesizer/Buffer:** Preload low-latency audio buffers for gunshot transients, metallic target *dings* (pitched higher for bullseyes), dry-fire clicks, and reload mechanics.
* **Visual Telemetry:** Instantaneous hit-marker overlays, floating score pop-ups, and a permanent bullet-hole decal stamped onto the target's local coordinate space upon impact.

---

## 5. UI / HUD Wireframe Requirements

* **Top Bar:** Mission Timer (countdown in `MM:SS.ms`), Current Score, and Streak Multiplier.
* **Bottom Right:** Visual Ammunition Counter (individual bullet icons that gray out as fired) + Flashing `[R] RELOAD` prompt at $\le 3$ rounds.
* **After-Action Report (AAR) Modal:** Displays at mission end with:
* Total Accuracy % ($\text{Shots Hit} / \text{Shots Fired}$)
* Headshot / Center-Mass ratio
* Average Reaction Time (in milliseconds, tracked from target spawn timestamp to hit timestamp)
* Action buttons: `Retry Mission` or `Deploy to Next Mission` (if qualified).
