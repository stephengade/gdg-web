/**
 * BackgroundRenderer — procedural desert firing range backdrop & shooting booth.
 *
 * Draws:
 *   - render(): Sky, clouds, distant mountain ranges, adobe structures,
 *               water tower, dead trees, dirt terrain, earth berms, distance lanes.
 *   - renderFiringLine(): Firing station booth (bench, sandbags, safety hazard stripes,
 *                         range station stencils, partition barriers, ammo crate).
 *
 * All procedural canvas paths — zero external assets.
 */
import { CONFIG } from '../constants/config.js';
import { THEME } from '../constants/theme.js';

const W = CONFIG.LOGICAL_WIDTH;
const H = CONFIG.LOGICAL_HEIGHT;

// ── Color palette (desert range) ─────────────────────────
const SKY_TOP     = '#0d1b2a';
const SKY_BOTTOM  = '#1b3a5c';
const CLOUD       = 'rgba(180, 195, 210, 0.18)';
const MTN_FAR     = '#2a2520';
const MTN_NEAR    = '#3a3228';
const BUILDING    = '#4a4035';
const BUILD_LIGHT = '#5a5045';
const TOWER_LEG   = '#3a3228';
const TOWER_TANK  = '#6a5a4a';
const TREE_TRUNK  = '#3a2e22';
const GROUND_FAR  = '#5a4e3a';
const GROUND_NEAR = '#7a6a50';
const BERM        = '#4a4030';
const LANE_LINE   = 'rgba(120, 110, 90, 0.35)';
const GRASS       = '#3a5030';

