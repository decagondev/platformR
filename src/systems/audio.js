const SOUND_DEFS = {
  jump: { frequency: 440, duration: 0.1, type: 'square' },
  doubleJump: { frequency: 660, duration: 0.12, type: 'square' },
  death: { frequency: 150, duration: 0.3, type: 'sawtooth' },
  landing: { frequency: 200, duration: 0.05, type: 'triangle' },
  levelComplete: { frequency: 880, duration: 0.4, type: 'sine' },
};

export class AudioManager {
  #ctx;
  #muted = false;

  constructor(audioContext) {
    this.#ctx = audioContext || null;
  }

  get isMuted() {
    return this.#muted;
  }

  mute() {
    this.#muted = true;
  }

  unmute() {
    this.#muted = false;
  }

  play(name) {
    if (this.#muted) return;

    const def = SOUND_DEFS[name];
    if (!def || !this.#ctx) return;

    try {
      if (this.#ctx.resume) {
        this.#ctx.resume();
      }

      const osc = this.#ctx.createOscillator();
      const gain = this.#ctx.createGain();

      osc.type = def.type;
      osc.frequency.setValueAtTime(def.frequency, this.#ctx.currentTime);

      gain.gain.setValueAtTime(0.3, this.#ctx.currentTime);
      gain.gain.linearRampToValueAtTime(
        0,
        this.#ctx.currentTime + def.duration,
      );

      osc.connect(gain);
      gain.connect(this.#ctx.destination);

      osc.start(this.#ctx.currentTime);
      osc.stop(this.#ctx.currentTime + def.duration);
    } catch (_e) {
      // Graceful fallback if audio context is blocked
    }
  }
}
