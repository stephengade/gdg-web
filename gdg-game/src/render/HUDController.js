/**
 * HUDController — Tactical DOM HUD & Telescopic Sniper Scope Overlay
 *
 * Implements:
 *   - Telescopic Sniper Scope Overlay (Circular optical lens, black peripheral vignette,
 *     illuminated mil-dots, elevation marks for 50m, 100m, 150m, 200m)
 *   - Hip-fire 4-tick crosshair
 *   - Accessible Control Hints: [CTRL] FIRE • [ARROWS/WASD] AIM • [SHIFT] ZOOM
 *   - Interactive Weapon Loadout Switcher (DL-50 Sniper vs M4A1 Carbine)
 *   - Hit-marker X flash + Telemetry tags (+100 PTS [100m])
 *   - Lung breath stamina bar & wind widget
 */
import { THEME } from '../constants/theme.js';

export class HUDController {
  /**
   * @param {function(string): void} [onWeaponSwitch]
   * @param {function(): void} [onTargetModeToggle]
   */
  constructor(onWeaponSwitch, onTargetModeToggle) {
    this.container = null;
    this.hitMarkerTimer = 0;
    this.telemetryTimer = 0;
    this.onWeaponSwitch = onWeaponSwitch;
    this.onTargetModeToggle = onTargetModeToggle;
    this.isTargetMoving = true;
    this._createDOM();
  }

