/**
 * HUDRenderer — tactical heads-up display overlay with smartphone touch optimization.
 *
 * Spec:
 *   • Container:            #121619 Tactical Gunmetal (rgba subtle transparency)
 *   • Primary & Crosshair:  #39FF14 Phosphor Green
 *   • Warning / Reload:     #FF5400 Safety Blaze Orange
 *   • Secondary Telemetry:  #38BDF8 Steel Ice Blue
 *   • Data Readouts:        #E2E8F0 Cool Silver
 *   • Typography:           'Orbitron' for headers/status & 'JetBrains Mono' for tabular numbers
 *
 * Mobile features:
 *   - Dedicated on-screen Touch Reload Button (thumb-accessible)
 *   - Exported touch hit-box checkReloadTouch(x, y)
 */
import { CONFIG } from '../constants/config.js';
import { THEME } from '../constants/theme.js';

const W = CONFIG.LOGICAL_WIDTH;
const H = CONFIG.LOGICAL_HEIGHT;

// Touch Reload Button hitbox (logical space)
export const RELOAD_BTN = {
  x: W - 240,
  y: H - 90,
  w: 200,
  h: 62,
};

export const HUDRenderer = {
  /**
   * Check if a touch/pointer coordinates hit the on-screen reload button or ammo bay.
   */
  checkReloadTouch(x, y) {
    // Touch button
    if (x >= RELOAD_BTN.x && x <= RELOAD_BTN.x + RELOAD_BTN.w &&
        y >= RELOAD_BTN.y && y <= RELOAD_BTN.y + RELOAD_BTN.h) {
      return true;
    }
    // Entire bottom-right ammo bay is also tap-to-reload
    if (x >= W - 320 && x <= W - 20 && y >= H - 120 && y <= H) {
      return true;
    }
    return false;
  },

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} state
   */
  render(ctx, state) {
    ctx.save();

    // ══════════ TOP BAR CONTAINER ══════════════════
    // Tactical Gunmetal container (#121619) with subtle transparency
    ctx.fillStyle = THEME.HUD_CONTAINER_BG;
    ctx.fillRect(0, 0, W, 58);

    // Bottom container border (Phosphor Green accent)
    ctx.strokeStyle = THEME.HUD_PRIMARY;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(0, 58); ctx.lineTo(W, 58);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Corner tactical notches
    ctx.fillStyle = THEME.HUD_PRIMARY;
    ctx.fillRect(20, 56, 12, 3);
    ctx.fillRect(W - 32, 56, 12, 3);

    // ── Left: Mission Timer & Weapon Mode ──
    const timeColor = state.timer <= 5 ? THEME.ALERT_WARN : THEME.DATA_READOUT;

    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 12px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0.08em';
    ctx.fillText('MISSION CLOCK', 36, 22);

    ctx.fillStyle = timeColor;
    ctx.font = `bold 24px ${THEME.FONT_MONO}`;
    ctx.fillText(_formatTime(state.timer), 36, 46);

    // Weapon Mode Telemetry
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 11px ${THEME.FONT_PRIMARY}`;
    ctx.fillText('SYS // 5.56 NATO  •  SEMI', 210, 22);
    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `14px ${THEME.FONT_MONO}`;
    ctx.fillText('OPTIC: 1X HOLO', 210, 44);

    // ── Center: Target Score Readout ──
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 12px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.fillText('COMBAT SCORE', W / 2, 22);

    ctx.fillStyle = THEME.HUD_PRIMARY; // Phosphor Green
    ctx.font = `bold 32px ${THEME.FONT_MONO}`;
    ctx.shadowColor = 'rgba(57, 255, 20, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText(`${state.score}`, W / 2, 48);
    ctx.shadowBlur = 0;

    // ── Right: Streak Multiplier & Accuracy ──
    if (state.multiplier > 1.0) {
      ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
      ctx.font = `600 12px ${THEME.FONT_PRIMARY}`;
      ctx.textAlign = 'left';
      ctx.fillText('STREAK', W / 2 + 130, 22);

      ctx.fillStyle = THEME.ALERT_WARN; // Safety Blaze Orange
      ctx.font = `bold 26px ${THEME.FONT_MONO}`;
      ctx.fillText(`×${state.multiplier.toFixed(1)}`, W / 2 + 130, 46);
    }

    // Qualification Telemetry (Far Right)
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 11px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'right';
    ctx.fillText('QUAL STATUS', W - 36, 22);
    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `bold 14px ${THEME.FONT_MONO}`;
    ctx.fillText('DRILL ACTIVE', W - 36, 44);


    // ══════════ AMMO BAY & TOUCH RELOAD (Bottom Right) ══════════
    const lowAmmo = state.mag <= 3;
    const emptyMag = state.mag === 0;

    // Tactical Gunmetal container for Ammo & Reload
    const bayW = 320;
    const bayH = 100;
    const bayX = W - bayW - 20;
    const bayY = H - bayH - 16;

    ctx.fillStyle = THEME.HUD_CONTAINER_BG;
    ctx.fillRect(bayX, bayY, bayW, bayH);
    ctx.strokeStyle = lowAmmo ? THEME.ALERT_WARN : THEME.TELEMETRY_SECONDARY;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bayX, bayY, bayW, bayH);

    // Header label
    ctx.fillStyle = lowAmmo ? THEME.ALERT_WARN : THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 11px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'left';
    ctx.fillText('MAGAZINE READOUT', bayX + 16, bayY + 22);

    // Numerical readout (Cool Silver)
    ctx.textAlign = 'right';
    ctx.fillStyle = emptyMag ? THEME.ALERT_WARN : THEME.DATA_READOUT;
    ctx.font = `bold 20px ${THEME.FONT_MONO}`;
    ctx.fillText(`${state.mag} / ${state.magCap}`, bayX + bayW - 16, bayY + 24);

    // Bullet Icons
    const bulletW = 8;
    const bulletH = 22;
    const gap = 5;
    const bulletsStartX = bayX + 16;
    const bulletsY = bayY + 54;

    for (let i = 0; i < state.magCap; i++) {
      const bx = bulletsStartX + i * (bulletW + gap);
      const loaded = i < state.mag;

      if (loaded) {
        if (lowAmmo) {
          const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.012);
          ctx.fillStyle = pulse > 0.5 ? THEME.ALERT_WARN : THEME.HUD_PRIMARY;
        } else {
          ctx.fillStyle = THEME.HUD_PRIMARY; // Phosphor green
        }
      } else {
        ctx.fillStyle = 'rgba(226, 232, 240, 0.15)'; // faint cool silver
      }

      ctx.beginPath();
      ctx.moveTo(bx, bulletsY);
      ctx.lineTo(bx, bulletsY - bulletH + 3);
      ctx.arcTo(bx, bulletsY - bulletH, bx + bulletW / 2, bulletsY - bulletH - 2, 3);
      ctx.arcTo(bx + bulletW, bulletsY - bulletH, bx + bulletW, bulletsY - bulletH + 3, 3);
      ctx.lineTo(bx + bulletW, bulletsY);
      ctx.closePath();
      ctx.fill();
    }

    // ── Dedicated Mobile Touch Reload Button ──
    const btnY = bayY + 62;
    const btnW = bayW - 32;
    const btnH = 28;
    const btnX = bayX + 16;

    if (state.reloading) {
      // Reload in progress bar
      ctx.fillStyle = 'rgba(255, 84, 0, 0.2)';
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.fillStyle = THEME.ALERT_WARN;
      ctx.fillRect(btnX, btnY, btnW * state.reloadProgress, btnH);
      ctx.strokeStyle = THEME.ALERT_WARN;
      ctx.lineWidth = 1;
      ctx.strokeRect(btnX, btnY, btnW, btnH);

      ctx.fillStyle = THEME.DATA_READOUT;
      ctx.font = `bold 11px ${THEME.FONT_PRIMARY}`;
      ctx.textAlign = 'center';
      ctx.fillText('RELOADING...', btnX + btnW / 2, btnY + 18);
    } else {
      // Touch button prompt
      const btnBg = lowAmmo ? 'rgba(255, 84, 0, 0.25)' : 'rgba(56, 189, 248, 0.12)';
      const btnBorder = lowAmmo ? THEME.ALERT_WARN : THEME.TELEMETRY_SECONDARY;
      const btnText = lowAmmo ? 'TAP TO RELOAD [R]' : 'RELOAD [R]';

      ctx.fillStyle = btnBg;
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeStyle = btnBorder;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(btnX, btnY, btnW, btnH);

      ctx.fillStyle = lowAmmo ? THEME.ALERT_WARN : THEME.DATA_READOUT;
      ctx.font = `bold 11px ${THEME.FONT_PRIMARY}`;
      ctx.textAlign = 'center';
      ctx.fillText(btnText, btnX + btnW / 2, btnY + 18);
    }

    // ══════════ RELOAD OVERLAY BANNER (Center Screen) ══════════
    if (state.reloading) {
      const bannerW = 340;
      const bannerH = 50;
      const bannerX = W / 2 - bannerW / 2;
      const bannerY = H / 2 + 50;

      ctx.fillStyle = THEME.HUD_CONTAINER_BG;
      ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
      ctx.strokeStyle = THEME.ALERT_WARN;
      ctx.lineWidth = 2;
      ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

      // Progress bar fill
      ctx.fillStyle = 'rgba(255, 84, 0, 0.4)';
      ctx.fillRect(bannerX + 10, bannerY + 28, (bannerW - 20) * state.reloadProgress, 12);
      ctx.strokeStyle = THEME.ALERT_WARN;
      ctx.strokeRect(bannerX + 10, bannerY + 28, bannerW - 20, 12);

      ctx.fillStyle = THEME.ALERT_WARN;
      ctx.font = `bold 13px ${THEME.FONT_PRIMARY}`;
      ctx.textAlign = 'center';
      ctx.fillText('TACTICAL RELOAD IN PROGRESS', W / 2, bannerY + 19);
    }

    ctx.restore();
  },
};

/* ── helpers ──────────────────────────────────────────── */

function _formatTime(seconds) {
  if (seconds < 0) seconds = 0;
  const m  = Math.floor(seconds / 60);
  const s  = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}
