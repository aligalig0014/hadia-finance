// Romantic Web Audio Synthesizer for Hadia & Ali Love Proposal

class RomanticAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private currentStep: number = 0;

  // Romantic acoustic piano chord progression notes (Hz)
  // Heartfelt melody in F major / D minor
  private readonly melodyNotes = [
    // F - C - Dm - Bb romantic progression
    { chord: [174.61, 220.00, 261.63], lead: 349.23, dur: 1.6 }, // F
    { chord: [174.61, 261.63, 349.23], lead: 392.00, dur: 0.8 },
    { chord: [174.61, 220.00, 261.63], lead: 440.00, dur: 1.6 },
    { chord: [130.81, 196.00, 261.63], lead: 329.63, dur: 1.6 }, // C
    { chord: [130.81, 196.00, 261.63], lead: 261.63, dur: 0.8 },
    { chord: [146.83, 220.00, 293.66], lead: 349.23, dur: 1.6 }, // Dm
    { chord: [146.83, 220.00, 349.23], lead: 440.00, dur: 0.8 },
    { chord: [146.83, 220.00, 293.66], lead: 523.25, dur: 1.6 },
    { chord: [116.54, 174.61, 233.08], lead: 466.16, dur: 1.6 }, // Bb
    { chord: [116.54, 174.61, 293.66], lead: 392.00, dur: 1.6 },
    { chord: [130.81, 196.00, 261.63], lead: 349.23, dur: 2.0 },
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.playNextBgmNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private playNextBgmNote() {
    if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;

    const note = this.melodyNotes[this.currentStep % this.melodyNotes.length];
    const now = this.ctx.currentTime;

    try {
      // Play warm chord
      note.chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.045 / (i + 1), now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur * 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + note.dur * 1.5);
      });

      // Play soft bell lead piano melody
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'sine';
      leadOsc.frequency.setValueAtTime(note.lead, now + 0.05);

      leadGain.gain.setValueAtTime(0.001, now + 0.05);
      leadGain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur * 1.2);

      leadOsc.connect(leadGain);
      leadGain.connect(this.ctx.destination);

      leadOsc.start(now + 0.05);
      leadOsc.stop(now + note.dur * 1.2);
    } catch {
      // safe fallback
    }

    this.currentStep = (this.currentStep + 1) % this.melodyNotes.length;
    this.bgmTimer = window.setTimeout(() => {
      this.playNextBgmNote();
    }, note.dur * 1000);
  }

  // Soft romantic chime when wax seal opens
  public playWaxSealOpen() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch {
      // safe fallback
    }
  }

  // Soft Heartbeat sound
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [0, 0.22].forEach((offset, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 68 : 55, now + offset);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.25);
      });
    } catch {
      // safe fallback
    }
  }

  // Grand celebratory fanfare when Hadia says YES!
  public playProposalCelebration() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Magical romantic arpeggio
      const notes = [
        { f: 349.23, t: 0.0 },
        { f: 440.00, t: 0.12 },
        { f: 523.25, t: 0.24 },
        { f: 698.46, t: 0.36 },
        { f: 880.00, t: 0.48 },
        { f: 1046.50, t: 0.60 },
        { f: 1396.91, t: 0.72 }
      ];

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.linearRampToValueAtTime(0.12, now + n.t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 1.2);
      });
    } catch {
      // safe fallback
    }
  }

  // Subtle tap or sparkle
  public playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // safe fallback
    }
  }
}

export const romanticAudio = new RomanticAudioManager();