  _createDOM() {
    let overlay = document.getElementById('hudOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hudOverlay';
      overlay.className = 'hud-overlay';
      document.body.appendChild(overlay);
    }
    this.container = overlay;

    this.container.innerHTML = `
      <!-- Night Vision Scanline & Green Phosphor Filter (Mission 5) -->
      <div id="nvgFilter" class="nvg-filter hidden"></div>

      <!-- Telescopic Sniper Scope View (DL-50 Telescopic Optic) -->
      <div id="sniperScope" class="sniper-scope hidden">
        <div class="scope-bezel">
          <!-- Glass lens surface -->
          <div class="scope-lens">
            <!-- Center Mil-Dot Reticle -->
            <div class="scope-hairline-v"></div>
            <div class="scope-hairline-h"></div>
            <div class="scope-center-dot"></div>

            <!-- Elevation Holdover Markings -->
            <div class="scope-mark m-50"><span>50M</span></div>
            <div class="scope-mark m-100"><span>100M</span></div>
            <div class="scope-mark m-150"><span>150M</span></div>
            <div class="scope-mark m-200"><span>200M</span></div>

            <!-- Windage hash marks -->
            <div class="scope-wind-left"></div>
            <div class="scope-wind-right"></div>
          </div>
        </div>
        <div class="scope-vignette-l"></div>
        <div class="scope-vignette-r"></div>
        <div class="scope-vignette-t"></div>
        <div class="scope-vignette-b"></div>
      </div>

      <!-- Top Bar Telemetry -->
      <div class="hud-top-bar">
        <div class="hud-box">
          <div class="hud-label">MISSION CLOCK</div>
          <div id="hudClock" class="hud-val-mono">45:00.00</div>
        </div>
        <div class="hud-box">
          <div class="hud-label">COMBAT SCORE</div>
          <div id="hudScore" class="hud-val-green">0 PTS</div>
        </div>
        <div id="hudStreakBox" class="hud-box hidden">
          <div class="hud-label">STREAK</div>
          <div id="hudStreak" class="hud-val-gold">×1.5</div>
        </div>
        <!-- Wind Widget (Mission 5) -->
        <div id="hudWindBox" class="hud-box hidden">
          <div class="hud-label">BALLISTIC WIND</div>
          <div id="hudWind" class="hud-val-blue">0.0 m/s</div>
        </div>

        <!-- Weapon Loadout Switcher -->
        <div class="hud-box loadout-pill" id="btnSwitchWeapon">
          <div class="hud-label">WEAPON [KEY: 1 / 2 / X]</div>
          <div id="hudWeaponName" class="hud-val-gold">DL-50 SNIPER</div>
        </div>

        <!-- Target Movement Mode Switcher (Static vs Moving) -->
        <div class="hud-box loadout-pill mode-pill" id="btnToggleTargetMode" title="Toggle Target Movement (Static vs Moving)">
          <div class="hud-label">TARGETS [KEY: M]</div>
          <div id="hudTargetMode" class="hud-val-green">MOVING</div>
        </div>
      </div>

      <!-- Accessible Controls Guide Ribbon -->
      <div class="accessible-hints">
        <span><kbd>CTRL</kbd> / <kbd>CLICK</kbd> FIRE</span>
        <span><kbd>ARROWS</kbd> / <kbd>TRACKPAD</kbd> / <kbd>WASD</kbd> AIM</span>
        <span><kbd>SHIFT</kbd> / <kbd>R-CLICK</kbd> ZOOM</span>
        <span><kbd>SPACE</kbd> BREATH</span>
        <span><kbd>R</kbd> RELOAD</span>
      </div>

      <!-- Center Hip-Fire Crosshair -->
      <div id="hipCrosshair" class="hip-crosshair">
        <div class="reticle-dot"></div>
        <div class="tick tick-top"></div>
        <div class="tick tick-bottom"></div>
        <div class="tick tick-left"></div>
        <div class="tick tick-right"></div>
      </div>

      <!-- Center Hit Marker -->
      <div id="hitMarker" class="hit-marker hidden">
        <div class="hm-line hm-1"></div>
        <div class="hm-line hm-2"></div>
      </div>

      <!-- Telemetry Tag (+100 PTS [100m]) -->
      <div id="telemetryTag" class="telemetry-tag hidden">+100 PTS [100m]</div>

      <!-- Breath Stamina Bar -->
      <div id="staminaContainer" class="stamina-container hidden">
        <div class="stamina-label">LUNG STAMINA</div>
        <div class="stamina-track">
          <div id="staminaFill" class="stamina-fill"></div>
        </div>
      </div>

      <!-- Bottom Ammo Counter -->
      <div class="hud-bottom-bar">
        <!-- Tactical Gunmetal Ammo Bay (Tap to Reload) -->
        <div class="ammo-bay" id="hudAmmoBay" title="Tap to Reload">
          <div id="ammoTitle" class="ammo-title">DL-50 .50 BMG</div>
          <div class="ammo-count"><span id="hudMag" class="mag-num">10</span> / <span id="hudTotal">10</span></div>
          <div class="ammo-tap-hint">[TAP TO RELOAD]</div>
          <div id="reloadBarContainer" class="reload-bar-container hidden">
            <div id="reloadBarFill" class="reload-bar-fill"></div>
          </div>
        </div>
      </div>

      <!-- CoD Mobile / PUBG Ergonomic Touch Action HUD (Translucent, Edge-Hugging, Zero Screen Obstruction) -->
      <div class="mobile-controls">
        <!-- Primary Right FIRE Button (76px x 76px, Bottom-Right: 28px bottom, 32px right) -->
        <button id="touchFireRight" class="cod-touch-btn touch-fire-right" title="Fire (Right Thumb)" aria-label="Fire (Right Thumb)">
          <svg class="touch-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
            <line x1="12" y1="1" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="1" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="23" y2="12"/>
          </svg>
          <span class="btn-label">FIRE</span>
        </button>

        <!-- Secondary Left Trigger FIRE Button (64px x 64px, Middle-Left: 110px bottom, 28px left — Claw/Two-Thumb) -->
        <button id="touchFireLeft" class="cod-touch-btn touch-fire-left" title="Fire (Left Trigger)" aria-label="Fire (Left Trigger)">
          <svg class="touch-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
            <line x1="12" y1="1" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="1" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="23" y2="12"/>
          </svg>
          <span class="btn-label">FIRE</span>
        </button>

        <!-- Tap-To-ADS / ZOOM Toggle Button (56px x 56px, Above Right Fire: 118px bottom, 28px right) -->
        <button id="touchAdsBtn" class="cod-touch-btn touch-ads-btn" title="Toggle Telescopic Scope" aria-label="Toggle Scope">
          <svg class="touch-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="2" x2="12" y2="7"/>
            <line x1="12" y1="17" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="7" y2="12"/>
            <line x1="17" y1="12" x2="22" y2="12"/>
            <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
          </svg>
          <span id="touchAdsLabel" class="btn-label">SCOPE</span>
        </button>

        <!-- HOLD BREATH / STABILIZE Button (56px x 56px, Bottom-Left: 28px bottom, 32px left — Hidden until Zoomed) -->
        <button id="touchBreathBtn" class="cod-touch-btn touch-breath-btn hidden" title="Hold Breath to Stabilize" aria-label="Hold Breath">
          <svg class="breath-ring-svg" viewBox="0 0 56 56">
            <circle class="ring-bg" cx="28" cy="28" r="24"/>
            <circle id="touchBreathRing" class="ring-fill" cx="28" cy="28" r="24"/>
          </svg>
          <svg class="touch-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v8m0 0l-3-3m3 3l3-3"/>
            <path d="M6 12a6 6 0 0 0 6 6 6 6 0 0 0 6-6"/>
          </svg>
          <span class="btn-label">HOLD</span>
        </button>

        <!-- Compact RELOAD Button (48px x 48px, Next to Ammo: 28px bottom, 124px right) -->
        <button id="touchReloadBtn" class="cod-touch-btn touch-reload-btn" title="Reload Ammo" aria-label="Reload Ammo">
          <svg class="touch-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M21.34 15.57a9 9 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          <span id="touchReloadLabel" class="btn-label">RELOAD</span>
        </button>

        <!-- WEAPON SWAP Button (44px x 44px, Above Reload: 84px bottom, 124px right) -->
        <button id="touchWeaponBtn" class="cod-touch-btn touch-weapon-btn" title="Swap Weapon" aria-label="Swap Weapon">
          <svg class="touch-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 16l-4-4m0 0l4-4m-4 4h18m-7 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
          <span class="btn-label">SWAP</span>
        </button>
      </div>

      <!-- Tactical Modals (Menu, Briefing, AAR, Fail) -->
      <div id="modalOverlay" class="modal-overlay hidden">
        <div id="modalCard" class="modal-card"></div>
      </div>
    `;

    // Cache elements
    this.hudClock = document.getElementById('hudClock');
    this.hudScore = document.getElementById('hudScore');
    this.hudStreakBox = document.getElementById('hudStreakBox');
    this.hudStreak = document.getElementById('hudStreak');
    this.hudWindBox = document.getElementById('hudWindBox');
    this.hudWind = document.getElementById('hudWind');
    this.hudWeaponName = document.getElementById('hudWeaponName');
    this.ammoTitle = document.getElementById('ammoTitle');
    this.hipCrosshair = document.getElementById('hipCrosshair');
    this.sniperScope = document.getElementById('sniperScope');
    this.hitMarker = document.getElementById('hitMarker');
    this.telemetryTag = document.getElementById('telemetryTag');
    this.staminaContainer = document.getElementById('staminaContainer');
    this.staminaFill = document.getElementById('staminaFill');
    this.hudMag = document.getElementById('hudMag');
    this.hudTotal = document.getElementById('hudTotal');
    this.reloadBarContainer = document.getElementById('reloadBarContainer');
    this.reloadBarFill = document.getElementById('reloadBarFill');
    this.touchAdsBtn = document.getElementById('touchAdsBtn');
    this.touchAdsLabel = document.getElementById('touchAdsLabel');
    this.touchBreathBtn = document.getElementById('touchBreathBtn');
    this.touchBreathRing = document.getElementById('touchBreathRing');
    this.touchReloadBtn = document.getElementById('touchReloadBtn');
    this.touchReloadLabel = document.getElementById('touchReloadLabel');
    this.hudAmmoBay = document.getElementById('hudAmmoBay');
    this.hudTargetMode = document.getElementById('hudTargetMode');
    this.nvgFilter = document.getElementById('nvgFilter');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalCard = document.getElementById('modalCard');

    // Click on loadout button
    const btnSwitch = document.getElementById('btnSwitchWeapon');
    if (btnSwitch) {
      btnSwitch.onclick = () => {
        if (this.onWeaponSwitch) this.onWeaponSwitch();
      };
    }

    // Click on Target Movement Mode button (Static vs Moving)
    const btnTargetMode = document.getElementById('btnToggleTargetMode');
    if (btnTargetMode) {
      btnTargetMode.onclick = () => {
        if (this.onTargetModeToggle) this.onTargetModeToggle();
      };
    }
  }

