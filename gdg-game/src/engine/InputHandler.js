/**
 * InputHandler — unified pointer + touch + keyboard input.
 *
 * Mobile & Desktop optimized:
 *   - Normalizes screen coordinates to 1920×1080 logical space
 *   - Suppresses browser pinch/zoom, long-press callout, and default tap delay
 *   - Tracks pointer position and per-frame click/tap queue
 */
import { CONFIG } from '../constants/config.js';

export class InputHandler {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this._canvas = canvas;

    /** Current pointer/touch position in logical coords */
    this.pointerX = CONFIG.LOGICAL_WIDTH / 2;
    this.pointerY = CONFIG.LOGICAL_HEIGHT / 2;

    /** Queue of click/tap events (logical coords) consumed each frame */
    this._clickQueue = [];

    /** Keyboard state */
    this._keysDown = new Set();
    this._keysPressed = new Set();

    // Bind listeners
    canvas.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
    canvas.addEventListener('pointerdown', this._onPointerDown.bind(this), { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
  }

  /**
   * Convert screen coords to 1920×1080 logical space.
   */
  _toLogical(e) {
    const rect = this._canvas.getBoundingClientRect();
    const scaleX = CONFIG.LOGICAL_WIDTH / rect.width;
    const scaleY = CONFIG.LOGICAL_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  _onPointerMove(e) {
    const pos = this._toLogical(e);
    this.pointerX = pos.x;
    this.pointerY = pos.y;
  }

  _onPointerDown(e) {
    // Prevent zoom/scroll on mobile
    if (e.cancelable) e.preventDefault();

    const pos = this._toLogical(e);
    this.pointerX = pos.x;
    this.pointerY = pos.y;
    this._clickQueue.push({ x: pos.x, y: pos.y });
  }

  _onKeyDown(e) {
    const key = e.key.toUpperCase();
    if (!this._keysDown.has(key)) {
      this._keysPressed.add(key);
    }
    this._keysDown.add(key);
  }

  _onKeyUp(e) {
    this._keysDown.delete(e.key.toUpperCase());
  }

  /**
   * Drain and return all clicks since last call.
   * @returns {{x: number, y: number}[]}
   */
  consumeClicks() {
    const clicks = this._clickQueue;
    this._clickQueue = [];
    return clicks;
  }

  /**
   * Check if a key was pressed this frame (one-shot).
   * @param {string} key - uppercase key name
   */
  wasPressed(key) {
    return this._keysPressed.has(key);
  }

  /**
   * Check if a key is currently held.
   * @param {string} key - uppercase key name
   */
  isDown(key) {
    return this._keysDown.has(key);
  }

  /**
   * Call at the END of each frame to clear one-shot key states.
   */
  flush() {
    this._keysPressed.clear();
  }
}
