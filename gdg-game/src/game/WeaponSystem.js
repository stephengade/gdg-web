/**
 * WeaponSystem — magazine, reload state, and recoil bloom mechanics.
 *
 * Bloom expands the aim-offset radius on rapid fire and decays over time.
 * Reload can be manual (R key, 1.2s) or auto on empty mag (2.0s).
 */
export class WeaponSystem {
  constructor() {
    this.magCapacity  = 15;
    this.currentMag   = 15;
    this.reserveAmmo  = 0;     // rounds not yet in mag
    this.reloading    = false;
    this.reloadTimer  = 0;
    this.reloadDuration = 0;

    // Bloom (recoil spread)
    this.bloomRadius    = 0;
    this.MAX_BLOOM      = 55;
    this.BLOOM_PER_SHOT = 16;
    this.BLOOM_DECAY    = 0.003; // exponent base for Math.pow(base, dt)

    // Reload durations
    this.MANUAL_RELOAD_TIME = 1.2;
    this.AUTO_RELOAD_TIME   = 2.0;
  }

  /**
   * Set up for a new mission.
   * @param {number} totalAmmo  Total rounds available (including first mag)
   * @param {number} magCap     Magazine capacity (default 15)
   */
  init(totalAmmo, magCap = 15) {
    this.magCapacity = magCap;
    this.currentMag  = Math.min(magCap, totalAmmo);
    this.reserveAmmo = totalAmmo - this.currentMag;
    this.reloading   = false;
    this.reloadTimer = 0;
    this.bloomRadius = 0;
  }

  update(dt) {
    // Bloom decay (exponential)
    if (this.bloomRadius > 0.5) {
      this.bloomRadius *= Math.pow(this.BLOOM_DECAY, dt);
    } else {
      this.bloomRadius = 0;
    }

    // Reload countdown
    if (this.reloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        this._completeReload();
      }
    }
  }

  /** Can the player fire right now? */
  canShoot() {
    return this.currentMag > 0 && !this.reloading;
  }

  /** Is all ammunition exhausted (mag empty + no reserve)? */
  isExhausted() {
    return this.currentMag === 0 && this.reserveAmmo === 0 && !this.reloading;
  }

  /** Fire one round. Call only if canShoot() is true. */
  fire() {
    this.currentMag--;
    this.bloomRadius = Math.min(this.MAX_BLOOM, this.bloomRadius + this.BLOOM_PER_SHOT);
  }

  /**
   * Begin reload.
   * @param {boolean} isAuto — true for empty-mag auto-reload (2.0s), false for manual (1.2s)
   */
  startReload(isAuto) {
    if (this.reloading || this.reserveAmmo <= 0) return;
    // Don't reload if mag is already full
    if (!isAuto && this.currentMag === this.magCapacity) return;

    this.reloading = true;
    this.reloadDuration = isAuto ? this.AUTO_RELOAD_TIME : this.MANUAL_RELOAD_TIME;
    this.reloadTimer = this.reloadDuration;
  }

  /** @returns {number} 0-1 reload progress (1 = done) */
  get reloadProgress() {
    if (!this.reloading) return 1;
    return 1 - (this.reloadTimer / this.reloadDuration);
  }

  /** @returns {number} total rounds remaining (mag + reserve) */
  get totalAmmo() {
    return this.currentMag + this.reserveAmmo;
  }

  /* ── private ──────────────────────────────── */

  _completeReload() {
    const need = this.magCapacity - this.currentMag;
    const load = Math.min(need, this.reserveAmmo);
    this.currentMag  += load;
    this.reserveAmmo -= load;
    this.reloading = false;
  }
}