  setTargetModeDisplay(isMoving) {
    this.isTargetMoving = isMoving;
    if (this.hudTargetMode) {
      this.hudTargetMode.textContent = isMoving ? 'MOVING' : 'STATIC';
      this.hudTargetMode.className = isMoving ? 'hud-val-green' : 'hud-val-blue';
    }
  }

  setWeaponDisplay(weaponType) {
    if (this.hudWeaponName && this.ammoTitle) {
      if (weaponType === 'SNIPER') {
        this.hudWeaponName.textContent = 'DL-50 SNIPER';
        this.ammoTitle.textContent = 'DL-50 // .50 BMG';
      } else {
        this.hudWeaponName.textContent = 'M4A1 CARBINE';
        this.ammoTitle.textContent = 'M4A1 // 5.56 NATO';
      }
    }
  }

  setNightVision(enabled) {
    if (this.nvgFilter) {
      this.nvgFilter.classList.toggle('hidden', !enabled);
    }
  }

  setWind(windMps) {
    if (this.hudWindBox) {
      if (Math.abs(windMps) > 0.05) {
        this.hudWindBox.classList.remove('hidden');
        const arrow = windMps > 0 ? '>>>' : '<<<';
        this.hudWind.textContent = `${Math.abs(windMps).toFixed(1)} m/s ${arrow}`;
      } else {
        this.hudWindBox.classList.add('hidden');
      }
    }
  }

