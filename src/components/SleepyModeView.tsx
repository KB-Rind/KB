import React from "react";
import {
  Moon,
  Sun,
  Timer,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Sparkles,
  Heart,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const SleepyModeView: React.FC = () => {
  const {
    isSleepyMode,
    toggleSleepyMode,
    activeProfile,
    soundTracks,
    toggleSoundTrack,
    applySoundPreset,
    stopAllSounds,
    activeSoundsCount,
    masterVolume,
    setMasterVolume,
    isTimerActive,
    remainingSeconds,
    startTimer,
    cancelTimer,
    isTimerFading,
    nightLightWarmth,
    setNightLightWarmth,
    nightLightBrightness,
    setNightLightBrightness,
  } = useApp();

  if (!isSleepyMode) return null;

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Compute warm color filter (blocks blue light)
  const warmthStyle = {
    filter: `sepia(${nightLightWarmth * 0.9}%) saturate(${
      100 + nightLightWarmth * 0.5
    }%) brightness(${nightLightBrightness}%)`,
  };

  const handleAddTenMinutes = () => {
    const currentMins = Math.ceil(remainingSeconds / 60);
    startTimer(Math.min(90, currentMins + 10));
  };

  return (
    <div
      style={warmthStyle}
      className="fixed inset-0 z-50 bg-[#050811] text-amber-100 flex flex-col justify-between p-6 sm:p-10 select-none transition-all duration-700"
    >
      {/* Top Bar with Exit and Warmth Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center glow-moon">
            <Moon className="w-6 h-6 fill-amber-300" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-amber-200">
              Sleepy Mode
            </h2>
            <p className="text-[11px] text-amber-300/70">
              Gentle night for {activeProfile.name} • Zero Blue Light
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleSleepyMode(false)}
          className="py-2 px-4 rounded-2xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-600/30 text-amber-200 text-xs font-semibold flex items-center gap-2 transition active:scale-95"
        >
          <X className="w-4 h-4" />
          <span>Exit Sleepy Mode</span>
        </button>
      </div>

      {/* Center glowing moon & sleep atmosphere */}
      <div className="flex flex-col items-center justify-center text-center my-auto space-y-6">
        <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-amber-600/30 to-amber-300/20 border border-amber-400/40 flex items-center justify-center text-6xl shadow-2xl glow-moon">
          🌙
          <div className="absolute inset-0 rounded-full border border-amber-300/20 animate-ping opacity-25" />
        </div>

        <div>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide">
            Rest Sweetly, {activeProfile.name}
          </h3>
          <p className="text-xs text-amber-300/70 mt-1 max-w-xs mx-auto">
            All screens dim, sounds slowly fade out, and dreams softly begin.
          </p>
        </div>

        {/* Big Sleep Timer Widget */}
        <div className="p-5 rounded-3xl bg-amber-950/30 border border-amber-500/30 w-full max-w-sm text-center shadow-lg">
          <div className="text-[11px] uppercase tracking-widest text-amber-400/80 font-bold mb-1">
            {isTimerActive
              ? isTimerFading
                ? "Gentle 2-Min Fade Out..."
                : "Sleep Timer Running"
              : "No Timer Active"}
          </div>

          <div className="text-4xl font-mono font-bold text-amber-300 tracking-wider mb-3">
            {isTimerActive ? formatRemaining(remainingSeconds) : "--:--"}
          </div>

          <div className="flex gap-2 justify-center">
            {isTimerActive ? (
              <>
                <button
                  onClick={handleAddTenMinutes}
                  className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold transition"
                >
                  +10 Minutes
                </button>
                <button
                  onClick={cancelTimer}
                  className="py-2.5 px-4 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300/80 text-xs font-semibold transition"
                >
                  Stop Timer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startTimer(15)}
                  className="py-2 px-3 rounded-xl bg-amber-500/20 text-amber-200 text-xs font-semibold"
                >
                  15 min
                </button>
                <button
                  onClick={() => startTimer(30)}
                  className="py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  30 min
                </button>
                <button
                  onClick={() => startTimer(45)}
                  className="py-2 px-3 rounded-xl bg-amber-500/20 text-amber-200 text-xs font-semibold"
                >
                  45 min
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ambient Sound Quick Switcher */}
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {[
            { id: "rainy_night", label: "Rainy Night", icon: "🌧️" },
            { id: "deep_slumber", label: "Ocean Tide", icon: "🌊" },
            { id: "womb_comfort", label: "Heartbeat", icon: "💓" },
            { id: "starry_nursery", label: "Lullaby Chimes", icon: "🎶" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => applySoundPreset(item.id as any)}
              className="py-2 px-3.5 rounded-2xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-600/30 text-xs font-medium text-amber-200 flex items-center gap-1.5 transition active:scale-95"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          {activeSoundsCount > 0 && (
            <button
              onClick={stopAllSounds}
              className="py-2 px-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-700/40 text-xs font-medium text-rose-300 transition"
            >
              Silence Audio
            </button>
          )}
        </div>
      </div>

      {/* Bottom Nightlight Controls (Brightness & Amber Temperature) */}
      <div className="max-w-md mx-auto w-full p-4 rounded-3xl bg-amber-950/20 border border-amber-600/20 space-y-3">
        <div className="flex items-center justify-between text-xs text-amber-300/80 font-semibold">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" />
            Nursery Screen Brightness: {nightLightBrightness}%
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Warm Candlelight: {nightLightWarmth}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="range"
            min="10"
            max="100"
            value={nightLightBrightness}
            onChange={(e) => setNightLightBrightness(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-amber-950/60 rounded-lg cursor-pointer accent-amber-400"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={nightLightWarmth}
            onChange={(e) => setNightLightWarmth(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-amber-950/60 rounded-lg cursor-pointer accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
