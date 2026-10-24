/**
 * Cozimo Bedtime Sound Synthesizer Engine
 * Pure Web Audio API procedural synthesis for offline, artifact-free, endless calming sounds.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private timerInterval: number | null = null;
  private remainingSeconds: number = 0;
  private totalTimerSeconds: number = 0;
  private isFadingOut: boolean = false;
  private timerCallback: ((remaining: number, total: number, isFading: boolean) => void) | null = null;
  private timerCompleteCallback: (() => void) | null = null;

  // Active sound generator nodes
  private activeGenerators: Map<string, { gain: GainNode; stop: () => void }> = new Map();
  private volumes: Map<string, number> = new Map([
    ["rain", 0],
    ["ocean", 0],
    ["lullaby", 0],
    ["whitenoise", 0],
    ["heartbeat", 0],
    ["crickets", 0],
    ["stream", 0],
  ]);

  private masterVolume: number = 0.8;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isFadingOut) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  // --- Rain generator (pink noise through dual bandpass & random drop taps) ---
  private startRain(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("rain") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    // Noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    const filter2 = ctx.createBiquadFilter();
    filter2.type = "highpass";
    filter2.frequency.setValueAtTime(120, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(filter2);
    filter2.connect(gain);
    whiteNoise.start();

    // Occasional soft droplets
    let dropletTimer: number;
    const playDroplet = () => {
      if (!this.activeGenerators.has("rain")) return;
      try {
        const osc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        osc.type = "sine";
        const freq = 1200 + Math.random() * 1400;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.06);

        dropGain.gain.setValueAtTime(0.04 * (this.volumes.get("rain") || 0.5), ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        osc.connect(dropGain);
        dropGain.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {
        // ignore
      }
      dropletTimer = window.setTimeout(playDroplet, 200 + Math.random() * 600);
    };
    playDroplet();

    return {
      gain,
      stop: () => {
        try {
          clearTimeout(dropletTimer);
          whiteNoise.stop();
          gain.disconnect();
        } catch (e) {}
      },
    };
  }

  // --- Ocean Waves generator (slow surging pink noise filter sweep) ---
  private startOcean(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("ocean") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(250, ctx.currentTime);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    // LFO to sweep ocean tides (~0.12 Hz = 8.3s cycle)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(280, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(gain);

    lfo.start();
    noise.start();

    return {
      gain,
      stop: () => {
        try {
          noise.stop();
          lfo.stop();
          gain.disconnect();
        } catch (e) {}
      },
    };
  }

  // --- Lullaby Music Box generator (procedural gentle pentatonic melody) ---
  private startLullaby(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("lullaby") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    // Soothing pentatonic notes (C4, D4, E4, G4, A4, C5, D5, E5, G5)
    const notes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25, 783.99, 880.00
    ];

    // Gentle lullaby pattern
    const pattern = [0, 2, 4, 2, 5, 4, 2, 0, 3, 2, 1, 0, 4, 3, 2, 1];
    let step = 0;
    let timer: number;

    const playNote = () => {
      if (!this.activeGenerators.has("lullaby")) return;
      try {
        const noteIndex = pattern[step % pattern.length];
        const freq = notes[noteIndex];
        step++;

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Music box timbre: sine + soft overtone
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

        const currentVol = (this.volumes.get("lullaby") || 0.5) * 0.18;
        noteGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(currentVol, ctx.currentTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

        osc.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(gain);

        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 2.0);
        osc2.stop(ctx.currentTime + 2.0);
      } catch (e) {}

      // Slow gentle tempo (around 52 bpm)
      timer = window.setTimeout(playNote, 1150);
    };

    playNote();

    return {
      gain,
      stop: () => {
        clearTimeout(timer);
        gain.disconnect();
      },
    };
  }

  // --- White / Pink Noise generator ---
  private startWhiteNoise(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("whitenoise") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Warm lowpass filter to make it cozy rather than harsh hiss
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    whiteNoise.start();

    return {
      gain,
      stop: () => {
        try {
          whiteNoise.stop();
          gain.disconnect();
        } catch (e) {}
      },
    };
  }

  // --- Mother's Heartbeat generator (gentle rhythmic lub-dub at 60 bpm) ---
  private startHeartbeat(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("heartbeat") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    let timer: number;
    const playThump = (freq: number, decay: number, peakVol: number) => {
      try {
        const osc = ctx.createOscillator();
        const thumpGain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + decay);

        thumpGain.gain.setValueAtTime(0.001, ctx.currentTime);
        thumpGain.gain.linearRampToValueAtTime(peakVol * 0.45, ctx.currentTime + 0.03);
        thumpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

        osc.connect(thumpGain);
        thumpGain.connect(gain);

        osc.start();
        osc.stop(ctx.currentTime + decay + 0.05);
      } catch (e) {}
    };

    const triggerBeat = () => {
      if (!this.activeGenerators.has("heartbeat")) return;
      // Lub
      playThump(68, 0.15, 0.5);
      // Dub (slightly softer, ~250ms later)
      setTimeout(() => {
        if (!this.activeGenerators.has("heartbeat")) return;
        playThump(60, 0.18, 0.38);
      }, 260);

      // Repeat at 60 bpm (1000ms period)
      timer = window.setTimeout(triggerBeat, 1000);
    };

    triggerBeat();

    return {
      gain,
      stop: () => {
        clearTimeout(timer);
        gain.disconnect();
      },
    };
  }

  // --- Crickets / Night Meadow generator ---
  private startCrickets(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("crickets") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    let timer: number;
    const chirp = () => {
      if (!this.activeGenerators.has("crickets")) return;
      try {
        const osc = ctx.createOscillator();
        const chirpGain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(4500, ctx.currentTime);

        const currentVol = (this.volumes.get("crickets") || 0.5) * 0.08;
        chirpGain.gain.setValueAtTime(0.001, ctx.currentTime);
        chirpGain.gain.linearRampToValueAtTime(currentVol, ctx.currentTime + 0.02);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        osc.connect(chirpGain);
        chirpGain.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}

      timer = window.setTimeout(chirp, 120 + Math.random() * 300);
    };

    chirp();

    return {
      gain,
      stop: () => {
        clearTimeout(timer);
        gain.disconnect();
      },
    };
  }

  // --- Gentle Forest Stream ---
  private startStream(): { gain: GainNode; stop: () => void } {
    this.initContext();
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.get("stream") || 0.5, ctx.currentTime);
    gain.connect(this.masterGain!);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    noise.start();

    return {
      gain,
      stop: () => {
        try {
          noise.stop();
          gain.disconnect();
        } catch (e) {}
      },
    };
  }

  // Public controls
  public toggleSound(id: string, enable?: boolean): boolean {
    const isCurrentlyActive = this.activeGenerators.has(id);
    const shouldEnable = enable !== undefined ? enable : !isCurrentlyActive;

    if (shouldEnable && !isCurrentlyActive) {
      let gen: { gain: GainNode; stop: () => void } | null = null;
      if (id === "rain") gen = this.startRain();
      else if (id === "ocean") gen = this.startOcean();
      else if (id === "lullaby") gen = this.startLullaby();
      else if (id === "whitenoise") gen = this.startWhiteNoise();
      else if (id === "heartbeat") gen = this.startHeartbeat();
      else if (id === "crickets") gen = this.startCrickets();
      else if (id === "stream") gen = this.startStream();

      if (gen) {
        this.activeGenerators.set(id, gen);
        return true;
      }
    } else if (!shouldEnable && isCurrentlyActive) {
      const active = this.activeGenerators.get(id);
      if (active) {
        active.stop();
        this.activeGenerators.delete(id);
      }
      return false;
    }
    return shouldEnable;
  }

  public setSoundVolume(id: string, vol: number) {
    this.volumes.set(id, Math.max(0, Math.min(1, vol)));
    const active = this.activeGenerators.get(id);
    if (active && this.ctx) {
      active.gain.gain.cancelScheduledValues(this.ctx.currentTime);
      active.gain.gain.setTargetAtTime(this.volumes.get(id) || 0, this.ctx.currentTime, 0.05);
    }
  }

  public getSoundVolume(id: string): number {
    return this.volumes.get(id) ?? 0.5;
  }

  public isPlaying(id: string): boolean {
    return this.activeGenerators.has(id);
  }

  public getActiveCount(): number {
    return this.activeGenerators.size;
  }

  public stopAll() {
    this.activeGenerators.forEach((gen) => {
      gen.stop();
    });
    this.activeGenerators.clear();
  }

  // Preset Mixes
  public applyPreset(presetId: "rainy_night" | "deep_slumber" | "womb_comfort" | "starry_nursery") {
    this.stopAll();
    if (presetId === "rainy_night") {
      this.setSoundVolume("rain", 0.65);
      this.setSoundVolume("whitenoise", 0.25);
      this.toggleSound("rain", true);
      this.toggleSound("whitenoise", true);
    } else if (presetId === "deep_slumber") {
      this.setSoundVolume("ocean", 0.6);
      this.setSoundVolume("crickets", 0.3);
      this.toggleSound("ocean", true);
      this.toggleSound("crickets", true);
    } else if (presetId === "womb_comfort") {
      this.setSoundVolume("heartbeat", 0.7);
      this.setSoundVolume("whitenoise", 0.4);
      this.toggleSound("heartbeat", true);
      this.toggleSound("whitenoise", true);
    } else if (presetId === "starry_nursery") {
      this.setSoundVolume("lullaby", 0.5);
      this.setSoundVolume("crickets", 0.25);
      this.toggleSound("lullaby", true);
      this.toggleSound("crickets", true);
    }
  }

  // --- Sleep Timer with Gentle Volume Fade-Out ---
  public startTimer(
    minutes: number,
    onTick: (remaining: number, total: number, isFading: boolean) => void,
    onComplete: () => void
  ) {
    this.clearTimer();
    this.totalTimerSeconds = minutes * 60;
    this.remainingSeconds = this.totalTimerSeconds;
    this.isFadingOut = false;
    this.timerCallback = onTick;
    this.timerCompleteCallback = onComplete;

    onTick(this.remainingSeconds, this.totalTimerSeconds, false);

    this.timerInterval = window.setInterval(() => {
      this.remainingSeconds -= 1;

      // Start fade out in the last 60 seconds (or 30s if timer < 2 min)
      const fadeWindow = Math.min(60, Math.floor(this.totalTimerSeconds * 0.25));
      if (this.remainingSeconds <= fadeWindow && this.remainingSeconds > 0) {
        this.isFadingOut = true;
        if (this.masterGain && this.ctx) {
          const fadeProgress = this.remainingSeconds / fadeWindow;
          const fadedVolume = this.masterVolume * fadeProgress;
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.setValueAtTime(Math.max(0.0001, fadedVolume), this.ctx.currentTime);
        }
      }

      if (this.timerCallback) {
        this.timerCallback(this.remainingSeconds, this.totalTimerSeconds, this.isFadingOut);
      }

      if (this.remainingSeconds <= 0) {
        this.stopAll();
        this.clearTimer();
        // Reset master gain back to normal for next time
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
        if (this.timerCompleteCallback) {
          this.timerCompleteCallback();
        }
      }
    }, 1000);
  }

  public clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.remainingSeconds = 0;
    this.isFadingOut = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getRemainingSeconds(): number {
    return this.remainingSeconds;
  }
}

export const soundEngine = new SoundEngine();
