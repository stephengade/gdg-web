/**
 * main.js — OAU Cadet Training (3D WebGL Ballistics Simulator)
 *
 * Integrates:
 *   - Three.js WebGL Scene & Desert Firing Range (25m - 200m)
 *   - Procedural 3D DL-50 Sniper Rifle & M4A1 Tactical Carbine Viewmodels
 *   - Telescopic Sniper Zoom (12° FOV, Mil-Dot hairlines, Elevation marks)
 *   - Accessible Aim Controls: Arrow keys (Up/Down/Left/Right) & W, A, S/Z, D
 *   - Accessible Fire Controls: CTRL key (ControlLeft/ControlRight), Enter key, Left Mouse
 *   - Physical Outward Ballistics Solver (850 m/s for DL-50, 450 m/s for Carbine, 9.81 m/s² drop)
 *   - 3D Reactive Hinged Targets with Local Hit Zones & Pop-up/Strafe Mechanics
 *   - Speed-of-Sound Delayed Web Audio Synthesizer
 *   - Tactical HTML5/CSS3 HUD Overlay & All 5 Campaign Missions
 */
import * as THREE from 'three';
import { MISSIONS } from './game/missions.js';
import { SceneManager } from './engine/SceneManager.js';
import { FPSController } from './engine/FPSController.js';
import { WeaponViewmodel } from './render/WeaponViewmodel.js';
import { BallisticsSolver } from './engine/BallisticsSolver.js';
import { TargetManager3D } from './game/TargetManager3D.js';
import { AudioManager3D } from './audio/AudioManager3D.js';
import { HUDController } from './render/HUDController.js';

// ── Weapon Configurations ─────────────────────────────────
const WEAPON_CONFIGS = {
  SNIPER: { name: 'DL-50 SNIPER', magSize: 10, muzzleSpeed: 850, fov: 12 },
  CARBINE: { name: 'M4A1 CARBINE', magSize: 30, muzzleSpeed: 450, fov: 45 },
};

// ── Initialization ────────────────────────────────────────
const canvas = document.getElementById('threeCanvas');
const sceneMgr = new SceneManager(canvas);
const controller = new FPSController(sceneMgr.camera, canvas);
const viewmodel = new WeaponViewmodel(sceneMgr.camera);
const ballistics = new BallisticsSolver(sceneMgr.scene);
const targetMgr = new TargetManager3D(sceneMgr.scene);
const audio = new AudioManager3D();

// Weapon switch callback triggered from HUD pill or shortcut
function togglePlayerWeapon() {
  const next = viewmodel.toggleWeapon();
  hud.setWeaponDisplay(next);
  controller.isSniperWeapon = (next === 'SNIPER');
  const cfg = WEAPON_CONFIGS[next];
  if (gameState === 'ACTIVE') {
    currentMag = Math.min(cfg.magSize, totalAmmo > 0 ? totalAmmo : cfg.magSize);
  }
}

// Target Movement Mode: true = MOVING (patrol rails), false = STATIC (fixed zeroing)
let targetMovementEnabled = true;

function toggleTargetMovementMode(forcedValue = null) {
  targetMovementEnabled = forcedValue !== null ? forcedValue : !targetMovementEnabled;
  targetMgr.setMovementEnabled(targetMovementEnabled);
  hud.setTargetModeDisplay(targetMovementEnabled);
}

const hud = new HUDController(
  () => togglePlayerWeapon(),
  () => toggleTargetMovementMode()
);

// ── State Variables ───────────────────────────────────────
let currentMissionIndex = 0;
let currentMission = MISSIONS[0];
let gameState = 'MENU'; // MENU | BRIEFING | ACTIVE | AAR | FAIL

let missionTimer = 0;
let currentMag = 10;
let totalAmmo = 15;
let reloading = false;
let reloadTimer = 0;
let reloadDuration = 1.2;

let score = 0;
let shotsFired = 0;
let shotsHit = 0;
let centerMassHits = 0;
let streak = 0;
let streakMultiplier = 1.0;
let reactionTimes = [];

let currentWind = 0;
let lastHeartbeatTime = 0;
let endDelayTimer = null;

