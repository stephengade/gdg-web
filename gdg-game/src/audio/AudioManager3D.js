/**
 * AudioManager3D — Procedural Web Audio API Synthesizer
 *
 * Zero external MP3/WAV dependencies.
 * Features:
 *   - Gunshot transient & 150Hz -> 40Hz low-end bass punch
 *   - Speed-of-Sound Delayed Target Clang: scheduled at (currentTime + D / 343s)
 *   - Breath hold inhale/exhale noise filter
 *   - Dynamic 60Hz heartbeat thump when breath stamina is critical (<25%)
 *   - Dry fire click and two-stage reload latch
 */
export class AudioManager3D {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.heartbeatTimer = 0;
    this.isBreathing = false;
  }

  /**
   * Initialize audio context on first user interaction (pointerlock / tap).
   */
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureRunning() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Gunshot with supersonic crack & sub-bass punch (0ms delay).
   */
  playGunshot() {
    if (!this.ctx) return;
    this.ensureRunning();
    const now = this.ctx.currentTime;

    // 1. Noise transient (powder explosion)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1400, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.10);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    whiteNoise.start(now);

    // 2. Punchy low-end sine kick (150Hz -> 40Hz)
    const kickOsc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    kickOsc.type = 'triangle';
    kickOsc.frequency.setValueAtTime(160, now);
    kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.14);

    kickGain.gain.setValueAtTime(1.0, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    kickOsc.connect(kickGain);
    kickGain.connect(this.masterGain);
    kickOsc.start(now);
    kickOsc.stop(now + 0.15);

    // 3. High-frequency supersonic snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(2800, now);
    snapOsc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

    snapGain.gain.setValueAtTime(0.4, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    snapOsc.connect(snapGain);
    snapGain.connect(this.masterGain);
    snapOsc.start(now);
    snapOsc.stop(now + 0.03);
  }

  /**
   * Distance-delayed metallic target clang (Acoustic speed-of-sound delay).
   * Scheduled at currentTime + (distanceMeters / 343)
   * @param {number} distanceMeters
   * @param {boolean} isCenterMass
   */
  playTargetHit(distanceMeters, isCenterMass = false) {
    if (!this.ctx) return;
    this.ensureRunning();

    // Speed of sound: 343 m/s
    const acousticDelay = Math.max(0.02, distanceMeters / 343);
    const hitTime = this.ctx.currentTime + acousticDelay;

    const baseFreq = isCenterMass ? 1320 : 880;

    // Metallic ring oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, hitTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, hitTime + 0.22);

    // Volume drops slightly with extreme distance
    const distAtten = Math.max(0.35, 1 - (distanceMeters / 300));
    gain.gain.setValueAtTime(0.7 * distAtten, hitTime);
    gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(hitTime);
    osc.stop(hitTime + 0.26);
  }

  /**
   * Dry-fire click on empty magazine.
   */
  playDryFire() {
    if (!this.ctx) return;
    this.ensureRunning();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  /**
   * Two-stage tactical reload latch (mag drop + bolt rack).
   */
  playReload() {
    if (!this.ctx) return;
    this.ensureRunning();
    const now = this.ctx.currentTime;

    // Stage 1: Mag release click
    this._playMechanicalClick(now, 1600, 0.04);
    // Stage 2: Mag insertion at +0.6s
    this._playMechanicalClick(now + 0.6, 950, 0.06);
    // Stage 3: Bolt slide rack forward at +1.0s
    this._playMechanicalClick(now + 1.0, 2400, 0.05);
  }

  _playMechanicalClick(time, freq, dur) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(200, time + dur);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  /**
   * Heartbeat thump when lung stamina is critically low (<25%).
   */
  playHeartbeat() {
    if (!this.ctx) return;
    this.ensureRunning();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(62, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }
}

