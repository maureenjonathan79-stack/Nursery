/**
 * Preschool Sound Synthesizer & Speech Engine using Web Audio API
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private soundEnabled = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
    if (!val && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public isMuted(): boolean {
    return !this.soundEnabled;
  }

  // Play sound effects
  public playSparkle() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch {
      // AudioContext not allowed or not ready
    }
  }

  public playPop() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playBoing() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch {}
  }

  public playSuccessFanfare() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      // Joyful fanfare: C5, E5, G5, C6 (high celebration)
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.12, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.6);
      });
    } catch {}
  }

  // Play gentle music-box background melody
  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public isBgmActive(): boolean {
    return this.isBgmPlaying;
  }

  public startBgm() {
    if (!this.soundEnabled || this.isBgmPlaying) return;
    try {
      const ctx = this.initCtx();
      this.isBgmPlaying = true;

      // Nursery rhyme melody notes (Twinkle / ABC gentle pentatonic)
      // C, C, G, G, A, A, G, F, F, E, E, D, D, C
      const melody = [
        { f: 523.25, d: 0.35 },
        { f: 523.25, d: 0.35 },
        { f: 783.99, d: 0.35 },
        { f: 783.99, d: 0.35 },
        { f: 880.0, d: 0.35 },
        { f: 880.0, d: 0.35 },
        { f: 783.99, d: 0.7 },
        { f: 698.46, d: 0.35 },
        { f: 698.46, d: 0.35 },
        { f: 659.25, d: 0.35 },
        { f: 659.25, d: 0.35 },
        { f: 587.33, d: 0.35 },
        { f: 587.33, d: 0.35 },
        { f: 523.25, d: 0.7 },
      ];

      let noteIdx = 0;
      const playNextNote = () => {
        if (!this.isBgmPlaying) return;
        const note = melody[noteIdx];
        noteIdx = (noteIdx + 1) % melody.length;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Music-box bell tone: sine + soft harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + note.d);

        this.bgmTimer = window.setTimeout(playNextNote, note.d * 1000 + 40);
      };

      playNextNote();
    } catch {}
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundEngine();

// Speech Synthesis Helper
export const speakDialogue = (
  text: string,
  speaker: 'mia' | 'leo' | 'both',
  onEnd?: () => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // cancel previous

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Choose voice suitable for preschool character
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));

  if (speaker === 'mia') {
    // Cheerful, higher pitch, friendly
    utterance.pitch = 1.35;
    utterance.rate = 0.95;
    const femaleVoice = englishVoices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('zira') || 
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('google us english')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
  } else if (speaker === 'leo') {
    // Enthusiastic, friendly kid tone
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    const maleVoice = englishVoices.find(v => 
      v.name.toLowerCase().includes('david') || 
      v.name.toLowerCase().includes('guy') || 
      v.name.toLowerCase().includes('alex') ||
      v.name.toLowerCase().includes('george')
    );
    if (maleVoice) utterance.voice = maleVoice;
  } else {
    utterance.pitch = 1.2;
    utterance.rate = 0.95;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
