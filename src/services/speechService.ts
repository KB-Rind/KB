/**
 * Speech Service: Gemini TTS with high-quality Web Speech API fallback,
 * plus Mother's Voice audio clip playback.
 */

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeakingFlag: boolean = false;
  private onEndCallback: (() => void) | null = null;

  public async speakText(
    text: string,
    options?: {
      voice?: string;
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    this.stop();
    this.isSpeakingFlag = true;
    this.onEndCallback = options?.onEnd || null;

    if (options?.onStart) options.onStart();

    // Try Gemini TTS first
    try {
      const response = await fetch("/api/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: options?.voice || "Kore", // Kore is calm, warm female voice
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audioDataUrl) {
          await this.playAudioUrl(data.audioDataUrl, options?.onEnd);
          return;
        }
      }
    } catch (e) {
      console.warn("Server TTS unreachable, falling back to Web Speech API", e);
    }

    // Fallback to Web Speech API
    this.speakWithWebSpeech(text, options);
  }

  private playAudioUrl(url: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.currentAudio = new Audio(url);
      this.currentAudio.onended = () => {
        this.isSpeakingFlag = false;
        this.currentAudio = null;
        if (onEnd) onEnd();
        resolve();
      };
      this.currentAudio.onerror = () => {
        this.isSpeakingFlag = false;
        this.currentAudio = null;
        if (onEnd) onEnd();
        resolve();
      };
      this.currentAudio.play().catch(() => {
        this.isSpeakingFlag = false;
        if (onEnd) onEnd();
        resolve();
      });
    });
  }

  private speakWithWebSpeech(
    text: string,
    options?: {
      rate?: number;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (!("speechSynthesis" in window)) {
      this.isSpeakingFlag = false;
      if (options?.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean story text (remove parenthetical cues for smoother bedtime listening)
    const clean = text.replace(/\(.*?\)/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean);

    // Bedtime pacing: slower and slightly warmer pitch
    utterance.rate = options?.rate || 0.85;
    utterance.pitch = 0.95;

    // Pick best English voice available
    const voices = window.speechSynthesis.getVoices();
    const soothingVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Moira"))) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (soothingVoice) {
      utterance.voice = soothingVoice;
    }

    utterance.onend = () => {
      this.isSpeakingFlag = false;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeakingFlag = false;
      if (options?.onError) options.onError(e);
      if (options?.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public playMotherVoiceClip(dataUrl: string, onEnd?: () => void): Promise<void> {
    this.stop();
    return this.playAudioUrl(dataUrl, onEnd);
  }

  public stop() {
    this.isSpeakingFlag = false;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (this.onEndCallback) {
      const cb = this.onEndCallback;
      this.onEndCallback = null;
      cb();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingFlag;
  }
}

export const speechService = new SpeechService();
