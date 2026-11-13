/**
 * GameLoop — requestAnimationFrame loop with delta-time calculation.
 * Dispatches update(dt) and render(ctx) every frame.
 * Caps dt to CONFIG.MAX_DELTA to prevent physics explosions on tab-away.
 */
import { CONFIG } from '../constants/config.js';

export class GameLoop {
  constructor(canvas, ctx) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._lastTime = 0;
    this._running = false;
    this._updateFn = null;
    this._renderFn = null;
    this._boundTick = this._tick.bind(this);
  }

  /**
   * @param {function(number): void} updateFn - receives dt in seconds
   * @param {function(CanvasRenderingContext2D): void} renderFn - receives ctx
   */
  start(updateFn, renderFn) {
    this._updateFn = updateFn;
    this._renderFn = renderFn;
    this._running = true;
    this._lastTime = performance.now();
    requestAnimationFrame(this._boundTick);
  }

  stop() {
    this._running = false;
  }

  _tick(now) {
    if (!this._running) return;

    let dt = (now - this._lastTime) / 1000; // ms → seconds
    this._lastTime = now;

    // Clamp to prevent spiral of death
    if (dt > CONFIG.MAX_DELTA) dt = CONFIG.MAX_DELTA;

    this._updateFn(dt);

    // Clear and scale canvas to logical resolution
    this._ctx.save();
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    const scaleX = this._canvas.width / CONFIG.LOGICAL_WIDTH;
    const scaleY = this._canvas.height / CONFIG.LOGICAL_HEIGHT;
    this._ctx.scale(scaleX, scaleY);

    this._renderFn(this._ctx);

    this._ctx.restore();

    requestAnimationFrame(this._boundTick);
  }
}