// Reused scratch vectors for zero-allocation game loop
const _muzzlePos = new THREE.Vector3();
const _aimDir = new THREE.Vector3();

// ── Mobile Touch Button Listeners (Call of Duty Mobile Architecture) ───
function setupMobileTouchButtons() {
  const touchFireRight = document.getElementById('touchFireRight');
  const touchFireLeft = document.getElementById('touchFireLeft');
  const touchAds = document.getElementById('touchAdsBtn');
  const touchBreath = document.getElementById('touchBreathBtn');
  const touchReload = document.getElementById('touchReloadBtn');
  const touchWeapon = document.getElementById('touchWeaponBtn');

  function bindTap(el, onAction) {
    if (!el) return;
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      onAction();
    }, { passive: false });
    el.addEventListener('click', (e) => {
      e.preventDefault();
      onAction();
    });
  }

  // Primary Right FIRE: Fires on touch + allows aim-dragging (CoD style)
  if (touchFireRight) {
    touchFireRight.addEventListener('touchstart', (e) => {
      e.preventDefault();
      controller.isFireRequested = true;
      audio.init();
      audio.ensureRunning();
    }, { passive: false });
    touchFireRight.addEventListener('click', (e) => {
      e.preventDefault();
      controller.isFireRequested = true;
      audio.init();
      audio.ensureRunning();
    });

    // Wire continuous aim-drag tracking while holding right fire button
    controller.bindRightFireAimDrag(touchFireRight);
  }

  // Secondary Left Trigger FIRE (Claw / Two-Thumb friendly)
  if (touchFireLeft) {
    bindTap(touchFireLeft, () => {
      controller.isFireRequested = true;
      audio.init();
      audio.ensureRunning();
    });
  }

  // Tap-to-ADS Toggle (Locks into scope view until tapped again)
  if (touchAds) {
    bindTap(touchAds, () => {
      controller.isADS = !controller.isADS;
    });
  }

  // Hold Breath Button (Stabilizes sway, visible only when ADS is active)
  if (touchBreath) {
    touchBreath.addEventListener('touchstart', (e) => {
      e.preventDefault();
      controller.isHoldingBreath = true;
    }, { passive: false });
    touchBreath.addEventListener('touchend', (e) => {
      e.preventDefault();
      controller.isHoldingBreath = false;
    }, { passive: false });
    touchBreath.addEventListener('touchcancel', (e) => {
      controller.isHoldingBreath = false;
    });
    touchBreath.addEventListener('mousedown', () => {
      controller.isHoldingBreath = true;
    });
    touchBreath.addEventListener('mouseup', () => {
      controller.isHoldingBreath = false;
    });
  }

  // Compact Reload Button
  if (touchReload) {
    bindTap(touchReload, () => {
      controller.isReloadRequested = true;
    });
  }

  // Weapon Swap Button
  if (touchWeapon) {
    bindTap(touchWeapon, () => {
      togglePlayerWeapon();
    });
  }

  // Direct Tap on Ammo Bay to Reload
  const ammoBay = document.getElementById('hudAmmoBay');
  if (ammoBay) {
    bindTap(ammoBay, () => {
      controller.isReloadRequested = true;
    });
  }
}
setupMobileTouchButtons();

// ── Mission Flow Management ───────────────────────────────

function startMissionFlow(index) {
  currentMissionIndex = index;
  currentMission = MISSIONS[index];
  gameState = 'BRIEFING';
  hud.showBriefing(
    currentMission,
    (chosenMovement) => {
      targetMovementEnabled = chosenMovement;
      deployToFiringLine(currentMission);
    },
    targetMovementEnabled,
    (newMode) => {
      targetMovementEnabled = newMode;
      targetMgr.setMovementEnabled(newMode);
    }
  );
}

