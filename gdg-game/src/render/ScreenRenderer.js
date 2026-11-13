/**
 * ScreenRenderer — renders all non-gameplay tactical screens:
 *   MENU, BRIEFING, AAR_SUMMARY, FAIL_SCREEN
 *
 * Spec:
 *   • Containers:            #121619 Tactical Gunmetal
 *   • Primary Action/Status: #39FF14 Phosphor Green
 *   • Secondary Labels:      #38BDF8 Steel Ice Blue
 *   • Data Readouts:         #E2E8F0 Cool Silver
 *   • Alerts / Highlights:   #FF5400 Safety Blaze Orange
 *   • Typography:            'Orbitron' & 'JetBrains Mono'
 *
 * Mobile Touch Optimized:
 *   - Expanded touch hitbox buttons (minimum 64px height)
 *   - Clear tactile borders and active states
 */
import { CONFIG } from '../constants/config.js';
import { THEME } from '../constants/theme.js';

const W = CONFIG.LOGICAL_WIDTH;
const H = CONFIG.LOGICAL_HEIGHT;
const CX = W / 2;
const CY = H / 2;

/**
 * Check if logical (x, y) is inside a rect.
 */
function inRect(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

/**
 * Draw a tactical styled button with touch-friendly dimensions.
 */
function drawButton(ctx, text, x, y, w, h, hover = false) {
  ctx.save();

  // Background fill
  ctx.fillStyle = hover ? 'rgba(57, 255, 20, 0.16)' : 'rgba(18, 22, 25, 0.90)';
  ctx.fillRect(x, y, w, h);

  // Outer border
  ctx.strokeStyle = hover ? THEME.HUD_PRIMARY : THEME.TELEMETRY_SECONDARY;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Corner brackets
  ctx.fillStyle = hover ? THEME.HUD_PRIMARY : THEME.TELEMETRY_SECONDARY;
  const cSize = 6;
  ctx.fillRect(x, y, cSize, 2);
  ctx.fillRect(x, y, 2, cSize);
  ctx.fillRect(x + w - cSize, y, cSize, 2);
  ctx.fillRect(x + w - 2, y, 2, cSize);
  ctx.fillRect(x, y + h - 2, cSize, 2);
  ctx.fillRect(x, y + h - cSize, 2, cSize);
  ctx.fillRect(x + w - cSize, y + h - 2, cSize, 2);
  ctx.fillRect(x + w - 2, y + h - cSize, 2, cSize);

  // Button text
  ctx.fillStyle = hover ? THEME.HUD_PRIMARY : THEME.DATA_READOUT;
  ctx.font = `700 20px ${THEME.FONT_PRIMARY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '0.12em';
  if (hover) {
    ctx.shadowColor = 'rgba(57, 255, 20, 0.6)';
    ctx.shadowBlur = 10;
  }
  ctx.fillText(text, x + w / 2, y + h / 2);

  ctx.restore();
}

/**
 * Draw horizontal tactical ruled line with center diamond.
 */
function drawRule(ctx, y, width = 500) {
  ctx.save();
  ctx.strokeStyle = THEME.TELEMETRY_SECONDARY;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(CX - width / 2, y);
  ctx.lineTo(CX + width / 2, y);
  ctx.stroke();

  // Center diamond accent
  ctx.fillStyle = THEME.HUD_PRIMARY;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(CX, y - 3);
  ctx.lineTo(CX + 4, y);
  ctx.lineTo(CX, y + 3);
  ctx.lineTo(CX - 4, y);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Touch-friendly button sizes (min 64px height)
const BTN_W = 380;
const BTN_H = 64;
const MENU_BTN = { x: CX - BTN_W / 2, y: 590, w: BTN_W, h: BTN_H };
const BRIEF_BTN = { x: CX - BTN_W / 2, y: 690, w: BTN_W, h: BTN_H };
const AAR_RETRY_BTN = { x: CX - BTN_W - 24, y: 720, w: BTN_W, h: BTN_H };
const AAR_NEXT_BTN = { x: CX + 24, y: 720, w: BTN_W, h: BTN_H };
const FAIL_BTN = { x: CX - BTN_W / 2, y: 680, w: BTN_W, h: BTN_H };

export const ScreenRenderer = {
  // ──────────── MENU ────────────
  renderMenu(ctx, pointerX, pointerY) {
    // Background
    ctx.fillStyle = THEME.BG_RANGE_DAY;
    ctx.fillRect(0, 0, W, H);

    // Subtle tactical grid overlay
    ctx.save();
    ctx.strokeStyle = THEME.TELEMETRY_SECONDARY;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.08;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();

    // Military Emblem / Crosshair Accent
    ctx.save();
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(CX, 350, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CX, 350, 140, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Main Title Block (Orbitron + Phosphor Green)
    ctx.fillStyle = THEME.HUD_PRIMARY;
    ctx.font = `900 68px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(57, 255, 20, 0.5)';
    ctx.shadowBlur = 14;
    ctx.fillText('OAU CADET', CX, 310);
    ctx.fillText('TRAINING', CX, 385);
    ctx.shadowBlur = 0;

    drawRule(ctx, 440, 600);

    // Subtitle (Steel Ice Blue)
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 16px ${THEME.FONT_PRIMARY}`;
    ctx.letterSpacing = '0.2em';
    ctx.fillText('MARKSMANSHIP QUALIFICATION PROGRAM', CX, 485);

    // Telemetry classification (Cool Silver)
    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `14px ${THEME.FONT_MONO}`;
    ctx.globalAlpha = 0.75;
    ctx.fillText('SEC//LEVEL 3 • COMBAT ACCURACY DRILLS', CX, 525);
    ctx.globalAlpha = 1;

    // Start Button
    const hover = inRect(pointerX, pointerY, MENU_BTN.x, MENU_BTN.y, MENU_BTN.w, MENU_BTN.h);
    drawButton(ctx, '[ DEPLOY DRILL ]', MENU_BTN.x, MENU_BTN.y, MENU_BTN.w, MENU_BTN.h, hover);

    // Bottom classification hazard bar
    ctx.fillStyle = THEME.ALERT_WARN;
    ctx.fillRect(0, H - 32, W, 32);
    ctx.fillStyle = '#0a0d0a';
    ctx.font = `700 12px ${THEME.FONT_PRIMARY}`;
    ctx.fillText('RESTRICTED — CADET INSTRUCTION USE ONLY — REPORT TO FIRING LINE', CX, H - 15);
  },

  checkMenuClick(x, y) {
    return inRect(x, y, MENU_BTN.x, MENU_BTN.y, MENU_BTN.w, MENU_BTN.h);
  },

  // ──────────── BRIEFING ────────────
  renderBriefing(ctx, pointerX, pointerY, missionData) {
    const mission = missionData || {
      number: 1,
      codename: 'BASIC ZEROING',
      objective: 'Engage static frontal silhouette targets at 25m, 50m, and 100m.',
      constraints: '15 ROUNDS | 45 SECONDS | NO ENVIRONMENTAL INTERFERENCE',
      threshold: '>= 80% ACCURACY | >= 1,000 PTS',
    };

    ctx.fillStyle = THEME.BG_RANGE_DAY;
    ctx.fillRect(0, 0, W, H);

    // Tactical modal box
    const mw = 900;
    const mh = 660;
    const mx = CX - mw / 2;
    const my = 80;

    ctx.fillStyle = THEME.HUD_CONTAINER_BG;
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = THEME.TELEMETRY_SECONDARY;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx, my, mw, mh);

    // Header badge
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 14px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.15em';
    ctx.fillText('MISSION BRIEFING & FIRING ORDERS', CX, 130);

    drawRule(ctx, 160, 680);

    // Mission Title
    ctx.fillStyle = THEME.HUD_PRIMARY;
    ctx.font = `900 44px ${THEME.FONT_PRIMARY}`;
    ctx.fillText(`MISSION 0${mission.number}`, CX, 215);

    // Codename in Safety Blaze Orange
    ctx.fillStyle = THEME.ALERT_WARN;
    ctx.font = `700 24px ${THEME.FONT_PRIMARY}`;
    ctx.fillText(`// "${mission.codename}" //`, CX, 260);

    drawRule(ctx, 295, 680);

    // 1. Objective
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 13px ${THEME.FONT_PRIMARY}`;
    ctx.fillText('MISSION OBJECTIVE', CX, 340);
    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `600 19px ${THEME.FONT_PRIMARY}`;
    ctx.fillText(mission.objective, CX, 375);

    // 2. Constraints
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 13px ${THEME.FONT_PRIMARY}`;
    ctx.fillText('RANGE CONSTRAINTS & LOADOUT', CX, 435);
    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `17px ${THEME.FONT_MONO}`;
    ctx.fillText(mission.constraints, CX, 468);

    // 3. Qualification Threshold
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 13px ${THEME.FONT_PRIMARY}`;
    ctx.fillText('QUALIFICATION REQUIREMENT', CX, 525);
    ctx.fillStyle = THEME.ALERT_WARN;
    ctx.font = `bold 20px ${THEME.FONT_PRIMARY}`;
    ctx.fillText(mission.threshold, CX, 558);

    // Deploy Button (Touch optimized)
    const hover = inRect(pointerX, pointerY, BRIEF_BTN.x, BRIEF_BTN.y, BRIEF_BTN.w, BRIEF_BTN.h);
    drawButton(ctx, '[ COMMENCE DRILL ]', BRIEF_BTN.x, BRIEF_BTN.y, BRIEF_BTN.w, BRIEF_BTN.h, hover);
  },

  checkBriefingClick(x, y) {
    return inRect(x, y, BRIEF_BTN.x, BRIEF_BTN.y, BRIEF_BTN.w, BRIEF_BTN.h);
  },

  // ──────────── AAR SUMMARY ────────────
  renderAAR(ctx, pointerX, pointerY, results) {
    const data = results || {
      accuracy: 0,
      centerMassRatio: 0,
      avgReactionTime: 0,
      totalScore: 0,
      passed: false,
    };

    ctx.fillStyle = THEME.BG_RANGE_DAY;
    ctx.fillRect(0, 0, W, H);

    // Tactical container
    const mw = 900;
    const mh = 680;
    const mx = CX - mw / 2;
    const my = 80;

    ctx.fillStyle = THEME.HUD_CONTAINER_BG;
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = data.passed ? THEME.HUD_PRIMARY : THEME.ALERT_WARN;
    ctx.lineWidth = 2;
    ctx.strokeRect(mx, my, mw, mh);

    // Header
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `600 14px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.15em';
    ctx.fillText('AFTER-ACTION REPORT (AAR)', CX, 130);

    drawRule(ctx, 160, 680);

    // Qualification Status Badge
    ctx.font = `900 52px ${THEME.FONT_PRIMARY}`;
    if (data.passed) {
      ctx.fillStyle = THEME.HUD_PRIMARY;
      ctx.shadowColor = 'rgba(57, 255, 20, 0.5)';
      ctx.shadowBlur = 12;
      ctx.fillText('QUALIFIED', CX, 225);
    } else {
      ctx.fillStyle = THEME.ALERT_WARN;
      ctx.shadowColor = 'rgba(255, 84, 0, 0.5)';
      ctx.shadowBlur = 12;
      ctx.fillText('UNQUALIFIED', CX, 225);
    }
    ctx.shadowBlur = 0;

    drawRule(ctx, 275, 680);

    // Stats Grid
    const stats = [
      ['TOTAL DRILL SCORE', `${data.totalScore} PTS`],
      ['MARKSMAN ACCURACY', `${data.accuracy.toFixed(1)}%`],
      ['CENTER-MASS RATIO', `${data.centerMassRatio.toFixed(1)}%`],
      ['AVG REACTION SPLIT', `${data.avgReactionTime.toFixed(0)} MS`],
    ];

    let sy = 340;
    for (const [label, value] of stats) {
      ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
      ctx.font = `600 15px ${THEME.FONT_PRIMARY}`;
      ctx.textAlign = 'right';
      ctx.fillText(label, CX - 40, sy);

      ctx.fillStyle = THEME.DATA_READOUT;
      ctx.font = `bold 26px ${THEME.FONT_MONO}`;
      ctx.textAlign = 'left';
      ctx.fillText(value, CX + 40, sy);
      sy += 65;
    }

    // Action Buttons
    const hRetry = inRect(pointerX, pointerY, AAR_RETRY_BTN.x, AAR_RETRY_BTN.y, AAR_RETRY_BTN.w, AAR_RETRY_BTN.h);
    drawButton(ctx, '[ RETRY DRILL ]', AAR_RETRY_BTN.x, AAR_RETRY_BTN.y, AAR_RETRY_BTN.w, AAR_RETRY_BTN.h, hRetry);

    if (data.passed) {
      const hNext = inRect(pointerX, pointerY, AAR_NEXT_BTN.x, AAR_NEXT_BTN.y, AAR_NEXT_BTN.w, AAR_NEXT_BTN.h);
      drawButton(ctx, '[ NEXT MISSION ]', AAR_NEXT_BTN.x, AAR_NEXT_BTN.y, AAR_NEXT_BTN.w, AAR_NEXT_BTN.h, hNext);
    }
  },

  checkAARClick(x, y, passed) {
    if (inRect(x, y, AAR_RETRY_BTN.x, AAR_RETRY_BTN.y, AAR_RETRY_BTN.w, AAR_RETRY_BTN.h)) return 'retry';
    if (passed && inRect(x, y, AAR_NEXT_BTN.x, AAR_NEXT_BTN.y, AAR_NEXT_BTN.w, AAR_NEXT_BTN.h)) return 'next';
    return null;
  },

  // ──────────── FAIL SCREEN ────────────
  renderFail(ctx, pointerX, pointerY, reason) {
    ctx.fillStyle = THEME.BG_RANGE_DAY;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = THEME.ALERT_WARN;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    ctx.fillStyle = THEME.ALERT_WARN;
    ctx.font = `900 52px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.fillText('DRILL FAILED', CX, 340);

    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `20px ${THEME.FONT_PRIMARY}`;
    ctx.fillText(reason || 'QUALIFICATION THRESHOLD NOT MET', CX, 420);

    drawRule(ctx, 480, 600);

    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `14px ${THEME.FONT_MONO}`;
    ctx.fillText('DISCIPLINE REQUIRED — RE-ENGAGE AT THE FIRING LINE', CX, 530);

    const hover = inRect(pointerX, pointerY, FAIL_BTN.x, FAIL_BTN.y, FAIL_BTN.w, FAIL_BTN.h);
    drawButton(ctx, '[ RE-ENGAGE DRILL ]', FAIL_BTN.x, FAIL_BTN.y, FAIL_BTN.w, FAIL_BTN.h, hover);
  },

  checkFailClick(x, y) {
    return inRect(x, y, FAIL_BTN.x, FAIL_BTN.y, FAIL_BTN.w, FAIL_BTN.h);
  },
};