  updateHUD(state) {
    // 1. Clock
    if (this.hudClock) {
      const sec = Math.max(0, state.timer);
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      const ms = Math.floor((sec % 1) * 100);
      this.hudClock.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }

    // 2. Score & Streak
    if (this.hudScore) {
      this.hudScore.textContent = `${state.score} PTS`;
    }
    if (this.hudStreakBox) {
      if (state.multiplier > 1.0) {
        this.hudStreakBox.classList.remove('hidden');
        this.hudStreak.textContent = `×${state.multiplier.toFixed(1)}`;
      } else {
        this.hudStreakBox.classList.add('hidden');
      }
    }

    // 3. Ammo & Reload
    if (this.hudMag && this.hudTotal) {
      this.hudMag.textContent = state.mag;
      this.hudTotal.textContent = state.totalAmmo;
      if (state.mag <= 2) {
        this.hudMag.classList.add('low-ammo');
      } else {
        this.hudMag.classList.remove('low-ammo');
      }
    }

    if (this.reloadBarContainer) {
      if (state.reloading) {
        this.reloadBarContainer.classList.remove('hidden');
        this.reloadBarFill.style.width = `${Math.min(100, state.reloadProgress * 100)}%`;
      } else {
        this.reloadBarContainer.classList.add('hidden');
      }
    }

    // 4. Breath Stamina Bar
    if (this.staminaContainer) {
      if (state.isHoldingBreath || state.stamina < 0.98) {
        this.staminaContainer.classList.remove('hidden');
        this.staminaFill.style.width = `${state.stamina * 100}%`;
        if (state.stamina <= 0.25) {
          this.staminaFill.classList.add('critical');
        } else {
          this.staminaFill.classList.remove('critical');
        }
      } else {
        this.staminaContainer.classList.add('hidden');
      }
    }

    // 5. Telescopic Scope Overlay vs Hip Crosshair
    const isSniperADS = state.weaponType === 'SNIPER' && state.adsProgress > 0.65;
    if (this.sniperScope) {
      this.sniperScope.classList.toggle('hidden', !isSniperADS);
    }

    if (this.hipCrosshair) {
      // In sniper scope or deep ADS, hide hip-fire crosshair
      if (isSniperADS) {
        this.hipCrosshair.style.opacity = 0;
      } else {
        // Fade out as ADS increases
        const opacity = Math.max(0.2, 1 - state.adsProgress * 0.7);
        this.hipCrosshair.style.opacity = opacity;
        const spread = 8 + (state.recoilBloom || 0) * 1.4;
        this.hipCrosshair.style.setProperty('--tick-offset', `${spread}px`);
      }
    }

    // 6. Mobile Touch Action Feedback (Scope Active, Breath Stamina & Easy Reload Alert)
    if (this.touchAdsBtn) {
      const isZoomed = state.adsProgress > 0.5;
      this.touchAdsBtn.classList.toggle('active', isZoomed);
      if (this.touchAdsLabel) {
        this.touchAdsLabel.textContent = isZoomed ? (state.weaponType === 'SNIPER' ? '16X ON' : '4X ON') : 'SCOPE';
      }
    }

    // Breath Stabilize Button: Only visible when Zoomed/ADS is active
    if (this.touchBreathBtn) {
      const showBreath = state.adsProgress > 0.1;
      this.touchBreathBtn.classList.toggle('hidden', !showBreath);
      if (this.touchBreathRing) {
        const circ = 150.8; // 2 * pi * 24
        const offset = circ * (1 - Math.max(0, Math.min(1, state.stamina)));
        this.touchBreathRing.style.strokeDashoffset = `${offset}px`;
      }
    }

    if (this.touchReloadBtn) {
      const isLow = state.mag <= 3 && !state.reloading;
      this.touchReloadBtn.classList.toggle('low-ammo-pulse', isLow);
      if (this.touchReloadLabel) {
        this.touchReloadLabel.textContent = state.reloading ? 'RELOADING' : (isLow ? 'RELOAD!' : 'RELOAD');
      }
    }

    // Hit marker fade
    if (this.hitMarkerTimer > 0) {
      this.hitMarkerTimer -= 0.016;
      if (this.hitMarkerTimer <= 0) {
        this.hitMarker.classList.add('hidden');
      }
    }

    if (this.telemetryTimer > 0) {
      this.telemetryTimer -= 0.016;
      if (this.telemetryTimer <= 0) {
        this.telemetryTag.classList.add('hidden');
      }
    }
  }

