import React from "react";
import {
  Moon,
  Sparkles,
  Heart,
  Timer,
  Volume2,
  VolumeX,
  Lock,
  User,
  ChevronDown,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavbarProps {
  onOpenProfileModal: () => void;
  onOpenTimerModal: () => void;
  onOpenParentGate: (callback: () => void) => void;
  onOpenMotherVoiceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfileModal,
  onOpenTimerModal,
  onOpenParentGate,
  onOpenMotherVoiceModal,
}) => {
  const {
    activeProfile,
    isSleepyMode,
    toggleSleepyMode,
    activeSoundsCount,
    isTimerActive,
    remainingSeconds,
    isTimerFading,
    stopAllSounds,
    activeTab,
    setActiveTab,
  } = useApp();

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand */}
        <div
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-105 transition">
            <span className="text-xl">🌙</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition">
                Cozimo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Cozy stories. Calm nights.
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
          {[
            { id: "home", label: "Bedtime" },
            { id: "stories", label: "Stories" },
            { id: "rhymes", label: "Rhymes" },
            { id: "sounds", label: "Sounds" },
            { id: "routine", label: "Routine" },
            { id: "library", label: "Library" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === tab.id
                  ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Audio / Timer pill */}
          {(activeSoundsCount > 0 || isTimerActive) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              {isTimerActive && (
                <span className="font-mono text-[11px]">
                  {formatTimer(remainingSeconds)}
                </span>
              )}
              <button
                onClick={stopAllSounds}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition"
                title="Silence"
              >
                <VolumeX className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Sleepy Mode Button */}
          <button
            onClick={() => toggleSleepyMode(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-heading font-semibold text-xs shadow-md shadow-amber-500/5 active:scale-95 transition"
          >
            <Moon className="w-3.5 h-3.5 fill-amber-300" />
            <span className="hidden sm:inline">Sleepy Mode</span>
          </button>

          {/* Child Profile Switcher */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 py-1.5 pl-1.5 pr-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
          >
            <div
              className={`w-7 h-7 rounded-xl bg-gradient-to-br ${activeProfile.avatarColor} flex items-center justify-center text-sm shadow-sm`}
            >
              {activeProfile.avatarEmoji}
            </div>
            <span className="text-xs font-semibold text-white truncate max-w-[80px] hidden xs:inline">
              {activeProfile.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Parent Gate Lock */}
          <button
            onClick={() =>
              onOpenParentGate(() => {
                onOpenMotherVoiceModal();
              })
            }
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-300 transition"
            title="Parent Settings & Voice Studio"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around pt-3 mt-2 border-t border-slate-800/60 text-xs font-semibold text-slate-400">
        {[
          { id: "home", label: "Bedtime", icon: "🌙" },
          { id: "stories", label: "Stories", icon: "📖" },
          { id: "rhymes", label: "Rhymes", icon: "🎶" },
          { id: "sounds", label: "Sounds", icon: "🌧️" },
          { id: "routine", label: "Routine", icon: "✨" },
          { id: "library", label: "Library", icon: "⭐" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              activeTab === tab.id ? "text-amber-300 font-bold" : "hover:text-slate-200"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
