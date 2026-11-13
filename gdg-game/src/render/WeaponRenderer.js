/**
 * WeaponRenderer — first-person procedural tactical service rifle.
 *
 * Renders:
 *   - Service rifle barrel, handguard, receiver, and front sight post
 *   - Dynamic aim tracking (subtly angles toward cursor)
 *   - Recoil kick & recovery animation
 *   - Tactical muzzle flash on shot
 *   - Animated brass shell casings ejecting on fire
 *   - Reload dip animation
 *
 * Zero external sprites — rendered entirely with vector canvas paths.
 */
import { CONFIG } from '../constants/config.js';
import { THEME } from '../constants/theme.js';

const W = CONFIG.LOGICAL_WIDTH;
const H = CONFIG.LOGICAL_HEIGHT;

export class WeaponRenderer {
  constructor() {
    this.recoilY = 0;       // backward/up kick in pixels
    this.recoilRot = 0;     // pitch up in radians
    this.muzzleFlashTimer = 0;
    this.casings = [];      // { x, y, vx, vy, rot, vRot, life }
  }

  /* ── triggers ─────────────────────────── */

  triggerShot() {
    this.recoilY = 32;
    this.recoilRot = -0.06;
    this.muzzleFlashTimer = 0.07; // 70ms flash

    // Eject spent brass casing to the right
    this.casings.push({
      x: W / 2 + 120,
      y: H - 140,
      vx: 240 + Math.random() * 120,
      vy: -320 - Math.random() * 140,
      rot: Math.random() * Math.PI,
      vRot: 12 + Math.random() * 16,
      life: 1.2,
    });
  }

  /* ── per-frame update ─────────────────── */

  update(dt) {
    // Recoil recovery (exponential spring-back)
    if (this.recoilY > 0.1) {
      this.recoilY *= Math.pow(0.0001, dt);
    } else {
      this.recoilY = 0;
    }

    if (Math.abs(this.recoilRot) > 0.001) {
      this.recoilRot *= Math.pow(0.0001, dt);
    } else {
      this.recoilRot = 0;
    }

    // Muzzle flash decay
    if (this.muzzleFlashTimer > 0) {
      this.muzzleFlashTimer -= dt;
    }

    // Update casings
    for (let i = this.casings.length - 1; i >= 0; i--) {
      const c = this.casings[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 850 * dt; // gravity
      c.rot += c.vRot * dt;
      c.life -= dt;

      // Bounce on shooting bench (y = 960)
      if (c.y >= 960 && c.vy > 0) {
        c.y = 960;
        c.vy = -c.vy * 0.4;
        c.vx *= 0.6;
        c.vRot *= 0.5;
      }

      if (c.life <= 0) this.casings.splice(i, 1);
    }
  }

  /**
   * Get logical coordinates of the rifle's muzzle tip (for tracers).
   * @param {number} pointerX
   */
  getMuzzlePosition(pointerX) {
    const aimOffset = (pointerX - W / 2) * 0.15;
    return {
      x: W / 2 + aimOffset,
      y: H - 240 + this.recoilY * 0.8,
    };
  }

  /* ── rendering ────────────────────────── */

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} pointerX
   * @param {number} pointerY
   * @param {boolean} reloading
   * @param {number} reloadProgress
   */
  render(ctx, pointerX, pointerY, reloading = false, reloadProgress = 1) {
    ctx.save();

    // Draw ejected brass casings first (behind gun, in booth)
    this._renderCasings(ctx);

    // Aim angle calculation (subtle tilt towards crosshair)
    const dx = pointerX - W / 2;
    const aimAngle = Math.max(-0.22, Math.min(0.22, dx / (W * 0.9)));

    // Reload dip animation
    let reloadDipY = 0;
    let reloadTilt = 0;
    if (reloading) {
      // Dips down, tilts slightly left, then returns
      const progress = reloadProgress;
      const arc = Math.sin(progress * Math.PI);
      reloadDipY = arc * 140;
      reloadTilt = arc * -0.15;
    }

    const baseX = W / 2 + (pointerX - W / 2) * 0.08;
    const baseY = H + this.recoilY + reloadDipY;

    ctx.translate(baseX, baseY);
    ctx.rotate(aimAngle + this.recoilRot + reloadTilt);

    // ── Rifle Body & Barrel ──────────────────
    this._drawRifle(ctx);

    // ── Muzzle Flash ─────────────────────────
    if (this.muzzleFlashTimer > 0) {
      this._drawMuzzleFlash(ctx);
    }

    ctx.restore();
  }

  /* ── private drawing ──────────────────── */

