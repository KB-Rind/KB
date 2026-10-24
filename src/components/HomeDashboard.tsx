import React from "react";
import {
  Moon,
  Sparkles,
  Play,
  Heart,
  Volume2,
  BookOpen,
  Music,
  Timer,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sun,
  Smile,
  Mic,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface HomeDashboardProps {
  onOpenTimerModal: () => void;
  onOpenMotherVoiceModal: () => void;
  onOpenProfileModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onOpenTimerModal,
  onOpenMotherVoiceModal,
  onOpenProfileModal,
}) => {
  const {
    activeProfile,
    stories,
    rhymes,
    openStory,
    toggleSleepyMode,
    startTimer,
    isTimerActive,
    remainingSeconds,
    applySoundPreset,
    activeSoundsCount,
    setActiveTab,
    voiceRecordings,
  } = useApp();

  const featuredStory = stories[0];
  const featuredRhyme = rhymes[0];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Hero Nighttime Ritual Card */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-indigo-950 via-[#0d1630] to-slate-950 border border-amber-400/25 p-6 sm:p-10 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <span>{activeProfile.avatarEmoji}</span>
              <span>Bedtime Ritual for {activeProfile.name} ({activeProfile.age} yrs)</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Cozy stories. <br className="hidden sm:inline" />
              <span className="text-amber-300 font-serif italic">Calm nights.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              One safe, parent-controlled bedtime companion. Gentle personalized stories, nursery rhymes, maternal voice whispers, and calming sleep sounds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => toggleSleepyMode(true)}
                className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition flex items-center gap-2.5"
              >
                <Moon className="w-4 h-4 fill-slate-950" />
                <span>Enter Sleepy Mode</span>
              </button>

              <button
                onClick={() => setActiveTab("routine")}
                className="py-3.5 px-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start Bedtime Routine</span>
              </button>
            </div>
          </div>

          {/* Quick Sound & Timer Widget Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md md:w-72 shrink-0 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                Sleep Timer
              </span>
              <button
                onClick={onOpenTimerModal}
                className="text-[11px] text-slate-400 hover:text-amber-300 underline"
              >
                Change
              </button>
            </div>

            <div className="text-center py-1">
              <div className="text-3xl font-heading font-bold text-white">
                {isTimerActive ? formatTimer(remainingSeconds) : "Off"}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isTimerActive ? "Fading out gently at end" : "Choose timer below"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[15, 30, 45].map((m) => (
                <button
                  key={m}
                  onClick={() => startTimer(m)}
                  className="py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition"
                >
                  {m}m
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                1-Tap Calming Audio:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => applySoundPreset("rainy_night")}
                  className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium text-left flex items-center gap-1.5 transition"
                >
                  <span>🌧️</span>
                  <span>Rain</span>
                </button>
                <button
                  onClick={() => applySoundPreset("starry_nursery")}
                  className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium text-left flex items-center gap-1.5 transition"
                >
                  <span>🎶</span>
                  <span>Lullaby</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Bedtime Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: AI Stories */}
        <div
          onClick={() => setActiveTab("stories")}
          className="group p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/50 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              📖
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-300 transition">
              AI Bedtime Stories
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Personalized adventures featuring {activeProfile.name} and favorite {activeProfile.favoriteAnimal}, designed to wind down gently.
            </p>
          </div>
          <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-amber-300 gap-1">
            <span>Explore Stories</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Pillar 2: Nursery Rhymes */}
        <div
          onClick={() => setActiveTab("rhymes")}
          className="group p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-400/50 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              🎶
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-300 transition">
              Nursery Rhyme Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Sing-along rhymes supporting brushing teeth, tidying up toys, bath time, and classic cradle lullabies.
            </p>
          </div>
          <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-purple-300 gap-1">
            <span>Sing Rhymes</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Pillar 3: Sleep Sounds Mixer */}
        <div
          onClick={() => setActiveTab("sounds")}
          className="group p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-400/50 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              🌧️
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-blue-300 transition">
              Sleep Sounds Mixer
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Multi-channel procedural audio: gentle rain, ocean tides, music box melodies, pink noise, and womb heartbeat.
            </p>
          </div>
          <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-blue-300 gap-1">
            <span>Blend Audio</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Pillar 4: Mother's Voice */}
        <div
          onClick={onOpenMotherVoiceModal}
          className="group p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-400/50 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              🎙️
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-rose-300 transition">
              Mother's Voice Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Record a warm, familiar bedtime greeting or blessing to comfort your child even when you are resting or away.
            </p>
          </div>
          <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-rose-300 gap-1">
            <span>Record Voice</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Featured Story & Featured Rhyme Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tonight's Featured Story */}
        {featuredStory && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-indigo-950/40 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Tonight's Featured Story
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{featuredStory.estimatedReadMinutes} min read
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white mb-1">
                {featuredStory.title}
              </h3>
              <p className="text-xs text-slate-300 italic mb-4 font-serif">
                "{featuredStory.subtitle || featuredStory.pages[0]?.text.slice(0, 90) + "..."}"
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                <span className="text-2xl">🐰</span>
                <div>
                  <span className="font-semibold text-amber-300 block">
                    Designed for {activeProfile.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Gentle narrative rhythm that leads to slow deep breaths.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => openStory(featuredStory)}
                className="py-2.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition"
              >
                <BookOpen className="w-4 h-4" />
                Read Tonight's Story
              </button>

              <button
                onClick={() => setActiveTab("stories")}
                className="text-xs text-slate-400 hover:text-amber-300 transition"
              >
                Browse All Stories →
              </button>
            </div>
          </div>
        )}

        {/* Featured Rhyme */}
        {featuredRhyme && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-purple-950/30 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20">
                  Featured Bedtime Rhyme
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {featuredRhyme.routineCategory.replace("_", " ")}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {featuredRhyme.title}
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs font-serif text-slate-200 leading-relaxed mb-2">
                {featuredRhyme.stanzas[0]?.lines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {featuredRhyme.closingNote && (
                <p className="text-[11px] text-slate-400 italic">
                  Tip: {featuredRhyme.closingNote}
                </p>
              )}
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setActiveTab("rhymes")}
                className="py-2.5 px-5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-heading font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition"
              >
                <Music className="w-4 h-4" />
                Open Rhyme Studio
              </button>

              <button
                onClick={() => setActiveTab("routine")}
                className="text-xs text-slate-400 hover:text-purple-300 transition"
              >
                View Routine Flow →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety & Trust Promise Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-white text-sm">
            Safety, Privacy & Calming Sleep Architecture
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Parent-controlled PIN gate • No advertising • Child-friendly soothing AI filters • All sound synthesis runs privately on-device.
          </p>
        </div>
        <button
          onClick={onOpenProfileModal}
          className="text-xs text-amber-300 hover:underline font-semibold shrink-0"
        >
          Manage Family Profiles →
        </button>
      </div>

    </div>
  );
};
