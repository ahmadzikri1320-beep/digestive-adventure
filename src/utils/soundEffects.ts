/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer with Cheerful Kids BGM & High-Quality SFX

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private sfxMuted: boolean = false;
  private bgmMuted: boolean = false;
  private isBgmActive: boolean = false;
  private bgmTimer: number | null = null;
  private bgmGainNode: GainNode | null = null;
  private bgmStepIndex: number = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSfx = localStorage.getItem('digestive_adventure_sfx_muted');
      if (savedSfx !== null) {
        this.sfxMuted = savedSfx === 'true';
      }
      const savedBgm = localStorage.getItem('digestive_adventure_bgm_muted');
      if (savedBgm !== null) {
        this.bgmMuted = savedBgm === 'true';
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public isMuted(): boolean {
    return this.sfxMuted;
  }

  public isBgmOn(): boolean {
    return !this.bgmMuted && this.isBgmActive;
  }

  public toggleMute(): boolean {
    this.sfxMuted = !this.sfxMuted;
    localStorage.setItem('digestive_adventure_sfx_muted', String(this.sfxMuted));
    this.notify();
    return this.sfxMuted;
  }

  public toggleBgm(): boolean {
    this.initCtx();
    this.bgmMuted = !this.bgmMuted;
    localStorage.setItem('digestive_adventure_bgm_muted', String(this.bgmMuted));
    if (this.bgmMuted) {
      this.pauseBgm();
    } else {
      this.startBgm();
    }
    this.notify();
    return !this.bgmMuted;
  }

  /* -------------------------------------------------------------
   * CHEERFUL CHILDREN'S BACKGROUND MUSIC (BGM)
   * A happy, playful marimba tune at ~112 BPM (16-beat loop)
   * ------------------------------------------------------------- */
  public startBgm() {
    if (this.bgmMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.isBgmActive && this.bgmTimer) return;
    this.isBgmActive = true;
    this.scheduleBgmLoop();
    this.notify();
  }

  public pauseBgm() {
    this.isBgmActive = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.notify();
  }

  private scheduleBgmLoop() {
    if (!this.isBgmActive || this.bgmMuted || !this.ctx) return;

    const beatDuration = 0.26; // ~115 BPM
    const melody = [
      // Bar 1: C - E - G - E
      { note: 523.25, bass: 130.81, dur: 0.22 },
      { note: 659.25, dur: 0.22 },
      { note: 783.99, bass: 196.0, dur: 0.22 },
      { note: 659.25, dur: 0.22 },

      // Bar 2: A - G - E - C
      { note: 880.0, bass: 174.61, dur: 0.22 },
      { note: 783.99, dur: 0.22 },
      { note: 659.25, bass: 196.0, dur: 0.22 },
      { note: 523.25, dur: 0.22 },

      // Bar 3: D - F - A - G
      { note: 587.33, bass: 146.83, dur: 0.22 },
      { note: 698.46, dur: 0.22 },
      { note: 880.0, bass: 196.0, dur: 0.22 },
      { note: 783.99, dur: 0.22 },

      // Bar 4: E - G - C6 - G
      { note: 659.25, bass: 130.81, dur: 0.22 },
      { note: 783.99, dur: 0.22 },
      { note: 1046.5, bass: 196.0, dur: 0.25 },
      { note: 783.99, dur: 0.22 },
    ];

    const currentBeat = melody[this.bgmStepIndex % melody.length];
    const now = this.ctx.currentTime;

    // Lead Marimba Voice
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(currentBeat.note, now);

    // Soft warm envelope
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + currentBeat.dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + currentBeat.dur + 0.05);

    // Bass accompaniment on strong beats
    if (currentBeat.bass) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(currentBeat.bass, now);
      bassGain.gain.setValueAtTime(0.035, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.22);
    }

    this.bgmStepIndex = (this.bgmStepIndex + 1) % melody.length;
    this.bgmTimer = window.setTimeout(() => {
      this.scheduleBgmLoop();
    }, beatDuration * 1000);
  }

  /* -------------------------------------------------------------
   * SOUND EFFECTS (SFX)
   * ------------------------------------------------------------- */

  // Soft dice rolling rattle
  public playDiceRoll() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 260, now + i * 0.045);

      gain.gain.setValueAtTime(0.09, now + i * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.05);
    }
  }

  // Pawn step hop (cute cartoon boing)
  public playStep() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Card flip / draw (crisp swoop)
  public playCardFlip() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Happy bonus chime (+10, +15, quiz correct)
  public playBonus() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.16, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.28);
    });
  }

  // Penalty / trap boop
  public playPenalty() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [329.63, 293.66, 261.63, 220.0]; // E4, D4, C4, A3
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.11, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.2);
    });
  }

  // Shield / Saver card sound (heroic chime)
  public playShield() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(1174, now + 0.28);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // QR scanner / electronic chirp
  public playQrBeep() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1800, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Tactile click
  public playButton() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Victory fanfare for finish/winner
  public playVictory() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.14 }, // C5
      { f: 523.25, d: 0.14 }, // C5
      { f: 523.25, d: 0.14 }, // C5
      { f: 659.25, d: 0.32 }, // E5
      { f: 783.99, d: 0.32 }, // G5
      { f: 1046.5, d: 0.65 }, // C6
    ];

    let t = now;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d * 0.9;
    });
  }
}

export const sounds = new SoundEffectsManager();
