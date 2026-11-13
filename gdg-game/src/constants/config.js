/**
 * Global configuration constants.
 * Logical resolution, frame timing, and shared physics values.
 */
export const CONFIG = {
  // Logical canvas resolution — all game math uses this coordinate space
  LOGICAL_WIDTH: 1920,
  LOGICAL_HEIGHT: 1080,

  // Maximum delta time cap (prevents spiral-of-death on tab-away)
  MAX_DELTA: 0.05,
};

