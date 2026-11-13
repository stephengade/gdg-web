---
name: tactical-design-system
description: Enforce the OAU Cadet Training military HUD aesthetic, color tokens, mil-dot optic overlays, and procedural 3D range/target styling.
---

# OAU Cadet Training — Tactical HUD & 3D Aesthetic System

## 1. Brand & Aesthetic Direction
- **Identity:** OAU Cadet Training (Est. 1962) — Military Ballistics & Deployment Qualification Simulator.
- **Color Tokens:**
  - `HUD_PRIMARY`: `#00FF66` (Phosphor tactical green — active telemetry, mil-dot reticles, wind vectors)
  - `HUD_GOLD`: `#FFB800` (OAU Cadet Gold — badges, streak multipliers, low-ammo warnings)
  - `ALERT_DANGER`: `#FF2A2A` (Crimson — red-dot sight center, critical 100-pt hit marker, ROE fail)
  - `BG_PANEL`: `rgba(14, 19, 15, 0.88)` with `1px solid rgba(0, 255, 102, 0.35)` sharp borders (`border-radius: 0px`).
- **Typography:** Monospace (`'JetBrains Mono', 'Fira Code', monospace`) with `font-variant-numeric: tabular-nums` and `UPPERCASE` labels.

## 2. 3D Optic & HUD Overlays
- **Hip-Fire Crosshair:** 4-tick dynamic HUD crosshair at screen center that expands with movement/rapid fire and fades out (`opacity: 0`) when fully transitioned into ADS.
- **ADS Optic Sight:** 3D holographic housing with a glowing `#FF2A2A` center dot and subtle horizontal windage / vertical elevation hash marks for 100m–200m bullet drop holdover.
- **Breath Stamina Bar & Wind Gauge:** Minimalist horizontal lung stamina bar below the optic when holding `Spacebar`, and a top-center Wind Vector widget (`WIND: 4.5 m/s >>>`) in Mission 5.

## 3. Call of Duty Mobile Ergonomic Touch Architecture
- **Zero Directional Keys / D-Pads:** Stationary firing line requires no walking controls.
- **Full-Screen Invisible Touch-Drag Aiming:** Swiping anywhere outside buttons adjusts camera pitch and yaw.
- **Dynamic ADS Sensitivity:** Scales look sensitivity by `0.45x` (or `0.25x` on DL-50 Sniper) for micro-adjustments.
- **Multi-Touch Finger Tracking:** Aim finger identifier tracked separately from fire/scope buttons.
- **Edge-Hugging Circular Buttons:**
  - Primary Right Fire: `bottom: 28px; right: 32px;` (`76px x 76px`, circular, with aim-drag support).
  - Secondary Left Fire (Claw): `bottom: 110px; left: 28px;` (`64px x 64px`, circular).
  - Tap-to-ADS Toggle: `bottom: 118px; right: 28px;` (`56px x 56px`, circular, active `#00FF66` border).
  - Hold Breath: `bottom: 28px; left: 32px;` (`56px x 56px`, circular with stamina ring, **visible only when ADS is active**).
  - Reload: `bottom: 28px; right: 124px;` (`48px x 48px`, circular, amber pulse when ammo $\le 3$).
  - Weapon Swap: `bottom: 84px; right: 124px;` (`44px x 44px`, circular).
- **Translucency & Screen Clarity:** Center 80% viewport unobstructed; `rgba(14, 19, 15, 0.35)` background, `opacity: 0.65` resting, `opacity: 1.0` pressed. Visible only on touch devices (`@media (pointer: coarse)`).

