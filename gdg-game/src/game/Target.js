/**
 * Target — single target entity with position, distance scaling, hit zones,
 * and local-space bullet hole tracking.
 *
 * Hit zones are concentric circles from the target's center point:
 *   CENTER_MASS (inner) → TORSO (mid) → PERIPHERY (outer) → miss
 */
export class Target {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.distanceTier = '25m';
    this.scale = 1.0;
    this.active = false;
    this.bulletHoles = [];  // { localX, localY }
    this.spawnTime = 0;

    // Base zone radii at 1.0× scale (25m)
    this.BASE_INNER = 35;   // center mass / head
    this.BASE_MID   = 75;   // torso
    this.BASE_OUTER = 130;  // periphery (full silhouette)
  }

  static DISTANCE_SCALES = { '25m': 1.0, '50m': 0.65, '100m': 0.40 };

  /**
   * Initialize / reuse a target from the pool.
   */
  init(x, y, distanceTier) {
    this.x = x;
    this.y = y;
    this.distanceTier = distanceTier;
    this.scale = Target.DISTANCE_SCALES[distanceTier] || 1.0;
    this.active = true;
    this.bulletHoles.length = 0;
    this.spawnTime = performance.now();
    return this;
  }

  get centerY()      { return this.y - 20 * this.scale; }
  get innerRadius()  { return this.BASE_INNER * this.scale; }
  get midRadius()    { return this.BASE_MID   * this.scale; }
  get outerRadius()  { return this.BASE_OUTER * this.scale; }

  /**
   * Test a shot coordinate against hit zones.
   * @returns {'CENTER_MASS'|'TORSO'|'PERIPHERY'|null}
   */
  checkHit(shotX, shotY) {
    if (!this.active) return null;
    const dx = shotX - this.x;
    const dy = shotY - this.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= this.innerRadius)  return 'CENTER_MASS';
    if (dist <= this.midRadius)    return 'TORSO';
    if (dist <= this.outerRadius)  return 'PERIPHERY';
    return null;
  }

  /**
   * Stamp a bullet hole in target-local coordinates so it travels with the target.
   */
  addBulletHole(shotX, shotY) {
    this.bulletHoles.push({
      localX: (shotX - this.x) / this.scale,
      localY: (shotY - this.y) / this.scale,
    });
  }

  reset() {
    this.active = false;
    this.bulletHoles.length = 0;
  }
}

