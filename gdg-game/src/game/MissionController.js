/**
 * MissionController — orchestrates a single mission run.
 *
 * Manages: countdown → active firing → end detection → results.
 * Coordinates WeaponSystem, TargetManager, ScoreEngine, and FXRenderer.
 */
import { WeaponSystem } from './WeaponSystem.js';
import { TargetManager } from './TargetManager.js';
import { ScoreEngine } from './ScoreEngine.js';
import { HUDRenderer } from '../render/HUDRenderer.js';

export class MissionController {
  constructor() {
    this.weapon  = new WeaponSystem();
    this.targets = new TargetManager();
    this.score   = new ScoreEngine();

    this.mission        = null;   // current mission config
    this.phase          = 'IDLE'; // IDLE | COUNTDOWN | ACTIVE | ENDED
    this.countdownTimer = 0;
    this.missionTimer   = 0;
    this.countdownText  = '';
  }

  /* ── lifecycle ────────────────────────── */

  /**
   * Begin a mission. Enters the 3-second countdown.
   * @param {object} missionConfig — e.g. Mission1
   */
  startMission(missionConfig) {
    this.mission = missionConfig;
    this.weapon.init(missionConfig.totalAmmo, missionConfig.magCapacity);
    this.targets.spawnFromConfig(missionConfig.targets);
    this.score.reset();
    this.phase = 'COUNTDOWN';
    this.countdownTimer = 3.0;
    this.missionTimer   = missionConfig.timeLimit;
    this.countdownText  = '3';
  }

  /**
   * Per-frame update.
   * @param {number} dt — seconds
   * @param {import('../engine/InputHandler.js').InputHandler} input
   * @param {import('../render/FXRenderer.js').FXRenderer} fx
   * @param {import('../render/WeaponRenderer.js').WeaponRenderer} [weaponRend]
   * @returns {'RUNNING'|'PASS'|'FAIL'} status signal for main.js
   */
  update(dt, input, fx, weaponRend) {
    if (this.phase === 'COUNTDOWN') {
      this.countdownTimer -= dt;
      const sec = Math.ceil(this.countdownTimer);
      this.countdownText = sec > 0 ? `${sec}` : 'FIRE!';
      if (this.countdownTimer <= -0.6) {
        this.phase = 'ACTIVE';
      }
      // Consume clicks so they don't queue up
      input.consumeClicks();
      return 'RUNNING';
    }

    if (this.phase === 'ACTIVE') {
      this.missionTimer -= dt;
      this.weapon.update(dt);
      fx.update(dt);

      // Manual reload (Keyboard [R] for desktop)
      if (input.wasPressed('R') && !this.weapon.reloading) {
        this.weapon.startReload(false);
      }

      // Process clicks / taps
      const clicks = input.consumeClicks();
      for (const click of clicks) {
        // Mobile touch reload check (tapping reload button or ammo counter)
        if (HUDRenderer.checkReloadTouch(click.x, click.y)) {
          if (!this.weapon.reloading && this.weapon.reserveAmmo > 0 && this.weapon.currentMag < this.weapon.magCapacity) {
            this.weapon.startReload(false);
          }
          continue; // Do not fire when tapping reload!
        }

        this._processShot(click.x, click.y, fx, weaponRend);
      }

      // End conditions
      if (this.missionTimer <= 0 || this.weapon.isExhausted()) {
        return this._endMission();
      }
      return 'RUNNING';
    }

    // ENDED or IDLE — no-op
    input.consumeClicks();
    return 'RUNNING';
  }

  /** Produce the final results object for the AAR screen. */
  getResults() {
    const stats  = this.score.getStats();
    const passed = this.mission.checkPass(stats);
    return { ...stats, passed };
  }

  /* ── private ──────────────────────────── */

  _processShot(clickX, clickY, fx, weaponRend) {
    if (!this.weapon.canShoot()) return;

    // Apply bloom offset (random point within bloom circle)
    const angle     = Math.random() * Math.PI * 2;
    const magnitude = Math.random() * this.weapon.bloomRadius;
    const shotX = clickX + Math.cos(angle) * magnitude;
    const shotY = clickY + Math.sin(angle) * magnitude;

    // Fire the weapon
    this.weapon.fire();
    fx.addScreenKick();

    if (weaponRend) {
      weaponRend.triggerShot();
      const muzzle = weaponRend.getMuzzlePosition(clickX);
      fx.addTracer(muzzle.x, muzzle.y, shotX, shotY);
    }

    // Hit test against targets
    const result = this.targets.checkHit(shotX, shotY);

    if (result) {
      const reactionMs = performance.now() - result.target.spawnTime;
      const pts = this.score.recordHit(result.zone, reactionMs);
      result.target.addBulletHole(shotX, shotY);

      const isCenter = result.zone === 'CENTER_MASS';
      fx.addHitMarker(shotX, shotY, isCenter);
      fx.addImpactSparks(shotX, shotY, isCenter);
      fx.addScorePopup(shotX, shotY - 40, pts, isCenter);
    } else {
      this.score.recordMiss();
      fx.addHitMarker(shotX, shotY, false);
      fx.addDustPuff(shotX, shotY);
      fx.addScorePopup(shotX, shotY - 40, -100, false);
    }

    // Auto-reload on empty mag
    if (this.weapon.currentMag === 0 && this.weapon.reserveAmmo > 0) {
      this.weapon.startReload(true);
    }
  }

  /**
   * Finalize the mission.
   * @returns {'PASS'|'FAIL'}
   */
  _endMission() {
    this.phase = 'ENDED';
    const stats = this.score.getStats();
    return this.mission.checkPass(stats) ? 'PASS' : 'FAIL';
  }
}

