/**
 * FXRenderer — visual effects:
 *   - Camera micro-kick with exponential damping
 *   - Ballistic bullet tracers (from rifle muzzle downrange to impact)
 *   - Impact sparks on target hit
 *   - Ground dust puffs on dirt miss
 *   - Hit markers (X-shaped flash at impact point for 120ms)
 *   - Score popups (floating ±pts text that drifts up and fades)
 */
import { THEME } from '../constants/theme.js';

export class FXRenderer {
  constructor() {
    this.screenKickY  = 0;
    this.hitMarkers   = [];  // { x, y, timer, isCenter }
    this.scorePopups  = [];  // { x, y, text, timer, maxTimer, color }
    this.tracers      = [];  // { startX, startY, endX, endY, timer, maxTimer }
    this.sparks       = [];  // { x, y, vx, vy, color, timer, maxTimer }
    this.dustPuffs    = [];  // { x, y, vx, vy, size, alpha, timer, maxTimer }
  }

  /* ── mutations ────────────────────────── */

  addScreenKick() {
    this.screenKickY = -8;
  }

  addTracer(startX, startY, endX, endY) {
    this.tracers.push({
      startX,
      startY,
      endX,
      endY,
      timer: 0.08,
      maxTimer: 0.08,
    });
  }

  addHitMarker(x, y, isCenter) {
    this.hitMarkers.push({ x, y, timer: 0.12, isCenter });
  }

  addScorePopup(x, y, points, isCenter) {
    const text  = points > 0 ? `+${points}` : `${points}`;
    let color;
    if (points < 0) color = THEME.ALERT_DANGER;
    else if (isCenter) color = THEME.ALERT_WARN;
    else color = THEME.HUD_PRIMARY;

    this.scorePopups.push({ x, y, text, timer: 0.9, maxTimer: 0.9, color });
  }

  addImpactSparks(x, y, isCenter) {
    const count = isCenter ? 12 : 7;
    const baseColor = isCenter ? '#FFD700' : '#FFFFFF';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 160;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        color: Math.random() > 0.4 ? baseColor : '#FF8800',
        timer: 0.25,
        maxTimer: 0.25,
      });
    }
  }

  addDustPuff(x, y) {
    for (let i = 0; i < 9; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 40 + Math.random() * 90;
      this.dustPuffs.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 16,
        timer: 0.5,
        maxTimer: 0.5,
      });
    }
  }

  /* ── frame update ─────────────────────── */

  update(dt) {
    // Screen kick recovery (exponential damping)
    if (Math.abs(this.screenKickY) > 0.1) {
      this.screenKickY *= Math.pow(0.001, dt);
    } else {
      this.screenKickY = 0;
    }

    // Decay tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      this.tracers[i].timer -= dt;
      if (this.tracers[i].timer <= 0) this.tracers.splice(i, 1);
    }

    // Decay hit markers
    for (let i = this.hitMarkers.length - 1; i >= 0; i--) {
      this.hitMarkers[i].timer -= dt;
      if (this.hitMarkers[i].timer <= 0) this.hitMarkers.splice(i, 1);
    }

    // Decay + drift score popups
    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const sp = this.scorePopups[i];
      sp.y -= 55 * dt;
      sp.timer -= dt;
      if (sp.timer <= 0) this.scorePopups.splice(i, 1);
    }

    // Update sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spk = this.sparks[i];
      spk.x += spk.vx * dt;
      spk.y += spk.vy * dt;
      spk.vy += 400 * dt; // gravity
      spk.timer -= dt;
      if (spk.timer <= 0) this.sparks.splice(i, 1);
    }

    // Update dust puffs
    for (let i = this.dustPuffs.length - 1; i >= 0; i--) {
      const d = this.dustPuffs[i];
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.size += 18 * dt; // expand
      d.timer -= dt;
      if (d.timer <= 0) this.dustPuffs.splice(i, 1);
    }
  }

  /* ── rendering ────────────────────────── */

  render(ctx) {
    // 1. Tracers (high-speed laser-like streak from muzzle to target)
    for (const tr of this.tracers) {
      const alpha = Math.max(0, tr.timer / tr.maxTimer);
      ctx.save();
      ctx.globalAlpha = alpha;

      // Outer glow
      ctx.strokeStyle = '#FFAA22';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(tr.startX, tr.startY);
      ctx.lineTo(tr.endX, tr.endY);
      ctx.stroke();

      // Bright white core
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(tr.startX, tr.startY);
      ctx.lineTo(tr.endX, tr.endY);
      ctx.stroke();

      ctx.restore();
    }

    // 2. Dust puffs (on ground miss)
    for (const d of this.dustPuffs) {
      const progress = d.timer / d.maxTimer;
      ctx.save();
      ctx.globalAlpha = progress * 0.45;
      ctx.fillStyle = '#9e8c6e'; // desert dirt color
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Impact sparks
    for (const spk of this.sparks) {
      const alpha = Math.max(0, spk.timer / spk.maxTimer);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = spk.color;
      ctx.beginPath();
      ctx.arc(spk.x, spk.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Hit markers (X shape)
    for (const hm of this.hitMarkers) {
      const alpha = Math.max(0, hm.timer / 0.12);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = hm.isCenter ? THEME.ALERT_DANGER : '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.shadowColor = hm.isCenter ? THEME.ALERT_DANGER : '#FFF';
      ctx.shadowBlur = 6;
      const s = 10;
      ctx.beginPath();
      ctx.moveTo(hm.x - s, hm.y - s); ctx.lineTo(hm.x + s, hm.y + s);
      ctx.moveTo(hm.x + s, hm.y - s); ctx.lineTo(hm.x - s, hm.y + s);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Score popups
    for (const sp of this.scorePopups) {
      const alpha = Math.max(0, sp.timer / sp.maxTimer);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = sp.color;
      ctx.font = `bold 22px ${THEME.FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(sp.text, sp.x, sp.y);
      ctx.restore();
    }
  }

  reset() {
    this.screenKickY = 0;
    this.hitMarkers.length  = 0;
    this.scorePopups.length = 0;
    this.tracers.length     = 0;
    this.sparks.length      = 0;
    this.dustPuffs.length   = 0;
  }
}