export const BackgroundRenderer = {
  /**
   * Draw the downrange open desert range.
   */
  render(ctx) {
    // ── Sky gradient ───────────────────────
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 400);
    skyGrad.addColorStop(0, SKY_TOP);
    skyGrad.addColorStop(1, SKY_BOTTOM);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, 400);

    // ── Clouds ─────────────────────────────
    ctx.fillStyle = CLOUD;
    _cloud(ctx, 200, 80, 120, 35);
    _cloud(ctx, 700, 55, 160, 40);
    _cloud(ctx, 1300, 100, 100, 30);
    _cloud(ctx, 1650, 60, 140, 38);

    // ── Far mountains ──────────────────────
    ctx.fillStyle = MTN_FAR;
    ctx.beginPath();
    ctx.moveTo(0, 360);
    ctx.lineTo(120, 260); ctx.lineTo(280, 320); ctx.lineTo(420, 240);
    ctx.lineTo(580, 300); ctx.lineTo(700, 250); ctx.lineTo(850, 310);
    ctx.lineTo(1000, 230); ctx.lineTo(1150, 290); ctx.lineTo(1300, 245);
    ctx.lineTo(1450, 300); ctx.lineTo(1600, 255); ctx.lineTo(1750, 310);
    ctx.lineTo(1920, 280); ctx.lineTo(1920, 400); ctx.lineTo(0, 400);
    ctx.closePath();
    ctx.fill();

    // ── Near mountains ─────────────────────
    ctx.fillStyle = MTN_NEAR;
    ctx.beginPath();
    ctx.moveTo(0, 380);
    ctx.lineTo(180, 310); ctx.lineTo(350, 350); ctx.lineTo(500, 300);
    ctx.lineTo(680, 340); ctx.lineTo(820, 310); ctx.lineTo(960, 350);
    ctx.lineTo(1100, 305); ctx.lineTo(1250, 340); ctx.lineTo(1400, 310);
    ctx.lineTo(1550, 355); ctx.lineTo(1700, 320); ctx.lineTo(1920, 345);
    ctx.lineTo(1920, 400); ctx.lineTo(0, 400);
    ctx.closePath();
    ctx.fill();

    // ── Ground plane ───────────────────────
    const gndGrad = ctx.createLinearGradient(0, 370, 0, H);
    gndGrad.addColorStop(0, GROUND_FAR);
    gndGrad.addColorStop(1, GROUND_NEAR);
    ctx.fillStyle = gndGrad;
    ctx.fillRect(0, 370, W, H - 370);

    // ── Buildings (left cluster) ───────────
    _building(ctx, 50, 290, 140, 90);
    _building(ctx, 160, 310, 100, 70);
    _building(ctx, 40, 320, 80, 60);

    // ── Buildings (right cluster) ──────────
    _building(ctx, 1650, 280, 130, 100);
    _building(ctx, 1750, 300, 120, 80);
    _building(ctx, 1840, 310, 80, 70);

    // ── Water tower (right-center) ─────────
    _waterTower(ctx, 1520, 270);

    // ── Dead trees ─────────────────────────
    _deadTree(ctx, 320, 360, 0.8);
    _deadTree(ctx, 1180, 365, 0.7);
    _deadTree(ctx, 1700, 355, 0.6);

    // ── Earth berms (behind target positions) ──
    ctx.fillStyle = BERM;
    _berm(ctx, 380, 580, 220, 60);
    _berm(ctx, 860, 460, 220, 45);
    _berm(ctx, 1340, 390, 220, 35);

    // ── Range lane markers in the dirt ─────
    ctx.strokeStyle = LANE_LINE;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 10]);
    for (let lane = 0; lane < 3; lane++) {
      const lx = 380 + lane * 460;
      ctx.beginPath();
      ctx.moveTo(lx, 400);
      ctx.lineTo(lx, 860);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lx + 200, 400);
      ctx.lineTo(lx + 200, 860);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // ── Grass clumps ───────────────────────
    ctx.fillStyle = GRASS;
    _grass(ctx, 150, 650); _grass(ctx, 400, 750);
    _grass(ctx, 750, 680); _grass(ctx, 1100, 720);
    _grass(ctx, 1500, 700); _grass(ctx, 1800, 660);

    // ── Downrange Distance Markers ─────────
    ctx.fillStyle = THEME.TELEMETRY_SECONDARY;
    ctx.font = `700 15px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.fillText('[ 25M ]', 480, 735);
    ctx.fillText('[ 50M ]', 960, 585);
    ctx.fillText('[ 100M ]', 1440, 485);
  },

  /**
   * Draw the foreground shooter station / firing line booth.
   * Rendered in front of the downrange targets so the shooter is clearly behind the bench.
   */
  renderFiringLine(ctx) {
    ctx.save();

    // ── Side Stall Partition Walls (Left & Right) ──
    const wallGrad = ctx.createLinearGradient(0, 0, 90, 0);
    wallGrad.addColorStop(0, '#101411');
    wallGrad.addColorStop(1, '#232924');

    // Left stall post
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 200, 85, H - 200);
    ctx.strokeStyle = '#323c34';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 200, 85, H - 200);

    // Right stall post
    const rightGrad = ctx.createLinearGradient(W - 90, 0, W, 0);
    rightGrad.addColorStop(0, '#232924');
    rightGrad.addColorStop(1, '#101411');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(W - 85, 200, 85, H - 200);
    ctx.strokeRect(W - 85, 200, 85, H - 200);

    // ── Shooting Bench Surface ─────────────
    const benchY = 875;
    const benchGrad = ctx.createLinearGradient(0, benchY, 0, H);
    benchGrad.addColorStop(0, '#2b332d');
    benchGrad.addColorStop(0.2, '#1c221e');
    benchGrad.addColorStop(1, '#141815');

    ctx.fillStyle = benchGrad;
    ctx.fillRect(0, benchY, W, H - benchY);

    // Bench front beveled lip / trim
    ctx.fillStyle = '#3a443c';
    ctx.fillRect(0, benchY - 4, W, 8);
    ctx.strokeStyle = '#4e5c51';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, benchY - 4, W, 8);

    // ── Firing Line Safety Hazard Strip ────
    const stripeH = 16;
    const stripeY = benchY - 20;

    // Background of hazard bar
    ctx.fillStyle = '#1c1f1c';
    ctx.fillRect(0, stripeY, W, stripeH);

    // Yellow / black / blaze orange diagonal safety chevrons
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, stripeY, W, stripeH);
    ctx.clip();

    ctx.fillStyle = THEME.ALERT_WARN; // Safety Blaze Orange
    for (let x = -stripeH; x < W + stripeH * 2; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, stripeY + stripeH);
      ctx.lineTo(x + 14, stripeY + stripeH);
      ctx.lineTo(x + 28, stripeY);
      ctx.lineTo(x + 14, stripeY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // ── Bench Sandbag Rifle Rest (Center) ──
    const sandbagY = benchY - 14;
    _sandbag(ctx, W / 2 - 120, sandbagY, 130, 36);
    _sandbag(ctx, W / 2 + 10, sandbagY, 130, 36);
    _sandbag(ctx, W / 2 - 60, sandbagY - 22, 140, 34);

    // ── Ammo Crate / Tin (Left Side of Bench) ──
    ctx.fillStyle = '#1c221e';
    ctx.fillRect(180, benchY + 30, 120, 65);
    ctx.strokeStyle = THEME.TELEMETRY_SECONDARY;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(180, benchY + 30, 120, 65);
    // Latch
    ctx.fillStyle = '#c0a040';
    ctx.fillRect(230, benchY + 26, 20, 8);
    // Stencil text
    ctx.fillStyle = THEME.ALERT_WARN;
    ctx.font = `700 11px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.fillText('5.56MM NATO', 240, benchY + 65);

    // ── Firing Station Stencil (Right Side of Bench) ──
    ctx.fillStyle = THEME.HUD_PRIMARY;
    ctx.font = `700 15px ${THEME.FONT_PRIMARY}`;
    ctx.textAlign = 'right';
    ctx.fillText('FIRING STATION 03 // 100M ZEROING RANGE', W - 140, benchY + 45);
    ctx.fillStyle = THEME.DATA_READOUT;
    ctx.font = `12px ${THEME.FONT_MONO}`;
    ctx.fillText('RESTRICTED FIRING LINE — WEAPON POINTED DOWNRANGE AT ALL TIMES', W - 140, benchY + 70);

    ctx.restore();
  },
};

