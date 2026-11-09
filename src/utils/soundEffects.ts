import { PawnColor } from '../types/game';

export interface CharacterProfile {
  name: string;
  title: string;
  baseFreq: number;
}

export const CHARACTER_PROFILES: Record<PawnColor, CharacterProfile> = {
  red: {
    name: 'Petualang Merah',
    title: 'Pemberani & Tangguh',
    baseFreq: 330,
  },
  blue: {
    name: 'Petualang Biru',
    title: 'Peneliti Cerdas',
    baseFreq: 440,
  },
  green: {
    name: 'Petualang Hijau',
    title: 'Sahabat Sehat',
    baseFreq: 370,
  },
  yellow: {
    name: 'Petualang Kuning',
    title: 'Cepat & Ceria',
    baseFreq: 490,
  },
  purple: {
    name: 'Petualang Ungu',
    title: 'Pencari Rahasia',
    baseFreq: 392,
  },
  orange: {
    name: 'Petualang Oranye',
    title: 'Penuh Energi',
    baseFreq: 350,
  },
};

export interface BgmTrack {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  bpm: number;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'ceria-explorer',
    title: 'Petualangan Ceria',
    subtitle: 'Irama marimba riang gembira & bersahabat',
    badge: '🌟 Favorit Ceria',
    bpm: 115,
    icon: '🎒',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'semangat-juara',
    title: 'Semangat Juara!',
    subtitle: 'Irama cepat penuh motivasi & membakar semangat',
    badge: '⚡ Motivasi Tinggi',
    bpm: 136,
    icon: '🏆',
    color: 'from-rose-500 to-amber-500',
  },
  {
    id: 'detektif-sains',
    title: 'Misteri Organ Sains',
    subtitle: 'Petikan staccato cerdas & lincah penuh rasa ingin tahu',
    badge: '🔬 Eksplorasi Sains',
    bpm: 120,
    icon: '🔍',
    color: 'from-indigo-500 to-sky-500',
  },
  {
    id: 'karnaval-anak',
    title: 'Karnaval Pesta Belajar',
    subtitle: 'Musik pesta anak bertempo rancak yang membuat suasana heboh',
    badge: '🎉 Ceria & Asik',
    bpm: 128,
    icon: '🎈',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'custom',
    title: 'Musik / Lagu Sendiri',
    subtitle: 'Unggah lagu MP3/WAV pilihan guru atau siswa dari perangkat',
    badge: '📁 File Audio Anda',
    bpm: 0,
    icon: '🎵',
    color: 'from-purple-500 to-pink-500',
    isCustom: true,
  },
];

