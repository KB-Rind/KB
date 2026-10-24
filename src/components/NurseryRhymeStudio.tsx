import React, { useState } from "react";
import {
  Sparkles,
  Music,
  Heart,
  Volume2,
  Square,
  Plus,
  Loader2,
  CheckCircle2,
  Smile,
  Lightbulb,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { NurseryRhyme } from "../types";
import { speechService } from "../services/speechService";

const ROUTINE_CATEGORIES = [
  { id: "all", label: "All Rhymes", emoji: "✨" },
  { id: "brush_teeth", label: "Brushing Teeth", emoji: "🪥" },
  { id: "tidy_toys", label: "Tidying Toys", emoji: "🧸" },
  { id: "pajamas", label: "Pajamas & Snuggle", emoji: "👕" },
  { id: "bathtime", label: "Bathtime Fun", emoji: "🛁" },
  { id: "classic", label: "Classic Lullabies", emoji: "⭐" },
];

export const NurseryRhymeStudio: React.FC = () => {
  const { rhymes, activeProfile, addRhyme, toggleRhymeFavorite } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [playingRhymeId, setPlayingRhymeId] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator state
  const [routineType, setRoutineType] = useState("brush_teeth");
  const [customTopic, setCustomTopic] = useState("Brush teeth gently and look at the stars");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePlayRhyme = (rhyme: NurseryRhyme) => {
    if (playingRhymeId === rhyme.id) {
      speechService.stop();
      setPlayingRhymeId(null);
      return;
    }

    const fullText = rhyme.stanzas
      .map((s) => s.lines.join(". "))
      .join(". ") + `. ${rhyme.closingNote || ""}`;

    setPlayingRhymeId(rhyme.id);
    speechService.speakText(fullText, {
      rate: 0.82,
      onEnd: () => setPlayingRhymeId(null),
      onError: () => setPlayingRhymeId(null),
    });
  };

  const handleGenerateRhyme = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-rhyme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: activeProfile.name,
          routineType,
          customTopic: customTopic.trim() || "Bedtime routine countdown",
          tone: "gentle, sing-song, and calm",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.rhyme) {
        throw new Error(data.error || "Failed to generate nursery rhyme");
      }

      const generated = data.rhyme;
      const newRhyme: NurseryRhyme = {
        id: "rhyme-" + Date.now(),
        title: generated.title || `The Bedtime Song for ${activeProfile.name}`,
        routineCategory: routineType,
        stanzas: generated.stanzas || [],
        closingNote: generated.closingNote || "Sleep tight under the twinkling moon.",
        isCustomGenerated: true,
        isFavorite: true,
      };

      addRhyme(newRhyme);
      setShowGenerator(false);
      handlePlayRhyme(newRhyme);
    } catch (err: any) {
      console.error("Rhyme error:", err);
      setErrorMsg(err?.message || "Could not generate rhyme. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRhymes = rhymes.filter((r) => {
    if (activeCategory === "all") return true;
    return r.routineCategory === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-400/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
            <Music className="w-3.5 h-3.5" />
            Nursery Rhyme Studio
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Daily Routine Rhymes & Lullabies
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Gentle rhymes to make brushing teeth, picking up toys, and winding down enjoyable and predictable.
          </p>
        </div>

        <button
          onClick={() => setShowGenerator(true)}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          Create Routine Rhyme
        </button>
      </div>

      {/* Routine Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {ROUTINE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition border ${
              activeCategory === cat.id
                ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Rhyme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRhymes.map((rhyme) => {
          const isPlaying = playingRhymeId === rhyme.id;
          return (
            <div
              key={rhyme.id}
              className={`p-6 rounded-3xl border transition-all ${
                isPlaying
                  ? "bg-slate-900/90 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/40"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700/60 inline-block mb-1.5 capitalize">
                    {rhyme.routineCategory.replace("_", " ")}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {rhyme.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleRhymeFavorite(rhyme.id)}
                    className={`p-2 rounded-xl transition ${
                      rhyme.isFavorite
                        ? "text-rose-400 bg-rose-500/10"
                        : "text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${rhyme.isFavorite ? "fill-rose-400" : ""}`} />
                  </button>

                  <button
                    onClick={() => handlePlayRhyme(rhyme)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isPlaying
                        ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Chant</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stanzas */}
              <div className="space-y-4 my-4 font-serif text-slate-200 text-base leading-relaxed pl-2 border-l-2 border-amber-400/30">
                {rhyme.stanzas.map((stanza) => (
                  <div key={stanza.stanzaNumber} className="space-y-1">
                    {stanza.lines.map((line, lIdx) => (
                      <p key={lIdx} className="tracking-wide">
                        {line}
                      </p>
                    ))}
                    {stanza.parentActionTip && (
                      <div className="mt-2 text-xs font-sans text-amber-300/80 bg-amber-400/10 rounded-xl p-2 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                        <span>Parent tip: {stanza.parentActionTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {rhyme.closingNote && (
                <div className="text-xs text-slate-400 italic pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                  <span>🌙</span>
                  <span>{rhyme.closingNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Routine Rhyme Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowGenerator(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">Create Routine Rhyme</h3>
                <p className="text-xs text-slate-400">Customized for {activeProfile.name}'s evening</p>
              </div>
            </div>

            <form onSubmit={handleGenerateRhyme} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Routine Focus
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "brush_teeth", label: "Brushing Teeth", emoji: "🪥" },
                    { id: "tidy_toys", label: "Tidying Toys", emoji: "🧸" },
                    { id: "pajamas", label: "Putting on Pajamas", emoji: "👕" },
                    { id: "bathtime", label: "Bathtime Splashes", emoji: "🛁" },
                    { id: "sweet_dreams", label: "Quiet Snuggle", emoji: "🌙" },
                    { id: "custom", label: "Custom Habit", emoji: "💡" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRoutineType(item.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition ${
                        routineType === item.id
                          ? "bg-amber-400/20 border-amber-400 text-amber-300 font-semibold"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic / Goal
                </label>
                <input
                  type="text"
                  required
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Brush back molars, put blocks away, say goodnight to puppy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setShowGenerator(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Writing Rhyme...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Compose Rhyme</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
