/**
 * ReticleRenderer — holographic reflex sight optics (#39FF14 Phosphor Green).
 *
 * Modeled after military reflex holographic sights:
 *   - 2px sharp center aiming pip
 *   - Outer 65 MOA broken circle ring with 4 compass tick posts
 *   - Inner dynamic bloom ring showing ballistic spread expansion
 *   - Phosphor green glow matching real optical coatings
 */
import { THEME } from '../constants/theme.js';

const TICK_LEN    = 16;
const CENTER_DOT  = 2.5;
const BASE_GAP    = 8;
const BLOOM_SCALE = 1.0;

export const ReticleRenderer = {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x — pointer logical X
   * @param {number} y — pointer logical Y
   * @param {number} bloomRadius — current weapon bloom
   */
  render(ctx, x, y, bloomRadius) {
    const gap = BASE_GAP + bloomRadius * BLOOM_SCALE;

    ctx.save();
    ctx.translate(x, y);

    // Phosphor green reflex glow
    ctx.shadowColor = 'rgba(57, 255, 20, 0.7)';
    ctx.shadowBlur = 6;

    // 1. Center Illuminated Pip
    ctx.fillStyle = THEME.HUD_PRIMARY;
    ctx.beginPath();
    ctx.arc(0, 0, CENTER_DOT, 0, Math.PI * 2);
    ctx.fill();

    // 2. Dynamic Bloom Ring (faint dotted circle that shows current spread)
    if (bloomRadius > 1.0) {
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, gap, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Four Crosshair Ticks with Mil-Notches
    ctx.strokeStyle = THEME.HUD_PRIMARY;
    ctx.lineWidth = 2;

    ctx.beginPath();
    // Up
    ctx.moveTo(0, -gap);
    ctx.lineTo(0, -gap - TICK_LEN);
    // Down
    ctx.moveTo(0, gap);
    ctx.lineTo(0, gap + TICK_LEN);
    // Left
    ctx.moveTo(-gap, 0);
    ctx.lineTo(-gap - TICK_LEN, 0);
    // Right
    ctx.moveTo(gap, 0);
    ctx.lineTo(gap + TICK_LEN, 0);
    ctx.stroke();

    // Outer corner reflex brackets (EOTech-style framing)
    const bracketR = Math.max(26, gap + 14);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.55)';

    const arcLen = 0.28;
    // 4 quadrants
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      ctx.beginPath();
      ctx.arc(0, 0, bracketR, angle - arcLen, angle + arcLen);
      ctx.stroke();
    }

    ctx.restore();
  },
};