  showHitMarker(isCenterMass, points, distanceMeters) {
    if (!this.hitMarker) return;
    this.hitMarker.classList.remove('hidden');
    this.hitMarker.classList.toggle('critical', isCenterMass);
    this.hitMarkerTimer = 0.14;

    if (this.telemetryTag) {
      this.telemetryTag.classList.remove('hidden');
      this.telemetryTag.textContent = `+${points} PTS [${distanceMeters.toFixed(0)}m]`;
      this.telemetryTimer = 0.9;
    }
  }

  /* ── Modal Screens ────────────────────── */

  showMenu(onStart) {
    this.modalOverlay.classList.remove('hidden');
    this.modalCard.innerHTML = `
      <div class="modal-logo-wrapper">
        <img src="assets/logo.jpg" alt="OAU Cadet Training Insignia" class="modal-logo" />
      </div>
      <h1 class="modal-title">OAU CADET TRAINING</h1>
      <div class="modal-subtitle">3D TACTICAL MARKSMANSHIP SIMULATOR</div>
      <div class="rule-line"></div>
      <p class="modal-desc">
        EST. 1962 // ADVANCED BALLISTICS DEPLOYMENT QUALIFICATION<br>
        PHYSICAL 3D BULLET FLIGHT • GRAVITY DROP • SPEED-OF-SOUND ACOUSTICS
      </p>
      <div class="controls-guide">
        <div><strong>DESKTOP AIM:</strong> [ARROW KEYS], [TRACKPAD PAN/DRAG], or [MOUSE] • [CTRL] or [CLICK] TO FIRE</div>
        <div><strong>DESKTOP ZOOM:</strong> [SHIFT] KEY, RIGHT CLICK, or TRACKPAD PINCH</div>
        <div><strong>MOBILE CONTROLS:</strong> FULL-SCREEN SWIPE TO AIM • TAP [SCOPE] TO ZOOM • DUAL [FIRE] TRIGGERS</div>
        <div><strong>TARGET DRILL MODE:</strong> [M] KEY or TOP HUD PILL TO TOGGLE STATIC VS MOVING TARGETS</div>
        <div><strong>HOLD BREATH & RELOAD:</strong> [SPACEBAR] BREATH • [R] / TAP AMMO BAY TO RELOAD</div>
      </div>
      <button id="btnStartGame" class="btn-primary">[ COMMENCE QUALIFICATION ]</button>
    `;
    document.getElementById('btnStartGame').onclick = () => {
      this.modalOverlay.classList.add('hidden');
      onStart();
    };
  }

