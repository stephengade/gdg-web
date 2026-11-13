---
name: mission-architecture
description: Data-driven 3D mission configurations, qualification thresholds, and decoupled state transitions.
---

# Data-Driven 3D Mission Architecture

## 1. Declarative `missions.js` Schema
Drive all 5 campaign missions from a single structured config array without hardcoding mission branches inside the physics or target classes:
```js
export const MISSIONS = [
  {
    id: 1,
    codename: "BASIC ZEROING",
    ammoCount: 15,
    durationSec: 45,
    lanesMeters: [25, 50, 100],
    targetPopupDurationSec: null,
    targetSpeedMps: 0,
    allowCivilians: false,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 75, minScore: 1000, maxReactionMs: null }
  },
  {
    id: 2,
    codename: "SNAP REFLEX",
    ammoCount: 20,
    durationSec: 45,
    lanesMeters: [25, 50, 75],
    targetPopupDurationSec: 2.2,
    targetSpeedMps: 0,
    allowCivilians: false,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 75, minScore: 1400, maxReactionMs: 1100 }
  },
  {
    id: 3,
    codename: "STRAFE TRACKING",
    ammoCount: 25,
    durationSec: 50,
    lanesMeters: [50, 100, 150],
    targetPopupDurationSec: null,
    targetSpeedMps: 4.5,
    allowCivilians: false,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 70, minScore: 1800, maxReactionMs: null }
  },
  {
    id: 4,
    codename: "FRIEND OR FOE",
    ammoCount: 25,
    durationSec: 50,
    lanesMeters: [25, 50, 100],
    targetPopupDurationSec: 2.0,
    targetSpeedMps: 2.5,
    allowCivilians: true,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 75, minScore: 1800, maxReactionMs: null }
  },
  {
    id: 5,
    codename: "DEPLOYMENT QUAL",
    ammoCount: 30,
    durationSec: 60,
    lanesMeters: [50, 100, 150, 200],
    targetPopupDurationSec: 3.0,
    targetSpeedMps: 4.0,
    allowCivilians: true,
    windSpeedMps: [3.5, -5.0], // Shifts at t = 30s
    nightVisionMode: true,
    opticZoomFov: 25, // 4x ACOG Scope
    qualification: { minAccuracyPct: 80, minScore: 2200, maxReactionMs: null }
  }
];
```

