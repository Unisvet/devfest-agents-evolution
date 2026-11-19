/**
 * Stage-Safe Web Audio Harmonic Chime Engine + Slide 1 Orchestral Overture
 * Synthesizes clean sci-fi transition cues with zero external dependencies,
 * while supporting the Lyria 3.5 orchestral overture in `public/audio/slide1-overture.mp3`.
 */

const OVERTURE_TARGET_VOLUME = 0.42;
const FADE_STEP_MS = 40;

class StageSoundEngine {
  private ctx: AudioContext | null = null;
  private overtureAudio: HTMLAudioElement | null = null;
  private overtureFadeTimer: number | null = null;
  public enabled = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private clearOvertureFade(): void {
    if (this.overtureFadeTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.overtureFadeTimer);
      this.overtureFadeTimer = null;
    }
  }

  private getOvertureUrl(): string {
    const base = import.meta.env.BASE_URL || './';
    const normalized = base.endsWith('/') ? base : `${base}/`;
    return `${normalized}audio/slide1-overture.mp3`;
  }

  public startSlide1Overture(): void {
    if (!this.enabled || typeof window === 'undefined') return;

    if (!this.overtureAudio) {
      const audio = new Audio(this.getOvertureUrl());
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
      this.overtureAudio = audio;
    }

    const audio = this.overtureAudio;
    this.clearOvertureFade();

    if (audio.paused) {
      audio.volume = 0;
      audio.play().catch(() => {
        // Ignore browser autoplay restrictions or missing asset gracefully
      });
    }

    const steps = 35; // ~1.4s smooth cinematic fade-in
    const delta = OVERTURE_TARGET_VOLUME / steps;
    this.overtureFadeTimer = window.setInterval(() => {
      if (!this.enabled || !this.overtureAudio) {
        this.clearOvertureFade();
        return;
      }
      const nextVol = Math.min(OVERTURE_TARGET_VOLUME, audio.volume + delta);
      audio.volume = nextVol;
      if (nextVol >= OVERTURE_TARGET_VOLUME) {
        this.clearOvertureFade();
      }
    }, FADE_STEP_MS);
  }

  public stopSlide1Overture(immediate = false): void {
    if (typeof window === 'undefined' || !this.overtureAudio) return;
    const audio = this.overtureAudio;
    this.clearOvertureFade();

    if (immediate || audio.paused || audio.volume <= 0.01) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
      return;
    }

    const steps = 20; // ~0.8s smooth fade-out when advancing to Slide 2+
    const delta = audio.volume / steps;
    this.overtureFadeTimer = window.setInterval(() => {
      const nextVol = Math.max(0, audio.volume - delta);
      audio.volume = nextVol;
      if (nextVol <= 0.005) {
        this.clearOvertureFade();
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    }, FADE_STEP_MS);
  }

  public playSlideTransition(direction: 'next' | 'prev' = 'next'): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = direction === 'next' ? [330, 495, 660] : [495, 392, 293.66];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.035, now + idx * 0.045 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.34);
    });
  }

  public playEvolutionPulse(intensity = 1): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const baseFreq = 260 + intensity * 90;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }
}

export const soundEngine = new StageSoundEngine();