  showBriefing(mission, onDeploy, isTargetMoving = true, onModeChange = null) {
    this.modalOverlay.classList.remove('hidden');
    let currentMoving = isTargetMoving;

    this.modalCard.innerHTML = `
      <div class="modal-logo-wrapper small">
        <img src="assets/logo.jpg" alt="OAU Insignia" class="modal-logo mini" />
      </div>
      <div class="brief-header">MISSION BRIEFING // 0${mission.id}</div>
      <h2 class="brief-title">"${mission.codename}"</h2>
      <div class="rule-line"></div>
      <div class="brief-grid">
        <div class="bg-item"><span class="bg-lbl">TARGET LANES:</span> ${mission.lanesMeters.join('m, ')}m</div>
        <div class="bg-item"><span class="bg-lbl">LOADOUT:</span> DL-50 SNIPER / M4A1</div>
        <div class="bg-item"><span class="bg-lbl">TIME LIMIT:</span> ${mission.durationSec} SECONDS</div>
        <div class="bg-item"><span class="bg-lbl">QUALIFICATION:</span> ≥${mission.qualification.minAccuracyPct}% ACCURACY & ≥${mission.qualification.minScore} PTS</div>
      </div>

      <!-- Cadet Choice: Static vs Moving Targets -->
      <div class="target-mode-selector">
        <div class="tms-title">SELECT TARGET DRILL MODE:</div>
        <div class="tms-options">
          <button type="button" id="btnModeMoving" class="tms-btn ${currentMoving ? 'active' : ''}">
            <span class="tms-dot"></span> [ DYNAMIC MOVING TARGETS ]
          </button>
          <button type="button" id="btnModeStatic" class="tms-btn ${!currentMoving ? 'active' : ''}">
            <span class="tms-dot"></span> [ STATIC PRECISION TARGETS ]
          </button>
        </div>
      </div>

      <div class="controls-guide mini">
        TIP: USE [SHIFT] / [SCOPE] FOR DISTANT TARGETS • [M] KEY / TOP HUD TO TOGGLE STATIC/MOVING!
      </div>
      ${mission.allowCivilians ? '<div class="roe-warning">⚠ ZERO-TOLERANCE ROE: NON-COMBATANT HIT = INSTANT COURT-MARTIAL</div>' : ''}
      <button id="btnDeployMission" class="btn-primary">[ DEPLOY TO FIRING LINE ]</button>
    `;

    const btnMoving = document.getElementById('btnModeMoving');
    const btnStatic = document.getElementById('btnModeStatic');

    if (btnMoving && btnStatic) {
      btnMoving.onclick = () => {
        currentMoving = true;
        btnMoving.classList.add('active');
        btnStatic.classList.remove('active');
        if (onModeChange) onModeChange(true);
      };
      btnStatic.onclick = () => {
        currentMoving = false;
        btnStatic.classList.add('active');
        btnMoving.classList.remove('active');
        if (onModeChange) onModeChange(false);
      };
    }

    document.getElementById('btnDeployMission').onclick = () => {
      this.modalOverlay.classList.add('hidden');
      onDeploy(currentMoving);
    };
  }