  _drawRifle(ctx) {
    ctx.save();

    // 1. Shadow underneath
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, -60, 60, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Barrel extending forward
    const barrelGrad = ctx.createLinearGradient(-12, 0, 12, 0);
    barrelGrad.addColorStop(0, '#1c201e');
    barrelGrad.addColorStop(0.5, '#404a44');
    barrelGrad.addColorStop(1, '#181c1a');

    ctx.fillStyle = barrelGrad;
    // Main barrel tube
    ctx.fillRect(-10, -230, 20, 110);

    // Flash hider / muzzle brake
    ctx.fillStyle = '#141816';
    ctx.fillRect(-12, -248, 24, 20);
    // Flash hider slots
    ctx.fillStyle = '#080a08';
    ctx.fillRect(-10, -244, 4, 12);
    ctx.fillRect(6, -244, 4, 12);

    // Gas block & front sight post
    ctx.fillStyle = '#222824';
    ctx.fillRect(-14, -200, 28, 16);
    // Front sight post pin
    ctx.fillStyle = '#111512';
    ctx.fillRect(-3, -218, 6, 20);
    // Front sight wings / protective ears
    ctx.strokeStyle = '#2a322c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -200); ctx.lineTo(-8, -218);
    ctx.moveTo(12, -200);  ctx.lineTo(8, -218);
    ctx.stroke();

    // 3. Handguard (tactical rail)
    const hgGrad = ctx.createLinearGradient(-35, 0, 35, 0);
    hgGrad.addColorStop(0, '#1c221e');
    hgGrad.addColorStop(0.3, '#323c35');
    hgGrad.addColorStop(0.7, '#323c35');
    hgGrad.addColorStop(1, '#181e1a');

    ctx.fillStyle = hgGrad;
    ctx.beginPath();
    ctx.moveTo(-24, -120);
    ctx.lineTo(24, -120);
    ctx.lineTo(32, -30);
    ctx.lineTo(-32, -30);
    ctx.closePath();
    ctx.fill();

    // Picatinny top rail
    ctx.fillStyle = '#161b17';
    ctx.fillRect(-14, -124, 28, 96);
    // Rail ribs
    ctx.fillStyle = '#28312a';
    for (let ry = -120; ry < -32; ry += 8) {
      ctx.fillRect(-12, ry, 24, 3);
    }

    // Handguard heat vents (cooling slots)
    ctx.fillStyle = '#0c0f0d';
    for (let vy = -110; vy < -40; vy += 16) {
      ctx.fillRect(-22, vy, 6, 9);
      ctx.fillRect(16, vy, 6, 9);
    }

    // 4. Upper Receiver & Optic Rail
    const recGrad = ctx.createLinearGradient(-45, 0, 45, 0);
    recGrad.addColorStop(0, '#181e1a');
    recGrad.addColorStop(0.5, '#2e3831');
    recGrad.addColorStop(1, '#141815');

    ctx.fillStyle = recGrad;
    ctx.fillRect(-36, -30, 72, 80);

    // Ejection port (right side)
    ctx.fillStyle = '#0a0d0b';
    ctx.fillRect(18, -15, 16, 32);
    // Brass casing visible inside chamber
    ctx.fillStyle = '#c89632';
    ctx.fillRect(20, -10, 10, 22);

    // Rear iron sight / aperture ring
    ctx.fillStyle = '#222924';
    ctx.beginPath();
    ctx.arc(0, 10, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0e120f';
    ctx.beginPath();
    ctx.arc(0, 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // 5. Tactical Phosphor Green charging handle & bolt accents
    ctx.fillStyle = 'rgba(57, 255, 20, 0.45)';
    ctx.fillRect(-6, 25, 12, 4);

    ctx.restore();
  }

  _drawMuzzleFlash(ctx) {
    ctx.save();
    const flashY = -255;

    // Outer fire-orange glow
    const glowGrad = ctx.createRadialGradient(0, flashY, 4, 0, flashY, 70);
    glowGrad.addColorStop(0, 'rgba(255, 255, 220, 0.95)');
    glowGrad.addColorStop(0.2, 'rgba(255, 180, 50, 0.85)');
    glowGrad.addColorStop(0.6, 'rgba(255, 80, 20, 0.4)');
    glowGrad.addColorStop(1, 'rgba(255, 40, 0, 0)');

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, flashY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Spiky flash star
    ctx.fillStyle = '#FFF8E0';
    ctx.beginPath();
    const spikes = 6;
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? 45 + Math.random() * 20 : 12;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = flashY + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Intense white center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, flashY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _renderCasings(ctx) {
    for (const c of this.casings) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);

      // Gold/brass metallic casing
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-3, -7, 6, 14);

      // Casing rim
      ctx.fillStyle = '#aa8822';
      ctx.fillRect(-4, 5, 8, 3);

      // Open neck
      ctx.fillStyle = '#443311';
      ctx.fillRect(-2, -8, 4, 2);

      ctx.restore();
    }
  }
}

