/**
 * FPSController — Unified Desktop (Arrow Keys, Trackpad, Mouse) & Mobile (CoD Touch) Controls
 *
 * Implements:
 *   - Desktop Keyboard Aiming:
 *       • Turn Left:  ArrowLeft or A (both e.code and e.key)
 *       • Turn Right: ArrowRight or D
 *       • Pitch Up:   ArrowUp or W
 *       • Pitch Down: ArrowDown or S or Z
 *       • Instant tap pulse for responsive micro-stepping + smooth continuous hold rotation
 *   - Desktop Trackpad & Mouse:
 *       • Pointer Lock on click (standard FPS mouse look)
 *       • Trackpad / Mouse Drag-to-Aim (works instantly even without pointer lock)
 *       • Trackpad Two-Finger Pan via Wheel (horizontal & vertical look)
 *       • Trackpad Pinch-to-Zoom (zoom in/out of optic scope)
 *       • Physical Mouse Wheel notch zoom
 *   - Accessible Shooting:
 *       • Left Click (Mouse / Trackpad tap)
 *       • CTRL Key (ControlLeft / ControlRight)
 *       • Enter Key (Enter / NumpadEnter)
 *   - Zoom / ADS Controls:
 *       • Shift key / Q key / E key (toggle ADS / Scope)
 *       • Right Mouse Button (hold)
 *   - Call of Duty Mobile Ergonomic Touch Architecture:
 *       • Full-Screen Invisible Touch-Drag Aiming (swiping anywhere rotates camera)
 *       • Dynamic ADS Sensitivity Scaling (0.45x Carbine, 0.25x DL-50 Sniper for micro-aiming)
 *       • Right Fire Button Aim-Dragging (allows dragging to aim while holding fire)
 *       • Multi-touch finger separation (aiming finger tracked independently from button taps)
 */
import * as THREE from 'three';

export class FPSController {
  /**
   * @param {THREE.Camera} camera
   * @param {HTMLCanvasElement} canvas
   */
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;

    // Pitch & Yaw orientation
    this.yaw = 0;
    this.pitch = 0;
    this.mouseSensitivity = 0.0022;
    this.touchSensitivity = 0.0035;
    this.keyboardTurnSpeed = 2.4; // Radians per second for Arrow / WASD keys (fast & responsive)

    // Weapon state awareness for ADS sensitivity scaling
    this.isSniperWeapon = true;

    // Input States
    this.isPointerLocked = false;
    this.isFireRequested = false;
    this.isADS = false;
    this.isHoldingBreath = false;
    this.isReloadRequested = false;
    this.isWeaponSwitchRequested = false;
    this.isTargetModeToggleRequested = false;

    // Active held keys for smooth keyboard aiming
    this.keysHeld = new Set();

    // Desktop Trackpad & Mouse Drag State (works even without pointer lock)
    this.isPointerDown = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Mobile CoD Touch State
    this.aimTouchId = null;
    this.lastAimX = 0;
    this.lastAimY = 0;

    this.fireAimTouchId = null;
    this.lastFireAimX = 0;
    this.lastFireAimY = 0;