  showAAR(results, onRetry, onNext) {
    this.modalOverlay.classList.remove('hidden');
    const qualified = results.passed;
    this.modalCard.innerHTML = `
      <div class="modal-logo-wrapper small">
        <img src="assets/logo.jpg" alt="OAU Insignia" class="modal-logo mini" />
      </div>
      <div class="brief-header">AFTER-ACTION REPORT (AAR)</div>
      <h1 class="aar-status ${qualified ? 'qual' : 'retry'}">${qualified ? '★ QUALIFIED: SHARPSHOOTER ★' : 'DRILL COMPLETED: RE-ENGAGE'}</h1>
      <div class="rule-line"></div>
      <p class="aar-feedback">
        ${qualified
          ? 'OUTSTANDING MARKSMANSHIP, CADET. STANDARDS MET WITH DISTINCTION.'
          : 'GOOD RECOIL CONTROL. TAKE YOUR TIME, USE THE DL-50 TELESCOPIC SCOPE [SHIFT], AND STABILIZE BREATH [SPACEBAR].'}
      </p>
      <div class="aar-stats">
        <div class="stat-row"><span>TOTAL COMBAT SCORE</span> <strong>${results.totalScore} PTS</strong></div>
        <div class="stat-row"><span>BALLISTIC ACCURACY</span> <strong>${results.accuracy.toFixed(1)}%</strong></div>
        <div class="stat-row"><span>CENTER-MASS RATIO</span> <strong>${results.centerMassRatio.toFixed(1)}%</strong></div>
        <div class="stat-row"><span>AVG REACTION TIME</span> <strong>${results.avgReactionTime.toFixed(0)} MS</strong></div>
      </div>
      <div class="btn-group">
        <button id="btnRetry" class="btn-secondary">[ RETRY DRILL ]</button>
        ${qualified && onNext ? '<button id="btnNext" class="btn-primary">[ NEXT MISSION ]</button>' : ''}
      </div>
    `;
    document.getElementById('btnRetry').onclick = () => {
      this.modalOverlay.classList.add('hidden');
      onRetry();
    };
    if (qualified && onNext) {
      document.getElementById('btnNext').onclick = () => {
        this.modalOverlay.classList.add('hidden');
        onNext();
      };
    }
  }

  showFail(reason, onRetry) {
    this.modalOverlay.classList.remove('hidden');
    this.modalCard.innerHTML = `
      <div class="modal-logo-wrapper small">
        <img src="assets/logo.jpg" alt="OAU Insignia" class="modal-logo mini" />
      </div>
      <div class="brief-header danger">RULES OF ENGAGEMENT VIOLATION</div>
      <h1 class="aar-status unqual">MISSION TERMINATED</h1>
      <div class="rule-line"></div>
      <p class="fail-reason">${reason}</p>
      <button id="btnFailRetry" class="btn-primary danger-btn">[ REPORT TO FIRING LINE ]</button>
    `;
    document.getElementById('btnFailRetry').onclick = () => {
      this.modalOverlay.classList.add('hidden');
      onRetry();
    };
  }
}
