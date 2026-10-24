import React, { useState } from "react";
import {
  Bookmark,
  Heart,
  Volume2,
  BookOpen,
  WifiOff,
  Sparkles,
  Music,
  Trash2,
  Clock,
  Mic,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const OfflineLibrary: React.FC<{ onOpenMotherVoiceModal: () => void }> = ({
  onOpenMotherVoiceModal,
}) => {
  const {
    stories,
    rhymes,
    voiceRecordings,
    openStory,
    toggleStoryFavorite,
    deleteStory,
    activeProfile,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"stories" | "rhymes" | "voice">("stories");

  const favoriteStories = stories.filter((s) => s.isFavorite);
  const favoriteRhymes = rhymes.filter((r) => r.isFavorite);

  return (
    <div className="space-y-6">
      {/* Offline Status Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/40 via-indigo-950/30 to-slate-900 border border-teal-400/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-1">
              <WifiOff className="w-3.5 h-3.5" />
              Offline & Travel Ready
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">
              Family Bedtime Library
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Saved stories, rhymes, and mother's voice recordings remain stored directly on this device for zero-data airplane mode or travel.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{stories.length + rhymes.length + voiceRecordings.length} Items Offline Ready</span>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab("stories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            activeSubTab === "stories"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Saved Stories ({stories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("rhymes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            activeSubTab === "rhymes"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Nursery Rhymes ({rhymes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("voice")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            activeSubTab === "voice"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Mama's Voice ({voiceRecordings.length})</span>
        </button>
      </div>

      {/* Stories Tab */}
      {activeSubTab === "stories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => openStory(story)}
              className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/50 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {story.childName} • {story.age} yrs
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStoryFavorite(story.id);
                    }}
                    className={`p-1.5 rounded-xl ${
                      story.isFavorite ? "text-rose-400" : "text-slate-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${story.isFavorite ? "fill-rose-400" : ""}`} />
                  </button>
                </div>

                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 italic mb-3">
                  "{story.subtitle || story.closingAffirmation}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  ~{story.estimatedReadMinutes}m read
                </span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  Read Offline →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rhymes Tab */}
      {activeSubTab === "rhymes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rhymes.map((rhyme) => (
            <div
              key={rhyme.id}
              className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-400/10 px-2.5 py-0.5 rounded-full">
                  {rhyme.routineCategory.replace("_", " ")}
                </span>
                <Heart className={`w-4 h-4 ${rhyme.isFavorite ? "fill-rose-400 text-rose-400" : "text-slate-600"}`} />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">{rhyme.title}</h3>
              <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-3">
                {rhyme.stanzas[0]?.lines.join(" • ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Voice Clips Tab */}
      {activeSubTab === "voice" && (
        <div>
          {voiceRecordings.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-700/60 text-center">
              <Mic className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                You haven't recorded any voice greetings yet. Record a short clip so your child can hear your comforting voice anytime.
              </p>
              <button
                onClick={onOpenMotherVoiceModal}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Record Mother's Voice Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voiceRecordings.map((clip) => (
                <div
                  key={clip.id}
                  className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-rose-500/30" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-white text-sm">
                        {clip.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {clip.category.replace("_", " ")} • {clip.durationSeconds}s
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenMotherVoiceModal}
                    className="text-xs text-amber-300 hover:underline"
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
