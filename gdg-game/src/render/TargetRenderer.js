/**
 * TargetRenderer — draws military silhouette targets with concentric
 * scoring zones, bullet hole decals, wooden target stands, and ground shadows.
 *
 * Uses the Tactical Design System palette exclusively.
 * All geometry is procedural canvas vector paths — zero sprites.
 */
import { THEME } from '../constants/theme.js';

export const TargetRenderer = {
  /**
   * Draw all active targets.
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../game/Target.js').Target[]} targets
   */
  render(ctx, targets) {
    // Render far targets first (smaller), then close (larger) on top
    const sorted = [...targets].sort((a, b) => a.scale - b.scale);
    for (const t of sorted) {
      if (!t.active) continue;
      _drawTarget(ctx, t);
    }
  },
};

/* ── private rendering ────────────────────────────────── */

function _drawTarget(ctx, target) {
  const { x, y, scale } = target;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // ── Ground shadow oval ───────────────────
  ctx.fillStyle = 'rgba(20, 24, 21, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 195, 90, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Wooden target stand & legs ───────────
  ctx.fillStyle = '#4a3b2b';
  // Left and right support posts
  ctx.fillRect(-22, 60, 10, 140);
  ctx.fillRect(12, 60, 10, 140);
  // Diagonal cross-brace
  ctx.strokeStyle = '#382b1d';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-22, 90); ctx.lineTo(22, 170);
  ctx.moveTo(22, 90);  ctx.lineTo(-22, 170);
  ctx.stroke();

  // Distance placard attached to stand
  ctx.fillStyle = '#121619';
  ctx.fillRect(-35, 125, 70, 24);
  ctx.strokeStyle = THEME.TELEMETRY_SECONDARY;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-35, 125, 70, 24);
  ctx.fillStyle = THEME.HUD_PRIMARY;
  ctx.font = `700 11px ${THEME.FONT_PRIMARY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(target.distanceTier.toUpperCase(), 0, 137);

  // ── Backing board (cardboard tan) ────────
  ctx.fillStyle = '#b8a88a';
  ctx.strokeStyle = '#8a7a6a';
  ctx.lineWidth = 2;
  const bw = 180, bh = 260;
  ctx.fillRect(-bw / 2, -160, bw, bh);
  ctx.strokeRect(-bw / 2, -160, bw, bh);

  // Corner paper staples / clips
  ctx.fillStyle = '#555';
  ctx.fillRect(-bw / 2 + 6, -154, 8, 4);
  ctx.fillRect(bw / 2 - 14, -154, 8, 4);
  ctx.fillRect(-bw / 2 + 6, 90, 8, 4);
  ctx.fillRect(bw / 2 - 14, 90, 8, 4);

  // ── Silhouette body (dark tactical shape) ─
  ctx.fillStyle = THEME.TARGET_HOSTILE_FILL;
  ctx.beginPath();
  // Head (oval)
  ctx.ellipse(0, -120, 24, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  // Neck
  ctx.moveTo(-10, -92);
  ctx.lineTo(10, -92);
  // Right shoulder
  ctx.lineTo(12, -80);
  ctx.lineTo(60, -68);
  ctx.lineTo(62, -55);
  // Right arm stub
  ctx.lineTo(52, -50);
  // Right torso
  ctx.lineTo(45, 10);
  ctx.lineTo(42, 60);
  ctx.lineTo(35, 80);
  // Bottom
  ctx.lineTo(-35, 80);
  // Left torso (mirror)
  ctx.lineTo(-42, 60);
  ctx.lineTo(-45, 10);
  ctx.lineTo(-52, -50);
  ctx.lineTo(-62, -55);
  ctx.lineTo(-60, -68);
  ctx.lineTo(-12, -80);
  ctx.lineTo(-10, -92);
  ctx.closePath();
  ctx.fill();

  // Silhouette stroke
  ctx.strokeStyle = THEME.TARGET_HOSTILE_STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── Scoring zones (concentric rings) ─────
  // Periphery ring
  ctx.strokeStyle = 'rgba(216, 226, 220, 0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(0, -20, 130, 0, Math.PI * 2);
  ctx.stroke();

  // Torso ring
  ctx.strokeStyle = 'rgba(216, 226, 220, 0.35)';
  ctx.beginPath();
  ctx.arc(0, -20, 75, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center-mass ring
  ctx.strokeStyle = THEME.TARGET_HOSTILE_BULLSEYE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -20, 35, 0, Math.PI * 2);
  ctx.stroke();

  // Bullseye dot
  ctx.fillStyle = THEME.TARGET_HOSTILE_BULLSEYE;
  ctx.beginPath();
  ctx.arc(0, -20, 5, 0, Math.PI * 2);
  ctx.fill();

  // ── Zone labels ──────────────────────────
  ctx.fillStyle = 'rgba(216, 226, 220, 0.3)';
  ctx.font = `10px ${THEME.FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.fillText('100', 0, -8);
  ctx.fillText('50', 0, 42);
  ctx.fillText('25', 0, 90);

  // ── Bullet holes ─────────────────────────
  for (const hole of target.bulletHoles) {
    // Dark puncture hole
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(hole.localX, hole.localY, 4, 0, Math.PI * 2);
    ctx.fill();
    // Torn paper fiber ring
    ctx.strokeStyle = 'rgba(180, 170, 140, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(hole.localX, hole.localY, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