// Web Audio API Synthesizer with Cheerful Kids BGM & High-Quality SFX

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private sfxMuted: boolean = false;
  private bgmMuted: boolean = false;
  private isBgmActive: boolean = false;
  private bgmTimer: number | null = null;
  private bgmStepIndex: number = 0;
  private currentTrackId: string = 'ceria-explorer';
  private bgmVolume: number = 0.7; // 0.0 to 1.0
  private customAudio: HTMLAudioElement | null = null;
  private customTrackName: string = 'Lagu Sendiri.mp3';
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
      const savedTrack = localStorage.getItem('digestive_adventure_bgm_track');
      if (savedTrack && BGM_TRACKS.some((t) => t.id === savedTrack)) {
        this.currentTrackId = savedTrack;
      }
      const savedVol = localStorage.getItem('digestive_adventure_bgm_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.bgmVolume = parsed;
        }
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

  public getCurrentTrackId(): string {
    return this.currentTrackId;
  }

  public getCurrentTrack(): BgmTrack {
    return BGM_TRACKS.find((t) => t.id === this.currentTrackId) || BGM_TRACKS[0];
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('digestive_adventure_bgm_volume', String(this.bgmVolume));
    if (this.customAudio) {
      this.customAudio.volume = this.bgmVolume;
    }
    this.notify();
  }

  public setBgmTrack(trackId: string) {
    if (this.currentTrackId === trackId) return;
    const wasPlaying = this.isBgmOn();
    this.pauseBgm();
    this.currentTrackId = trackId;
    localStorage.setItem('digestive_adventure_bgm_track', trackId);
    this.bgmStepIndex = 0;
    if (wasPlaying) {
      this.startBgm();
    } else {
      this.notify();
    }
  }

  public getCustomTrackName(): string {
    return this.customTrackName;
  }

  public setCustomAudioFile(file: File) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }
    const objectUrl = URL.createObjectURL(file);
    this.customTrackName = file.name;
    const audio = new Audio(objectUrl);
    audio.loop = true;
    audio.volume = this.bgmVolume;
    this.customAudio = audio;
    this.setBgmTrack('custom');
    if (!this.bgmMuted) {
      this.startBgm();
    }
  }

  public setCustomAudioUrl(url: string, name?: string) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }
    this.customTrackName = name || 'Musik URL';
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this.bgmVolume;
    this.customAudio = audio;
    this.setBgmTrack('custom');
    if (!this.bgmMuted) {
      this.startBgm();
    }
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
   * MULTI-THEME CHILDREN'S BACKGROUND MUSIC (BGM)
   * ------------------------------------------------------------- */
  public startBgm() {
    if (this.bgmMuted) return;
    this.initCtx();

    if (this.currentTrackId === 'custom' && this.customAudio) {
      this.isBgmActive = true;
      this.customAudio.volume = this.bgmVolume;
      this.customAudio.play().catch(() => {});
      this.notify();
      return;
    }

    if (!this.ctx) return;
    if (this.isBgmActive && this.bgmTimer) return;
    this.isBgmActive = true;
    this.scheduleBgmLoop();
    this.notify();
  }

  public pauseBgm() {
    this.isBgmActive = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.notify();
  }

  private scheduleBgmLoop() {
    if (!this.isBgmActive || this.bgmMuted || !this.ctx) return;

    if (this.currentTrackId === 'custom') {
      if (this.customAudio && this.customAudio.paused) {
        this.customAudio.play().catch(() => {});
      }
      return;
    }

    const vol = this.bgmVolume;
    const now = this.ctx.currentTime;

    // --- TRACK 1: PETUALANGAN CERIA (Upbeat Marimba ~115 BPM) ---
    if (this.currentTrackId === 'ceria-explorer') {
      const beatDuration = 0.26;
      const melody = [
        { note: 523.25, bass: 130.81, dur: 0.22 },
        { note: 659.25, dur: 0.22 },
        { note: 783.99, bass: 196.0, dur: 0.22 },
        { note: 659.25, dur: 0.22 },
        { note: 880.0, bass: 174.61, dur: 0.22 },
        { note: 783.99, dur: 0.22 },
        { note: 659.25, bass: 196.0, dur: 0.22 },
        { note: 523.25, dur: 0.22 },
        { note: 587.33, bass: 146.83, dur: 0.22 },
        { note: 698.46, dur: 0.22 },
        { note: 880.0, bass: 196.0, dur: 0.22 },
        { note: 783.99, dur: 0.22 },
        { note: 659.25, bass: 130.81, dur: 0.22 },
        { note: 783.99, dur: 0.22 },
        { note: 1046.5, bass: 196.0, dur: 0.25 },
        { note: 783.99, dur: 0.22 },
      ];

      const current = melody[this.bgmStepIndex % melody.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(current.note, now);
      gain.gain.setValueAtTime(0.06 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + current.dur + 0.05);

      if (current.bass) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(current.bass, now);
        bassGain.gain.setValueAtTime(0.05 * vol, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.22);
      }

      this.bgmStepIndex = (this.bgmStepIndex + 1) % melody.length;
      this.bgmTimer = window.setTimeout(() => this.scheduleBgmLoop(), beatDuration * 1000);
      return;
    }

    // --- TRACK 2: SEMANGAT JUARA! (High-Energy March ~136 BPM) ---
    if (this.currentTrackId === 'semangat-juara') {
      const beatDuration = 0.22;
      const melody = [
        // Motivating driving march: C - C - E - G | G - F - E - D | G - G - B - D6 | C6 - G - E - C
        { note: 523.25, bass: 130.81, dur: 0.18, type: 'sawtooth' as OscillatorType },
        { note: 523.25, dur: 0.18, type: 'sawtooth' as OscillatorType },
        { note: 659.25, bass: 130.81, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 783.99, bass: 196.0, dur: 0.24, type: 'square' as OscillatorType },
        { note: 783.99, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 698.46, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 659.25, bass: 174.61, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 587.33, bass: 196.0, dur: 0.22, type: 'sawtooth' as OscillatorType },
        { note: 783.99, bass: 196.0, dur: 0.18, type: 'sawtooth' as OscillatorType },
        { note: 783.99, dur: 0.18, type: 'sawtooth' as OscillatorType },
        { note: 987.77, bass: 196.0, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 1174.66, bass: 146.83, dur: 0.24, type: 'square' as OscillatorType },
        { note: 1046.5, bass: 130.81, dur: 0.22, type: 'square' as OscillatorType },
        { note: 783.99, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 659.25, bass: 196.0, dur: 0.18, type: 'triangle' as OscillatorType },
        { note: 523.25, bass: 130.81, dur: 0.26, type: 'sawtooth' as OscillatorType },
      ];

      const current = melody[this.bgmStepIndex % melody.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = current.type || 'triangle';
      osc.frequency.setValueAtTime(current.note, now);
      gain.gain.setValueAtTime(0.045 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + current.dur + 0.04);

      if (current.bass) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(current.bass, now);
        bassGain.gain.setValueAtTime(0.038 * vol, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.2);
      }

      this.bgmStepIndex = (this.bgmStepIndex + 1) % melody.length;
      this.bgmTimer = window.setTimeout(() => this.scheduleBgmLoop(), beatDuration * 1000);
      return;
    }

    // --- TRACK 3: DETEKTIF ORGAN SAINS (Curious Pizzicato Quest ~120 BPM) ---
    if (this.currentTrackId === 'detektif-sains') {
      const beatDuration = 0.25;
      const melody = [
        { note: 659.25, bass: 164.81, dur: 0.12 }, // E5
        { note: 987.77, dur: 0.12 },              // B5
        { note: 783.99, bass: 196.0, dur: 0.12 },  // G5
        { note: 1318.51, dur: 0.14 },             // E6
        { note: 587.33, bass: 146.83, dur: 0.12 }, // D5
        { note: 880.0, dur: 0.12 },               // A5
        { note: 739.99, bass: 146.83, dur: 0.12 }, // F#5
        { note: 1174.66, dur: 0.14 },             // D6
        { note: 523.25, bass: 130.81, dur: 0.12 }, // C5
        { note: 783.99, dur: 0.12 },              // G5
        { note: 659.25, bass: 130.81, dur: 0.12 }, // E5
        { note: 1046.5, dur: 0.14 },              // C6
        { note: 493.88, bass: 123.47, dur: 0.12 }, // B4
        { note: 739.99, dur: 0.12 },              // F#5
        { note: 622.25, bass: 123.47, dur: 0.12 }, // D#5
        { note: 987.77, bass: 164.81, dur: 0.18 }, // B5
      ];

      const current = melody[this.bgmStepIndex % melody.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(current.note, now);
      gain.gain.setValueAtTime(0.065 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + current.dur + 0.03);

      if (current.bass) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(current.bass, now);
        bassGain.gain.setValueAtTime(0.04 * vol, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.18);
      }

      this.bgmStepIndex = (this.bgmStepIndex + 1) % melody.length;
      this.bgmTimer = window.setTimeout(() => this.scheduleBgmLoop(), beatDuration * 1000);
      return;
    }

    // --- TRACK 4: KARNAVAL PESTA BELAJAR (Joyful Fiesta ~128 BPM) ---
    {
      const beatDuration = 0.235;
      const melody = [
        { note: 523.25, bass: 130.81, dur: 0.18 }, // C5
        { note: 783.99, dur: 0.18 },              // G5
        { note: 1046.5, bass: 174.61, dur: 0.2 },  // C6
        { note: 783.99, dur: 0.16 },              // G5
        { note: 880.0, bass: 174.61, dur: 0.18 },  // A5
        { note: 698.46, dur: 0.16 },              // F5
        { note: 587.33, bass: 196.0, dur: 0.18 },  // D5
        { note: 698.46, dur: 0.16 },              // F5
        { note: 783.99, bass: 130.81, dur: 0.18 }, // G5
        { note: 659.25, dur: 0.16 },              // E5
        { note: 523.25, bass: 130.81, dur: 0.18 }, // C5
        { note: 659.25, dur: 0.16 },              // E5
        { note: 587.33, bass: 196.0, dur: 0.18 },  // D5
        { note: 783.99, dur: 0.16 },              // G5
        { note: 987.77, bass: 196.0, dur: 0.2 },   // B5
        { note: 1046.5, bass: 130.81, dur: 0.24 }, // C6
      ];

      const current = melody[this.bgmStepIndex % melody.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(current.note, now);
      gain.gain.setValueAtTime(0.06 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + current.dur + 0.04);

      if (current.bass) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(current.bass, now);
        bassGain.gain.setValueAtTime(0.045 * vol, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.2);
      }

      this.bgmStepIndex = (this.bgmStepIndex + 1) % melody.length;
      this.bgmTimer = window.setTimeout(() => this.scheduleBgmLoop(), beatDuration * 1000);
    }
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

  // Unique Signature Fanfare SFX per Character when starting movement (Web Audio API Synthesizer)
  public playCharacterStart(color: PawnColor) {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    switch (color) {
      case 'red': {
        // Brave fanfare: C4 -> E4 -> G4 -> C5 (bold brassy chime)
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = idx === notes.length - 1 ? 'triangle' : 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.12, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.25);
        });
        break;
      }
      case 'blue': {
        // Smart scientist: Bright xylophone glockenspiel (E4 -> B4 -> E5 -> G#5)
        const notes = [329.63, 493.88, 659.25, 830.61];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.15, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.3);
        });
        break;
      }
      case 'green': {
        // Nature scout: Warm wooden flute acoustic arpeggio (F4 -> A4 -> C5 -> F5)
        const notes = [349.23, 440.0, 523.25, 698.46];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.14, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.28);
        });
        break;
      }
      case 'yellow': {
        // Sunny sprinter: Fast sparkling high glissando (G4 -> D5 -> G5 -> B5)
        const notes = [392.0, 587.33, 783.99, 987.77];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.16, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.22);
        });
        break;
      }
      case 'purple': {
        // Mystery seeker: Ethereal magic harp ripple (D4 -> F#4 -> A4 -> C#5 -> D5)
        const notes = [293.66, 369.99, 440.0, 554.37, 587.33];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.13, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.32);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.35);
        });
        break;
      }
      case 'orange': {
        // Dynamo: Upbeat peppy synth bounce (C4 -> G4 -> C5 -> E5)
        const notes = [261.63, 392.0, 523.25, 659.25];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + idx * 0.06 + 0.1);
          gain.gain.setValueAtTime(0.15, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
        break;
      }
    }
  }

  // Unique hop step SFX per character color
  public playCharacterStep(color: PawnColor, stepIndex: number = 0) {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const profile = CHARACTER_PROFILES[color] || CHARACTER_PROFILES.red;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonic pitch variation across steps
    const pitchOffset = (stepIndex % 5) * 20;
    const startFreq = profile.baseFreq + pitchOffset;

    switch (color) {
      case 'red':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.08);
        break;
      case 'blue':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.6, now + 0.07);
        break;
      case 'green':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.4, now + 0.07);
        break;
      case 'yellow':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.7, now + 0.08);
        break;
      case 'purple':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.45, now + 0.09);
        break;
      case 'orange':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(startFreq * 0.9, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.65, now + 0.08);
        break;
    }

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }
}

export const sounds = new SoundEffectsManager();
