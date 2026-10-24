/**
 * Web Audio API Sound Synthesizer for Solat Adventure World.
 * No external audio files required. Safe for all browsers & sandboxes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: { stop: () => void } | null = null;
  private isBgmPlaying: boolean = false;

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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Click / Tap sound: friendly wooden pop
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Audio fallback silent
    }
  }

  // Correct Answer: Cheerful chime (C5 -> E5 -> G5 -> C6)
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = this.ctx!.currentTime + idx * 0.08;
        const endTime = startTime + 0.25;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // Ignore audio error
    }
  }

  // Wrong Answer: Gentle kid-friendly boing / soft buzz
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch {
      // Ignore
    }
  }

  // Fanfare / Level Cleared: Grand triumphant chord
  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const chords = [
        { f: [523.25, 659.25, 783.99], time: 0, dur: 0.18 },       // C major
        { f: [587.33, 739.99, 880.00], time: 0.2, dur: 0.18 },     // D major
        { f: [659.25, 830.61, 987.77], time: 0.4, dur: 0.2 },      // E major
        { f: [783.99, 987.77, 1046.50, 1318.51], time: 0.65, dur: 0.75 }, // G & High C triumphant
      ];

      chords.forEach(c => {
        c.f.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          const startTime = t + c.time;
          const endTime = startTime + c.dur;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.01, startTime);
          gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, endTime);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(startTime);
          osc.stop(endTime);
        });
      });
    } catch {
      // Ignore
    }
  }

  // Bridge Assembling Sound: Magical sparkle + rhythmic wooden clicks
  public playBridgeAssemble() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 5 ascending harp/plank drops
      for (let i = 0; i < 6; i++) {
        const time = t + i * 0.16;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320 + i * 110, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.23);
      }

      // Final celebratory chime at end
      setTimeout(() => {
        this.playCorrect();
      }, 950);
    } catch {
      // Ignore
    }
  }

  // Star collect sparkle
  public playStarTwinkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, t); // E6
      osc.frequency.exponentialRampToValueAtTime(1760.00, t + 0.15); // A6

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch {
      // Ignore
    }
  }

  // Gentle ambient marimba background loop
  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isBgmPlaying = true;
      let step = 0;
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C, D, E, G, A, C

      const interval = setInterval(() => {
        if (!this.isBgmPlaying || this.isMuted || !this.ctx) {
          clearInterval(interval);
          return;
        }
        if (Math.random() > 0.3) {
          const freq = pentatonic[step % pentatonic.length];
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.42);
        }
        step = (step + 1) % pentatonic.length;
      }, 350);

      this.bgmOscillators = {
        stop: () => {
          clearInterval(interval);
          this.isBgmPlaying = false;
        },
      };
    } catch {
      // Ignore
    }
  }

  public stopBgm() {
    if (this.bgmOscillators) {
      this.bgmOscillators.stop();
      this.bgmOscillators = null;
    }
    this.isBgmPlaying = false;
  }

  // Voice mentor speech in Malay (Web Speech API)
  public speak(text: string, enabled: boolean = true) {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Friendly cadence for 7-year-olds
      utterance.pitch = 1.15; // Cheerful warm pitch

      const voices = window.speechSynthesis.getVoices();
      // Look for Malay or Indonesian voice, otherwise fallback
      const malayVoice = voices.find(v => v.lang.startsWith('ms') || v.lang.startsWith('id') || v.name.toLowerCase().includes('malay'));
      if (malayVoice) {
        utterance.voice = malayVoice;
      }
      utterance.lang = 'ms-MY';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback silent
    }
  }
}

export const sound = new SoundEngine();