function deployToFiringLine(mission) {
  gameState = 'ACTIVE';
  audio.init();
  audio.ensureRunning();

  // Reset weapon & ammo quota
  hud.setWeaponDisplay(viewmodel.currentWeapon);
  const cfg = WEAPON_CONFIGS[viewmodel.currentWeapon];
  totalAmmo = mission.ammoCount;
  currentMag = Math.min(cfg.magSize, totalAmmo);

  missionTimer = mission.durationSec;
  reloading = false;
  reloadTimer = 0;

  score = 0;
  shotsFired = 0;
  shotsHit = 0;
  centerMassHits = 0;
  streak = 0;
  streakMultiplier = 1.0;
  reactionTimes.length = 0;

  // Environment & Optic Zoom
  sceneMgr.setNightMode(mission.nightVisionMode);
  hud.setNightVision(mission.nightVisionMode);

  // Wind setup
  currentWind = mission.windSpeedMps[0];
  ballistics.setWind(currentWind);
  hud.setWind(currentWind);

  // Setup 3D Target Field & apply chosen movement mode
  targetMgr.setupMission(mission);
  targetMgr.setMovementEnabled(targetMovementEnabled);
  hud.setTargetModeDisplay(targetMovementEnabled);
  endDelayTimer = null;

  // Request pointer lock on desktop canvas
  canvas.requestPointerLock?.();
}

function triggerShot() {
  if (reloading) return;

  if (currentMag <= 0) {
    audio.playDryFire();
    if (totalAmmo > 0) {
      startReload(true);
    }
    return;
  }

  shotsFired++;
  currentMag--;
  totalAmmo--;

  // Audio & Visual Recoil Kick
  audio.playGunshot();
  viewmodel.triggerRecoil();

  // Get barrel muzzle 3D position
  viewmodel.getMuzzleWorldPosition(_muzzlePos);
  sceneMgr.camera.getWorldDirection(_aimDir);
  sceneMgr.triggerMuzzleLight(_muzzlePos);

  // Spawn physical 3D projectile with gravity and wind
  const isHip = !viewmodel.isADS;
  const muzzleSpeed = WEAPON_CONFIGS[viewmodel.currentWeapon].muzzleSpeed;
  ballistics.spawnBullet(_muzzlePos, _aimDir, isHip, muzzleSpeed);

  // Auto reload on empty mag if reserve rounds remain
  if (currentMag === 0 && totalAmmo > 0) {
    startReload(true);
  }
}

function startReload(isAuto = false) {
  const cfg = WEAPON_CONFIGS[viewmodel.currentWeapon];
  if (reloading || totalAmmo <= 0 || currentMag >= cfg.magSize) return;
  reloading = true;
  reloadDuration = isAuto ? 1.6 : 1.1;
  reloadTimer = reloadDuration;
  audio.playReload();
}

function onBulletHitTarget(hitData) {
  const result = targetMgr.processHit(hitData.hitObject, hitData.point);
  if (!result) return;

  // Rules of Engagement Check (Mission 4 & 5)
  if (result.isCivilian) {
    // Instant ROE Violation
    gameState = 'FAIL';
    document.exitPointerLock?.();
    hud.showFail(
      'COURT-MARTIAL: NON-COMBATANT NEUTRALIZED AT THE FIRING LINE. DISCIPLINE ZERO-TOLERANCE.',
      () => startMissionFlow(currentMissionIndex)
    );
    return;
  }

  // Hostile Target Hit
  shotsHit++;
  if (result.isCenterMass) {
    centerMassHits++;
    streak++;
  } else {
    streak = 0;
  }

  // Streak Multiplier (1.5x to 3.0x)
  streakMultiplier = streak >= 2 ? Math.min(3.0, 1.0 + (streak - 1) * 0.5) : 1.0;
  const pointsAwarded = Math.round(result.points * streakMultiplier);
  score += pointsAwarded;
  reactionTimes.push(result.reactionMs);

  // Speed-of-Sound Delayed Metallic Clang
  audio.playTargetHit(result.distanceMeters, result.isCenterMass);

  // Visual Hit-Marker & Telemetry Tag
  hud.showHitMarker(result.isCenterMass, pointsAwarded, result.distanceMeters);
}

function finishMission() {
  gameState = 'AAR';
  document.exitPointerLock?.();

  const accuracy = shotsFired > 0 ? (shotsHit / shotsFired) * 100 : 0;
  const centerMassRatio = shotsHit > 0 ? (centerMassHits / shotsHit) * 100 : 0;
  const avgReaction = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;

  const q = currentMission.qualification;
  const passed = accuracy >= q.minAccuracyPct &&
                 score >= q.minScore &&
                 (q.maxReactionMs === null || avgReaction <= q.maxReactionMs);

  const results = {
    totalScore: score,
    accuracy,
    centerMassRatio,
    avgReactionTime: avgReaction,
    passed,
  };

  const hasNext = currentMissionIndex < MISSIONS.length - 1;

  hud.showAAR(
    results,
    () => deployToFiringLine(currentMission), // Retry
    hasNext ? () => startMissionFlow(currentMissionIndex + 1) : null // Next
  );
}

