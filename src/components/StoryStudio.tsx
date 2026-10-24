import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Heart,
  Plus,
  Play,
  Clock,
  Music,
  RotateCcw,
  Volume2,
  Trash2,
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { BedtimeStory } from "../types";

const THEME_PRESETS = [
  "A sleepy little bear and the silver moon",
  "A kind bunny's soft cloud adventure",
  "A magical journey through the stars",
  "The quiet forest animals snuggling in",
  "A warm story about family love and safety",
  "The starlight train floating to dreamland",
  "A sleepy puppy counting glowing fireflies",
  "Drifting softly on a warm summer raindrop",
];

const ANIMAL_OPTIONS = [
  "Bunny",
  "Bear Cub",
  "Kitten",
  "Puppy",
  "Little Owl",
  "Fawn",
  "Baby Elephant",
  "Friendly Dinosaur",
  "Fox",
  "Koala",
];

export const StoryStudio: React.FC = () => {
  const {
    stories,
    activeProfile,
    addStory,
    toggleStoryFavorite,
    deleteStory,
    openStory,
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "favorites" | "for_child">("all");

  // Form states
  const [childName, setChildName] = useState(activeProfile.name);
  const [age, setAge] = useState(activeProfile.age);
  const [favoriteAnimal, setFavoriteAnimal] = useState(activeProfile.favoriteAnimal);
  const [theme, setTheme] = useState(THEME_PRESETS[0]);
  const [tone, setTone] = useState("gentle, rhythmic, and sleepy");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync with active profile when creator opens
  const handleOpenCreator = () => {
    setChildName(activeProfile.name);
    setAge(activeProfile.age);
    setFavoriteAnimal(activeProfile.favoriteAnimal);
    setShowCreator(true);
    setErrorMsg(null);
  };

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: childName.trim() || activeProfile.name,
          age: Number(age),
          favoriteAnimal: favoriteAnimal.trim() || "Bunny",
          theme: theme.trim() || "A sleepy bedtime journey",
          tone,
          additionalDetails: additionalDetails.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.story) {
        throw new Error(data.error || "Failed to generate story");
      }

      const generated = data.story;
      const newStory: BedtimeStory = {
        id: "story-" + Date.now(),
        title: generated.title || `Goodnight, ${childName}`,
        subtitle: generated.subtitle || "A gentle journey into sweet dreams",
        childName: childName.trim(),
        age: Number(age),
        favoriteAnimal: favoriteAnimal.trim(),
        theme,
        estimatedReadMinutes: generated.estimatedReadMinutes || 4,
        recommendedSound: generated.recommendedSound || "lullaby",
        closingAffirmation:
          generated.closingAffirmation ||
          `Goodnight ${childName}, you are safe, cherished, and loved.`,
        pages: generated.pages || [],
        isCustomGenerated: true,
        isFavorite: true,
        createdAt: Date.now(),
      };

      addStory(newStory);
      setShowCreator(false);
      openStory(newStory);
    } catch (err: any) {
      console.error("Story generation failed:", err);
      setErrorMsg(err?.message || "Could not generate story right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredStories = stories.filter((story) => {
    if (filterMode === "favorites") return story.isFavorite;
    if (filterMode === "for_child") {
      return (
        story.childName.toLowerCase() === activeProfile.name.toLowerCase() ||
        story.age === activeProfile.age
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-950/40 to-slate-900 border border-amber-400/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Bedtime Story Studio
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Personalized Stories for {activeProfile.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Calming, age-appropriate bedtime tales ending with drifting peacefully to sleep.
          </p>
        </div>

        <button
          onClick={handleOpenCreator}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          Create New Bedtime Story
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterMode === "all"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Stories ({stories.length})
          </button>
          <button
            onClick={() => setFilterMode("for_child")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterMode === "for_child"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            For {activeProfile.name}
          </button>
          <button
            onClick={() => setFilterMode("favorites")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterMode === "favorites"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Favorites ({stories.filter((s) => s.isFavorite).length})
          </button>
        </div>
      </div>

      {/* Story Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.map((story) => {
          return (
            <div
              key={story.id}
              onClick={() => openStory(story)}
              className="group relative flex flex-col justify-between p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-400/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-amber-500/5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌙</span>
                    <span className="text-[11px] font-semibold text-amber-300/90 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                      {story.childName} • {story.age} yrs
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStoryFavorite(story.id);
                    }}
                    className={`p-1.5 rounded-xl transition ${
                      story.isFavorite
                        ? "text-rose-400 bg-rose-500/10"
                        : "text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${story.isFavorite ? "fill-rose-400" : ""}`} />
                  </button>
                </div>

                <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-300 transition leading-snug mb-1">
                  {story.title}
                </h3>
                {story.subtitle && (
                  <p className="text-xs text-slate-400 line-clamp-2 italic mb-3">
                    "{story.subtitle}"
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {story.estimatedReadMinutes}m
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <Music className="w-3.5 h-3.5 text-slate-500" />
                    {story.recommendedSound}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-300 font-semibold group-hover:translate-x-1 transition">
                  <span>Read</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Story Creator Modal */}
      {showCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowCreator(false)}
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
                <h3 className="font-heading text-xl font-bold text-white">Create AI Bedtime Story</h3>
                <p className="text-xs text-slate-400">Tailored to your child's favorite things</p>
              </div>
            </div>

            <form onSubmit={handleGenerateStory} className="space-y-4">
              {/* Name & Age Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Age ({age} yrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Animal picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Favorite Animal / Character
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {ANIMAL_OPTIONS.map((anim) => (
                    <button
                      key={anim}
                      type="button"
                      onClick={() => setFavoriteAnimal(anim)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                        favoriteAnimal === anim
                          ? "bg-amber-400 text-slate-950 font-semibold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={favoriteAnimal}
                  onChange={(e) => setFavoriteAnimal(e.target.value)}
                  placeholder="Or enter custom animal..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Theme chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bedtime Theme
                </label>
                <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto no-scrollbar">
                  {THEME_PRESETS.map((t) => (
                    <div
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer border transition flex items-center justify-between ${
                        theme === t
                          ? "bg-amber-500/20 border-amber-400 text-amber-200"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span>{t}</span>
                      {theme === t && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Or enter custom bedtime adventure..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Special Personal Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Special Comforts (Optional)
                </label>
                <input
                  type="text"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="e.g. loves her yellow blanket, counting to three, snuggling teddy"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
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
                  onClick={() => setShowCreator(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Weaving Bedtime Magic...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Generate Story</span>
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
