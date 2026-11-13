/**
 * ScoreEngine — tracks points, accuracy, streak multiplier,
 * hit-zone breakdown, and per-target reaction times.
 *
 * Streak rules:
 *   - Consecutive CENTER_MASS hits build the multiplier.
 *   - TORSO / PERIPHERY hits score but reset the streak.
 *   - Misses score -100 and reset the streak.
 *   - Multiplier: streak>=2 → min(3.0, 1.0 + (streak-1)*0.5)
 */
export class ScoreEngine {
  constructor() { this.reset(); }

  reset() {
    this.totalScore     = 0;
    this.shotsFired     = 0;
    this.shotsHit       = 0;
    this.centerMassHits = 0;
    this.torsoHits      = 0;
    this.peripheryHits  = 0;
    this.misses         = 0;
    this.streak         = 0;
    this.multiplier     = 1.0;
    this.reactionTimes  = [];  // ms per hit
  }

  /* ── computed stats ────────────────────── */

  get accuracy() {
    return this.shotsFired === 0 ? 0 : (this.shotsHit / this.shotsFired) * 100;
  }

  get centerMassRatio() {
    return this.shotsHit === 0 ? 0 : (this.centerMassHits / this.shotsHit) * 100;
  }

  get avgReactionTime() {
    const t = this.reactionTimes;
    return t.length === 0 ? 0 : t.reduce((a, b) => a + b, 0) / t.length;
  }

  /* ── recording ─────────────────────────── */

  static ZONE_POINTS = { CENTER_MASS: 100, TORSO: 50, PERIPHERY: 25 };

  /**
   * Record a successful hit.
   * @param {'CENTER_MASS'|'TORSO'|'PERIPHERY'} zone
   * @param {number} [reactionMs] — ms from target spawn to hit
   * @returns {number} actual points awarded (after multiplier)
   */
  recordHit(zone, reactionMs = 0) {
    this.shotsFired++;
    this.shotsHit++;
    if (reactionMs > 0) this.reactionTimes.push(reactionMs);

    const base = ScoreEngine.ZONE_POINTS[zone] || 0;

    if (zone === 'CENTER_MASS') {
      this.centerMassHits++;
      this.streak++;
    } else {
      if (zone === 'TORSO') this.torsoHits++;
      else this.peripheryHits++;
      this.streak = 0;
    }

    this._updateMultiplier();
    const pts = Math.round(base * this.multiplier);
    this.totalScore += pts;
    return pts;
  }

  /** Record a miss (-100 pts, streak reset). */
  recordMiss() {
    this.shotsFired++;
    this.misses++;
    this.streak = 0;
    this._updateMultiplier();
    this.totalScore -= 100;
  }

  /** Bundle stats for the AAR screen. */
  getStats() {
    return {
      totalScore:      this.totalScore,
      accuracy:        this.accuracy,
      centerMassRatio: this.centerMassRatio,
      avgReactionTime: this.avgReactionTime,
      shotsFired:      this.shotsFired,
      shotsHit:        this.shotsHit,
      centerMassHits:  this.centerMassHits,
    };
  }

  /* ── private ───────────────────────────── */

  _updateMultiplier() {
    this.multiplier = this.streak >= 2
      ? Math.min(3.0, 1.0 + (this.streak - 1) * 0.5)
      : 1.0;
  }
}

