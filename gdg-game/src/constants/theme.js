/**
 * Tactical Design System — Color Tokens & Typography
 *
 * Spec:
 *   • HUD Container:            #121619 Tactical Gunmetal (subtle transparency)
 *   • Primary HUD & Crosshair:  #39FF14 Phosphor Green
 *   • Warning / Reload / Alert: #FF5400 Safety Blaze Orange
 *   • Secondary Telemetry:      #38BDF8 Steel Ice Blue
 *   • Data Readouts:            #E2E8F0 Cool Silver
 *   • Typography:               'Orbitron', monospace / tabular-nums
 */
export const THEME = {
  // HUD Container & Panels
  HUD_CONTAINER: '#121619',
  HUD_CONTAINER_BG: 'rgba(18, 22, 25, 0.88)',
  BG_RANGE_DAY: '#0e1210',
  BG_PANEL: 'rgba(18, 22, 25, 0.90)',

  // Primary HUD & Crosshair
  HUD_PRIMARY: '#39FF14',        // Phosphor Green (reflex optic)

  // Secondary Telemetry
  HUD_SECONDARY: '#38BDF8',      // Steel Ice Blue (metrics, labels, modes)
  TELEMETRY_SECONDARY: '#38BDF8',

  // Data Readouts & Stats
  DATA_READOUT: '#E2E8F0',       // Cool Silver (ballistics, timers, tables)

  // Alert & Warning
  ALERT_WARN: '#FF5400',         // Safety Blaze Orange (low ammo, reload, warnings)
  ALERT_DANGER: '#FF2A2A',       // Critical danger / ROE violation
  ALERT_ORANGE: '#FF5400',

  // Target Colors
  TARGET_HOSTILE_FILL: '#1e2420',
  TARGET_HOSTILE_STROKE: '#D8E2DC',
  TARGET_HOSTILE_BULLSEYE: '#FF5400',
  TARGET_CIVILIAN_FILL: '#E5E7EB',
  TARGET_CIVILIAN_MARKER: '#38BDF8',

  // Typography
  FONT_PRIMARY: "'Orbitron', 'JetBrains Mono', sans-serif",
  FONT_STACK: "'Orbitron', 'JetBrains Mono', sans-serif",
  FONT_MONO: "'JetBrains Mono', monospace",
};
