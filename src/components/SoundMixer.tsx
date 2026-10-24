import React from "react";
import {
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Music,
  Wind,
  Heart,
  Sparkles,
  Droplets,
  Timer,
  Play,
  Square,
  Sliders,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const SoundMixer: React.FC<{ onOpenTimerModal: () => void }> = ({ onOpenTimerModal }) => {
  const {
    soundTracks,
    toggleSoundTrack,
    setSoundTrackVolume,
    masterVolume,
    setMasterVolume,
    applySoundPreset,
    stopAllSounds,
    activeSoundsCount,
    isTimerActive,
    remainingSeconds,
    isTimerFading,
  } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "CloudRain":
        return <CloudRain className="w-5 h-5" />;
      case "Waves":
        return <Waves className="w-5 h-5" />;
      case "Music":
        return <Music className="w-5 h-5" />;
      case "Wind":
        return <Wind className="w-5 h-5" />;
      case "Heart":
        return <Heart className="w-5 h-5" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "Droplets":
        return <Droplets className="w-5 h-5" />;
      default:
        return <Music className="w-5 h-5" />;
    }
  };

  const formatRemaining = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Presets */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-400/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
              <Sliders className="w-3.5 h-3.5" />
              Sleep Sounds & Music Mixer
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">
              Blend Soothing Night Ambience
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Layer raindrops, gentle ocean tides, lullaby chimes, or maternal heartbeat.
            </p>
          </div>

          {/* Quick timer & stop all button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTimerModal}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
                isTimerActive
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                  : "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>
                {isTimerActive
                  ? `${isTimerFading ? "Fading: " : ""}${formatRemaining(remainingSeconds)}`
                  : "Set Sleep Timer"}
              </span>
            </button>

            {activeSoundsCount > 0 && (
              <button
                onClick={stopAllSounds}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-semibold transition"
                title="Silence all sounds"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Quiet All</span>
              </button>
            )}
          </div>
        </div>

        {/* Master Volume Slider */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4 mb-4">
          <Volume2 className="w-5 h-5 text-amber-300 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
              <span>Master Bedtime Volume</span>
              <span className="text-amber-300">{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Ready-made Presets */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Ready-Made Calming Blends:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "rainy_night", label: "Cozy Rainy Night", icon: "🌧️" },
              { id: "deep_slumber", label: "Deep Ocean Tide", icon: "🌊" },
              { id: "womb_comfort", label: "Womb Heartbeat", icon: "💓" },
              { id: "starry_nursery", label: "Starry Lullaby", icon: "🎶" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applySoundPreset(preset.id as any)}
                className="py-2.5 px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-amber-400/40 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Sound Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {soundTracks.map((track) => {
          const isPlaying = track.isPlaying;
          return (
            <div
              key={track.id}
              className={`p-5 rounded-3xl border transition-all ${
                isPlaying
                  ? "bg-slate-900/95 border-amber-400/90 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition ${
                      isPlaying
                        ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {getIcon(track.iconName)}
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white text-base">
                      {track.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {track.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSoundTrack(track.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isPlaying
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {isPlaying ? "Playing" : "Play"}
                </button>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {track.description}
              </p>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                  <span>Track Volume</span>
                  <span className="text-amber-300 font-semibold">{Math.round(track.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => setSoundTrackVolume(track.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
