/**
 * Declarative 3D Campaign Missions Schema
 *
 * Defines all 5 missions across lanes (25m - 200m), popup timers,
 * lateral movement speeds, wind conditions, and qualification criteria.
 */
export const MISSIONS = [
  {
    id: 1,
    codename: "DYNAMIC ZEROING",
    ammoCount: 20,
    magCapacity: 15,
    durationSec: 50,
    lanesMeters: [25, 50, 100],
    targetPopupDurationSec: null,
    targetSpeedMps: 2.2, // Moving targets on motorized tracks!
    allowCivilians: false,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 60, minScore: 800, maxReactionMs: null }
  },
  {
    id: 2,
    codename: "SNAP REFLEX",
    ammoCount: 20,
    magCapacity: 20,
    durationSec: 45,
    lanesMeters: [25, 50, 75],
    targetPopupDurationSec: 2.4, // pop-ups drop after 2.4s
    targetSpeedMps: 3.0, // Moving pop-up silhouettes!
    allowCivilians: false,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 65, minScore: 1200, maxReactionMs: 1200 }
  },
  {
    id: 3,
    codename: "STRAFE TRACKING",
    ammoCount: 25,
    magCapacity: 25,
    durationSec: 50,
    lanesMeters: [50, 100, 150],
    targetPopupDurationSec: null,
    targetSpeedMps: 4.8, // 4.8 m/s lateral strafe requiring bullet leading!
    allowCivilians: false,
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 65, minScore: 1600, maxReactionMs: null }
  },
  {
    id: 4,
    codename: "FRIEND OR FOE",
    ammoCount: 25,
    magCapacity: 25,
    durationSec: 50,
    lanesMeters: [25, 50, 100],
    targetPopupDurationSec: 2.2,
    targetSpeedMps: 3.5,
    allowCivilians: true, // Non-combatants present (instant ROE fail if hit)
    windSpeedMps: [0, 0],
    nightVisionMode: false,
    opticZoomFov: 45,
    qualification: { minAccuracyPct: 70, minScore: 1600, maxReactionMs: null }
  },
  {
    id: 5,
    codename: "DEPLOYMENT QUAL",
    ammoCount: 30,
    magCapacity: 30,
    durationSec: 60,
    lanesMeters: [50, 100, 150, 200],
    targetPopupDurationSec: 3.2,
    targetSpeedMps: 4.5,
    allowCivilians: true,
    windSpeedMps: [3.5, -5.0], // Shifts at t = 30s
    nightVisionMode: true,
    opticZoomFov: 25, // 4x ACOG Scope (25 deg FOV)
    qualification: { minAccuracyPct: 70, minScore: 2000, maxReactionMs: null }
  }
];