/* ── helper drawing functions ─────────────────────────── */

function _sandbag(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#8f7d61'; // canvas/hessian fabric color
  ctx.strokeStyle = '#63543e';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Stitching / seams
  ctx.strokeStyle = '#4a3d2b';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h / 2);
  ctx.lineTo(x + w - 10, y + h / 2);
  ctx.stroke();
  ctx.restore();
}

function _cloud(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - w * 0.4, y + h * 0.2, w * 0.5, h * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + w * 0.45, y + h * 0.15, w * 0.55, h * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
}

function _building(ctx, x, y, w, h) {
  ctx.fillStyle = BUILDING;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = BUILD_LIGHT;
  ctx.fillRect(x - 4, y, w + 8, 6);
  ctx.fillStyle = 'rgba(10, 12, 10, 0.6)';
  const winW = 14, winH = 18, pad = 20;
  for (let wx = x + pad; wx < x + w - pad; wx += winW + 12) {
    ctx.fillRect(wx, y + 20, winW, winH);
  }
}

function _waterTower(ctx, x, y) {
  ctx.strokeStyle = TOWER_LEG;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 20, y + 90); ctx.lineTo(x - 8, y + 20);
  ctx.moveTo(x + 20, y + 90); ctx.lineTo(x + 8, y + 20);
  ctx.moveTo(x - 15, y + 60); ctx.lineTo(x + 15, y + 60);
  ctx.stroke();
  ctx.fillStyle = TOWER_TANK;
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 26, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 22, y - 10, 44, 20);
  ctx.fillStyle = BUILD_LIGHT;
  ctx.fillRect(x - 24, y - 12, 48, 5);
}

function _deadTree(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = TREE_TRUNK;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, -70);
  ctx.moveTo(0, -30); ctx.lineTo(-25, -55);
  ctx.moveTo(0, -45); ctx.lineTo(20, -70);
  ctx.moveTo(0, -55); ctx.lineTo(-15, -78);
  ctx.moveTo(-25, -55); ctx.lineTo(-38, -48);
  ctx.moveTo(20, -70); ctx.lineTo(35, -65);
  ctx.stroke();
  ctx.restore();
}

function _berm(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h);
  ctx.quadraticCurveTo(x - w / 4, y - h * 0.3, x, y - h * 0.1);
  ctx.quadraticCurveTo(x + w / 4, y - h * 0.3, x + w / 2, y + h);
  ctx.closePath();
  ctx.fill();
}

function _grass(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 4, 0);
    ctx.quadraticCurveTo(i * 6, -12 - Math.random() * 6, i * 3, -18 - Math.random() * 4);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = GRASS;
    ctx.stroke();
  }
  ctx.restore();
}