// ── Game Loop (Delta-Time Calculation) ────────────────────
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.05); // Cap dt
  lastTime = now;

  if (gameState === 'ACTIVE') {
    missionTimer -= dt;

    // Mission 5 Mid-Mission Wind Shift at t = 30s
    if (currentMission.id === 5) {
      if (missionTimer <= 30 && currentWind !== currentMission.windSpeedMps[1]) {
        currentWind = currentMission.windSpeedMps[1];
        ballistics.setWind(currentWind);
        hud.setWind(currentWind);
      }
    }

    // Process Weapon Switch
    if (controller.consumeWeaponSwitch()) {
      togglePlayerWeapon();
    }

    // Process Target Movement Mode Toggle (Key M or Top HUD click)
    if (controller.consumeTargetModeToggle()) {
      toggleTargetMovementMode();
    }

    // Process Reload
    if (controller.consumeReload()) {
      startReload(false);
    }
    if (reloading) {
      reloadTimer -= dt;
      if (reloadTimer <= 0) {
        reloading = false;
        const cfg = WEAPON_CONFIGS[viewmodel.currentWeapon];
        currentMag = Math.min(cfg.magSize, totalAmmo);
      }
    }

    // Process Fire (Left Click or CTRL or Enter)
    if (controller.consumeFire()) {
      triggerShot();
    }

    // Update FPS Look Controller (passes dt for keyboard smooth turning)
    controller.update(dt);

    // Update 3D Rifle Viewmodel (ADS, Lissajous breathing sway, recoil)
    viewmodel.update(dt, controller.isADS, controller.isHoldingBreath);

    // Heartbeat Audio when lung stamina < 25%
    if (viewmodel.stamina <= 0.25 && now - lastHeartbeatTime > 750) {
      audio.playHeartbeat();
      lastHeartbeatTime = now;
    }

    // Update 3D Projectile Ballistics & Sub-stepped Collisions
    ballistics.update(dt, targetMgr.activeMeshes, onBulletHitTarget);

    // Update Target Hinge Drop & Rail Movement
    targetMgr.update(dt);

    // Update Scene Light & Muzzle Timers
    sceneMgr.update(dt);

    // Update Tactical HUD DOM
    hud.updateHUD({
      timer: missionTimer,
      score,
      multiplier: streakMultiplier,
      mag: currentMag,
      totalAmmo,
      reloading,
      reloadProgress: reloading ? 1 - (reloadTimer / reloadDuration) : 1,
      isHoldingBreath: viewmodel.isHoldingBreath,
      stamina: viewmodel.stamina,
      adsProgress: viewmodel.adsProgress,
      weaponType: viewmodel.currentWeapon,
      recoilBloom: (viewmodel.recoilPitch + viewmodel.recoilYaw) * 100,
    });

    // Check End Conditions (Clock expired, all hostile targets cleared, or all ammo spent)
    const targetsCleared = targetMgr.getActiveCount() === 0;
    const outOfAmmo = currentMag === 0 && totalAmmo === 0 && !reloading && !ballistics.hasActiveBullets();

    if (missionTimer <= 0 || targetsCleared || outOfAmmo) {
      if (endDelayTimer === null) {
        // Allow 0.85s delay so cadet sees the final target drop and hears the acoustic clang
        endDelayTimer = targetsCleared ? 0.85 : 0.35;
      } else {
        endDelayTimer -= dt;
        if (endDelayTimer <= 0) {
          endDelayTimer = null;
          finishMission();
        }
      }
    } else {
      endDelayTimer = null;
    }
  }

  // Render Three.js WebGL Scene
  sceneMgr.render();
}

// ── Boot ──────────────────────────────────────────────────
hud.showMenu(() => startMissionFlow(0));
requestAnimationFrame(animate);