    this._setupDesktopListeners();
    this._setupTouchListeners();
  }

  /**
   * Sensitivity scaled down when zoomed in for precision sniping micro-adjustments
   */
  getAimSensitivity() {
    if (!this.isADS) return this.mouseSensitivity;
    return this.isSniperWeapon ? this.mouseSensitivity * 0.25 : this.mouseSensitivity * 0.45;
  }

  getTouchSensitivity() {
    if (!this.isADS) return this.touchSensitivity;
    return this.isSniperWeapon ? this.touchSensitivity * 0.25 : this.touchSensitivity * 0.45;
  }

  _setupDesktopListeners() {
    // 1. Pointer Lock on Canvas Click
    this.canvas.addEventListener('click', (e) => {
      // Only request lock on primary left button click
      if (e.button === 0 && !this.isPointerLocked) {
        this.canvas.requestPointerLock?.();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvas;
    });

    // 2. Trackpad / Mouse Drag-to-Aim (Works both with AND without Pointer Lock)
    this.canvas.addEventListener('pointerdown', (e) => {
      // Only track mouse/pen/trackpad clicks (mobile touches handled in _setupTouchListeners)
      if (e.pointerType === 'touch') return;

      this.isPointerDown = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      if (e.button === 0) {
        this.isFireRequested = true;
        if (!this.isPointerLocked) {
          this.canvas.requestPointerLock?.();
        }
      } else if (e.button === 2) {
        this.isADS = true;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;

      const sens = this.getAimSensitivity();

      if (this.isPointerLocked) {
        // Locked pointer movement
        this.yaw -= e.movementX * sens;
        this.pitch -= e.movementY * sens;
        this._clampPitch();
      } else if (this.isPointerDown) {
        // Unlocked trackpad/mouse drag movement
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        this.yaw -= dx * sens;
        this.pitch -= dy * sens;
        this._clampPitch();
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') return;
      this.isPointerDown = false;
      if (e.button === 2) {
        this.isADS = false;
      }
    });

    // 3. Trackpad Two-Finger Pan & Pinch-to-Zoom / Mouse Wheel
    window.addEventListener('wheel', (e) => {
      // Prevent page scrolling
      e.preventDefault();

      // Trackpad Pinch Gesture (Chrome / Edge / Safari sends ctrlKey: true with wheel)
      if (e.ctrlKey) {
        if (e.deltaY < 0) {
          this.isADS = true; // Pinch in -> zoom in
        } else if (e.deltaY > 0) {
          this.isADS = false; // Pinch out -> zoom out
        }
        return;
      }

      // Trackpad Two-Finger Pan: Emits continuous deltaX/deltaY with deltaMode === 0
      const isTrackpadPan = Math.abs(e.deltaX) > 0 || (Math.abs(e.deltaY) < 70 && e.deltaMode === 0);

      if (isTrackpadPan) {
        const sens = this.getAimSensitivity() * 0.9;
        this.yaw -= e.deltaX * sens;
        this.pitch -= e.deltaY * sens;
        this._clampPitch();
      } else {
        // Physical Notched Mouse Wheel
        if (e.deltaY < 0) {
          this.isADS = true; // Wheel up -> zoom in
        } else if (e.deltaY > 0) {
          this.isADS = false; // Wheel down -> zoom out
        }
      }
    }, { passive: false });

    // Prevent right-click context menu
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // 4. Desktop Keyboard Controls (Arrow Keys, WASD, CTRL, SPACE, R, SHIFT)
    window.addEventListener('keydown', (e) => {
      // Prevent browser scrolling with arrow keys, space, enter
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) ||
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      const prevHas = this.keysHeld.has(e.code) || this.keysHeld.has(e.key);
      this.keysHeld.add(e.code);
      this.keysHeld.add(e.key);

      // Instant Tap Pulse for Arrow Keys & WASD (Gives immediate tactical micro-stepping feedback)
      if (!prevHas && !e.repeat) {
        const stepScale = this.isADS ? 0.45 : 1.0;
        if (this._isLeftKey(e.code, e.key)) {
          this.yaw += 0.035 * stepScale;
        } else if (this._isRightKey(e.code, e.key)) {
          this.yaw -= 0.035 * stepScale;
        } else if (this._isUpKey(e.code, e.key)) {
          this.pitch += 0.028 * stepScale;
          this._clampPitch();
        } else if (this._isDownKey(e.code, e.key)) {
          this.pitch -= 0.028 * stepScale;
          this._clampPitch();
        }
      }

      // Accessible Shooting: CTRL key or Enter key
      if (e.code === 'ControlLeft' || e.code === 'ControlRight' || e.key === 'Control' ||
          e.code === 'Enter' || e.code === 'NumpadEnter' || e.key === 'Enter') {
        if (!e.repeat) {
          this.isFireRequested = true;
        }
      }

      // Breath Hold: Spacebar
      if (e.code === 'Space' || e.key === ' ') {
        this.isHoldingBreath = true;
      }

      // Reload: R key
      if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        this.isReloadRequested = true;
      }

      // Toggle ADS / Scope: Shift key or Q or E
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift' ||
          e.code === 'KeyQ' || e.key === 'q' || e.code === 'KeyE' || e.key === 'e') {
        if (!e.repeat) {
          this.isADS = !this.isADS;
        }
      }

      // Switch Weapon: 1 or 2 key or X key
      if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'KeyX' || e.key === 'x' || e.key === 'X') {
        if (!e.repeat) {
          this.isWeaponSwitchRequested = true;
        }
      }

      // Toggle Target Movement Mode (Static vs Moving): M key
      if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        if (!e.repeat) {
          this.isTargetModeToggleRequested = true;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysHeld.delete(e.code);
      this.keysHeld.delete(e.key);

      if (e.code === 'Space' || e.key === ' ') {
        this.isHoldingBreath = false;
      }
    });

    // Reset held keys on window blur so keys never stick
    window.addEventListener('blur', () => {
      this.keysHeld.clear();
      this.isPointerDown = false;
      this.isHoldingBreath = false;
    });
  }

  _isLeftKey(code, key) {
    return code === 'ArrowLeft' || key === 'ArrowLeft' || key === 'Left' || code === 'KeyA' || key === 'a' || key === 'A';
  }

  _isRightKey(code, key) {
    return code === 'ArrowRight' || key === 'ArrowRight' || key === 'Right' || code === 'KeyD' || key === 'd' || key === 'D';
  }

  _isUpKey(code, key) {
    return code === 'ArrowUp' || key === 'ArrowUp' || key === 'Up' || code === 'KeyW' || key === 'w' || key === 'W';
  }

  _isDownKey(code, key) {
    return code === 'ArrowDown' || key === 'ArrowDown' || key === 'Down' ||
           code === 'KeyS' || key === 's' || key === 'S' ||
           code === 'KeyZ' || key === 'z' || key === 'Z';
  }

  /* ── Call of Duty Mobile Ergonomic Touch Aiming ─── */

  _setupTouchListeners() {
    // 1. Full-Screen Invisible Touch-Drag Aiming (outside action buttons)
    this.canvas.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (this.aimTouchId === null) {
          this.aimTouchId = touch.identifier;
          this.lastAimX = touch.clientX;
          this.lastAimY = touch.clientY;
        }
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.aimTouchId) {
          const dx = touch.clientX - this.lastAimX;
          const dy = touch.clientY - this.lastAimY;
          this.lastAimX = touch.clientX;
          this.lastAimY = touch.clientY;

          const sens = this.getTouchSensitivity();
          this.yaw -= dx * sens;
          this.pitch -= dy * sens;
          this._clampPitch();
        }
      }
    }, { passive: false });

    const endAimTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.aimTouchId) {
          this.aimTouchId = null;
        }
      }
    };

    this.canvas.addEventListener('touchend', endAimTouch);
    this.canvas.addEventListener('touchcancel', endAimTouch);
  }

  /**
   * Bind Right Fire button to allow simultaneous firing AND aim-dragging (CoD Mobile style)
   * @param {HTMLElement} fireBtnElement
   */
  bindRightFireAimDrag(fireBtnElement) {
    if (!fireBtnElement) return;

    fireBtnElement.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (this.fireAimTouchId === null) {
          this.fireAimTouchId = touch.identifier;
          this.lastFireAimX = touch.clientX;
          this.lastFireAimY = touch.clientY;
        }
      }
    }, { passive: false });

    fireBtnElement.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.fireAimTouchId) {
          const dx = touch.clientX - this.lastFireAimX;
          const dy = touch.clientY - this.lastFireAimY;
          this.lastFireAimX = touch.clientX;
          this.lastFireAimY = touch.clientY;

          const sens = this.getTouchSensitivity();
          this.yaw -= dx * sens;
          this.pitch -= dy * sens;
          this._clampPitch();
        }
      }
    }, { passive: false });

    const endFireAimTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.fireAimTouchId) {
          this.fireAimTouchId = null;
        }
      }
    };

    fireBtnElement.addEventListener('touchend', endFireAimTouch);
    fireBtnElement.addEventListener('touchcancel', endFireAimTouch);
  }

  _clampPitch() {
    const maxPitch = (80 * Math.PI) / 180;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
  }

  consumeFire() {
    const fired = this.isFireRequested;
    this.isFireRequested = false;
    return fired;
  }

  consumeReload() {
    const rld = this.isReloadRequested;
    this.isReloadRequested = false;
    return rld;
  }

  consumeWeaponSwitch() {
    const sw = this.isWeaponSwitchRequested;
    this.isWeaponSwitchRequested = false;
    return sw;
  }

  consumeTargetModeToggle() {
    const sw = this.isTargetModeToggleRequested;
    this.isTargetModeToggleRequested = false;
    return sw;
  }

  /**
   * Process smooth continuous keyboard aiming (Arrow keys & WASD) and update camera.
   * @param {number} dt
   */
  update(dt = 0.016) {
    // Process Desktop Keyboard Turn (Arrow keys & WASD)
    const kSpeed = (this.isADS ? (this.isSniperWeapon ? this.keyboardTurnSpeed * 0.35 : this.keyboardTurnSpeed * 0.5) : this.keyboardTurnSpeed) * dt;

    const hasLeft = this.keysHeld.has('ArrowLeft') || this.keysHeld.has('Left') || this.keysHeld.has('KeyA') || this.keysHeld.has('a') || this.keysHeld.has('A');
    const hasRight = this.keysHeld.has('ArrowRight') || this.keysHeld.has('Right') || this.keysHeld.has('KeyD') || this.keysHeld.has('d') || this.keysHeld.has('D');
    const hasUp = this.keysHeld.has('ArrowUp') || this.keysHeld.has('Up') || this.keysHeld.has('KeyW') || this.keysHeld.has('w') || this.keysHeld.has('W');
    const hasDown = this.keysHeld.has('ArrowDown') || this.keysHeld.has('Down') ||
                    this.keysHeld.has('KeyS') || this.keysHeld.has('s') || this.keysHeld.has('S') ||
                    this.keysHeld.has('KeyZ') || this.keysHeld.has('z') || this.keysHeld.has('Z');

    if (hasLeft) {
      this.yaw += kSpeed;
    }
    if (hasRight) {
      this.yaw -= kSpeed;
    }
    if (hasUp) {
      this.pitch += kSpeed;
      this._clampPitch();
    }
    if (hasDown) {
      this.pitch -= kSpeed;
      this._clampPitch();
    }

    // Apply orientation to camera
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.rotation.z = 0;
  }
}
