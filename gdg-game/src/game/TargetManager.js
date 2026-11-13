/**
 * TargetManager — spawns and manages the pool of Target entities.
 * For Phase 1 (static targets), simply initializes targets from mission config.
 */
import { Target } from './Target.js';

const MAX_TARGETS = 12;

export class TargetManager {
  constructor() {
    // Pre-allocate pool
    this.pool = [];
    for (let i = 0; i < MAX_TARGETS; i++) {
      this.pool.push(new Target());
    }
  }

  /**
   * Spawn targets from a mission configuration array.
   * @param {{ x: number, y: number, distance: string }[]} configs
   */
  spawnFromConfig(configs) {
    this.resetAll();
    for (let i = 0; i < configs.length && i < MAX_TARGETS; i++) {
      const c = configs[i];
      this.pool[i].init(c.x, c.y, c.distance);
    }
  }

  /** @returns {Target[]} only active targets */
  getActive() {
    return this.pool.filter(t => t.active);
  }

  /**
   * Test a shot against all active targets (front-to-back by scale, largest first).
   * @returns {{ target: Target, zone: string } | null}
   */
  checkHit(shotX, shotY) {
    // Check closest (largest) targets first
    const active = this.getActive().sort((a, b) => b.scale - a.scale);
    for (const target of active) {
      const zone = target.checkHit(shotX, shotY);
      if (zone) return { target, zone };
    }
    return null;
  }

  resetAll() {
    for (const t of this.pool) t.reset();
  }
}

