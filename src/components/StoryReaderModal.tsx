import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  Moon,
  Bookmark,
  Share2,
  RotateCcw,
  Play,
  Square,
  Music,
} from "lucide-react";
import { BedtimeStory } from "../types";
import { useApp } from "../context/AppContext";
import { speechService } from "../services/speechService";

interface StoryReaderModalProps {
  story: BedtimeStory | null;
  onClose: () => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({ story, onClose }) => {
  const {
    toggleStoryFavorite,
    voiceRecordings,
    toggleSoundTrack,
    soundTracks,
    isSleepyMode,
  } = useApp();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [selectedMotherClipId, setSelectedMotherClipId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(0);
    setIsPlayingAudio(false);
    speechService.stop();
  }, [story]);

  if (!story) return null;

  const totalPages = story.pages.length;
  const isCover = currentPage === 0;
  const isEnding = currentPage === totalPages + 1;
  const activePageData = !isCover && !isEnding ? story.pages[currentPage - 1] : null;

  const handleNext = () => {
    speechService.stop();
    setIsPlayingAudio(false);
    if (currentPage < totalPages + 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    speechService.stop();
    setIsPlayingAudio(false);
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleToggleNarration = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
      return;
    }

    let textToRead = "";
    if (isCover) {
      textToRead = `${story.title}. ${story.subtitle || ""}. Written for ${story.childName}. Let's begin.`;
    } else if (isEnding) {
      textToRead = `${story.closingAffirmation}. Sweet dreams, close your eyes, you are safe and warm.`;
    } else if (activePageData) {
      textToRead = activePageData.text;
    }

    setIsPlayingAudio(true);
    speechService.speakText(textToRead, {
      onEnd: () => {
        setIsPlayingAudio(false);
      },
      onError: () => {
        setIsPlayingAudio(false);
      },
    });
  };

  const handlePlayMotherVoice = (clipId: string) => {
    const clip = voiceRecordings.find((c) => c.id === clipId);
    if (!clip) return;
    speechService.stop();
    setIsPlayingAudio(true);
    speechService.playMotherVoiceClip(clip.audioDataUrl, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleToggleSoundBackdrop = () => {
    const recSound = story.recommendedSound || "lullaby";
    toggleSoundTrack(recSound);
  };

  const isRecommendedSoundPlaying = soundTracks.some(
    (t) => t.id === (story.recommendedSound || "lullaby") && t.isPlaying
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-2xl h-[92vh] max-h-[780px] rounded-3xl bg-slate-900/95 border border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-heading text-sm font-semibold text-slate-200 truncate max-w-[220px]">
              {story.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient sound helper */}
            <button
              onClick={handleToggleSoundBackdrop}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                isRecommendedSoundPlaying
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle background bedtime sound"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline capitalize">{story.recommendedSound || "Sound"}</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleStoryFavorite(story.id)}
              className={`p-2 rounded-xl transition ${
                story.isFavorite ? "text-rose-400 bg-rose-500/10" : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Heart className={`w-4 h-4 ${story.isFavorite ? "fill-rose-400" : ""}`} />
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                speechService.stop();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Book Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:p-10 flex flex-col justify-center items-center text-center relative">
          
          {/* Subtle starry illumination */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-slate-900/0 to-transparent pointer-events-none" />

          {/* COVER PAGE */}
          {isCover && (
            <div className="max-w-md mx-auto space-y-6 animate-fade-in">
              <div className="relative mx-auto w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400/20 to-indigo-600/30 border border-amber-300/30 flex items-center justify-center text-5xl shadow-2xl glow-moon">
                🌙
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-bounce" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-semibold mb-2">
                  Personalized for {story.childName} (Age {story.age})
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {story.title}
                </h1>
                {story.subtitle && (
                  <p className="text-sm text-slate-400 mt-2 italic font-serif">
                    "{story.subtitle}"
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-around">
                <div>
                  <span className="text-slate-400 block text-[10px]">Read Time</span>
                  <span className="font-semibold text-amber-300">~{story.estimatedReadMinutes} min</span>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Theme</span>
                  <span className="font-semibold text-slate-200 capitalize truncate max-w-[120px] block">
                    {story.favoriteAnimal}
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Ending</span>
                  <span className="font-semibold text-emerald-300">Calm & Sleep</span>
                </div>
              </div>

              {/* Mother's Voice greeting option */}
              {voiceRecordings.length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center justify-between">
                  <span className="text-rose-200 flex items-center gap-1.5 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    Play Mama's Bedtime Greeting:
                  </span>
                  <button
                    onClick={() => handlePlayMotherVoice(voiceRecordings[0].id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold transition"
                  >
                    Play
                  </button>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-heading font-bold text-base shadow-xl shadow-amber-500/25 active:scale-95 transition"
              >
                Open Bedtime Story ✨
              </button>
            </div>
          )}

          {/* STORY PAGE BEATS */}
          {activePageData && (
            <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
              {/* Scene illustration card */}
              <div className="relative mx-auto w-full max-w-sm h-40 sm:h-48 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-800 to-amber-950/40 border border-slate-700/80 p-5 flex flex-col justify-end text-left shadow-lg overflow-hidden group">
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[11px] font-semibold text-amber-300">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-amber-400/10 blur-xl" />
                <div className="relative z-10">
                  <div className="text-[11px] text-amber-300/80 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Story Scene
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 italic">
                    "{activePageData.sceneDescription}"
                  </p>
                </div>
              </div>

              {/* Story text */}
              <div className="py-2">
                <p
                  className={`text-slate-100 font-serif leading-relaxed tracking-wide text-left sm:text-center transition-all ${
                    fontSize === "sm"
                      ? "text-base sm:text-lg"
                      : fontSize === "base"
                      ? "text-lg sm:text-xl leading-8 sm:leading-9"
                      : "text-xl sm:text-2xl leading-9 sm:leading-10"
                  }`}
                >
                  {activePageData.text}
                </p>
              </div>

              {/* Calming physical cue */}
              {activePageData.calmAction && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-200/90 text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 shadow-sm">
                  <Moon className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    <strong className="text-amber-300">Gentle cue:</strong> {activePageData.calmAction}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ENDING PAGE */}
          {isEnding && (
            <div className="max-w-md mx-auto space-y-6 text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 text-indigo-300 mx-auto flex items-center justify-center text-4xl shadow-xl glow-ambient">
                ⭐
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/80">
                  Story Complete
                </span>
                <h2 className="font-heading text-2xl font-bold text-white mt-1">
                  Sweet Dreams, {story.childName}
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 text-slate-200 font-serif text-lg leading-relaxed italic shadow-inner">
                "{story.closingAffirmation}"
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Take three slow, quiet breaths. Your eyes are getting heavy. Let the soothing night sounds carry you safely into dreamland.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentPage(0)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Read Again
                </button>
                <button
                  onClick={() => {
                    speechService.stop();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs shadow-lg shadow-amber-500/20 transition"
                >
                  Close & Sleep 🌙
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer reader controls */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {/* Audio Narration button */}
          <button
            onClick={handleToggleNarration}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition ${
              isPlayingAudio
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Square className="w-3.5 h-3.5 fill-slate-950" />
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Listen Aloud</span>
              </>
            )}
          </button>

          {/* Page progress indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages + 2 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  speechService.stop();
                  setIsPlayingAudio(false);
                  setCurrentPage(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentPage === idx
                    ? "w-6 bg-amber-400"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
                aria-label={`Jump to page ${idx}`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages + 1}
              className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-bold transition shadow-md shadow-amber-500/10"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
