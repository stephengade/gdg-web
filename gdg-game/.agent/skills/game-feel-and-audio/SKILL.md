---
name: game-feel-and-audio
description: Tactile 3D combat feedback ("juice"), muzzle flash lighting, speed-of-sound delayed target clangs, and procedural Web Audio API synthesis.
---

# Procedural Audio & 3D Combat Juice

## 1. Acoustic Realism (Speed of Sound Delay)
- Use Web Audio API (`AudioContext`) with zero external MP3 dependencies.
- **Gunshot & Mechanical Bolt:** Immediate playback on shot (`0ms` delay) combining filtered white-noise burst + `150Hz -> 40Hz` low-end punch.
- **Distance-Delayed Target Clang:** When a bullet hits a steel/reactive target at distance `D` meters, schedule the metallic *ding* oscillator (`880Hz` torso, `1320Hz` center-mass bullseye) at `audioCtx.currentTime + (D / 343)` seconds so 150m–200m hits have an authentic acoustic travel delay!
- **Breath Audio:** Subtle low-pass inhaled/exhaled noise envelope when holding breath (`Spacebar`), plus a muffled `60Hz` heartbeat thump when stamina drops below 25%.

## 2. 3D Visual Telemetry
- **Muzzle Flash Light:** Flash a `THREE.PointLight(0xffaa33, 4, 6)` at the barrel tip for `45ms` on fire.
- **3D Tracer & Spark Burst:** Render an elongated glowing mesh/line behind each in-flight projectile, and burst 8 pooled spark particles along the surface normal upon target impact.
- **Hit-Marker & Distance Readout:** Flash a crisp center-screen `X` hit-marker (`white` for body, `#FF2A2A` for 100-pt bullseye) alongside a miniature telemetry tag (`+100 PTS [100m | LEAD 0.42m]`).
