import React, { useState, useRef } from "react";
import { X, Mic, Square, Play, Pause, Trash2, Heart, Sparkles, Volume2, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { speechService } from "../services/speechService";
import { VoiceRecording } from "../types";

interface MothersVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MothersVoiceModal: React.FC<MothersVoiceModalProps> = ({ isOpen, onClose }) => {
  const { voiceRecordings, addVoiceRecording, deleteVoiceRecording } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<VoiceRecording["category"]>("greeting");
  const [clipTitle, setClipTitle] = useState("Mama's Goodnight Whisper");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const startRecording = async () => {
    setRecordError(null);
    setPreviewUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setPreviewUrl(base64Data);
        };
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setRecordError("Please allow microphone access in your browser to record your voice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSaveClip = () => {
    if (!previewUrl) return;

    const newClip: VoiceRecording = {
      id: "voice-" + Date.now(),
      title: clipTitle.trim() || "Mama's Cozy Voice",
      category: selectedCategory,
      audioDataUrl: previewUrl,
      durationSeconds: recordingSeconds || 5,
      createdAt: Date.now(),
    };

    addVoiceRecording(newClip);
    setPreviewUrl(null);
    setRecordingSeconds(0);
    setClipTitle("Mama's Sweet Dreams Whisper");
  };

  const handlePlayClip = async (clip: VoiceRecording) => {
    if (playingClipId === clip.id) {
      speechService.stop();
      setPlayingClipId(null);
      return;
    }

    setPlayingClipId(clip.id);
    await speechService.playMotherVoiceClip(clip.audioDataUrl, () => {
      setPlayingClipId(null);
    });
  };

  const handlePreviewPlay = () => {
    if (!previewUrl) return;
    if (playingClipId === "preview") {
      speechService.stop();
      setPlayingClipId(null);
    } else {
      setPlayingClipId("preview");
      speechService.playMotherVoiceClip(previewUrl, () => {
        setPlayingClipId(null);
      });
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={() => {
            stopRecording();
            speechService.stop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-rose-500/40" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-white">Mother's Voice Studio</h3>
            <p className="text-xs text-slate-400">Record warm, familiar bedtime whispers and greetings</p>
          </div>
        </div>

        {/* Recorder Box */}
        <div className="my-5 p-5 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-800/40 border border-slate-700/60 text-center relative overflow-hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
            {isRecording ? "Listening to Mama's Voice..." : previewUrl ? "Review Recording" : "Record New Bedtime Whisper"}
          </div>

          {/* Big mic button */}
          <div className="flex justify-center my-4">
            {!previewUrl ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-pulse scale-105"
                    : "bg-gradient-to-tr from-amber-500 to-rose-400 text-slate-950 hover:scale-105 shadow-xl shadow-amber-500/20"
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8 stroke-[2.5]" />}
                {isRecording && (
                  <span className="absolute -inset-2 rounded-full border-2 border-rose-400/50 animate-ping" />
                )}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handlePreviewPlay}
                  className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg hover:bg-amber-300 transition active:scale-95"
                >
                  {playingClipId === "preview" ? (
                    <Pause className="w-6 h-6 fill-slate-950" />
                  ) : (
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  )}
                </button>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Recording Captured!</div>
                  <div className="text-xs text-slate-400">Duration: {formatSeconds(recordingSeconds)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="text-lg font-mono font-bold text-amber-300/90 mb-2">
            {formatSeconds(recordingSeconds)}
          </div>

          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {isRecording
              ? "Speak softly and slowly into your phone or laptop. Children find comfort in your natural bedtime cadence."
              : previewUrl
              ? "Preview your clip or tap Save below to add it to your bedtime routine."
              : "Tip: Say 'Goodnight my little love, Mama loves you to the stars and back.'"}
          </p>

          {recordError && <p className="text-xs text-rose-400 mt-2">{recordError}</p>}

          {/* Form details when preview exists */}
          {previewUrl && (
            <div className="mt-4 pt-4 border-t border-slate-700/60 text-left space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Clip Title
                </label>
                <input
                  type="text"
                  value={clipTitle}
                  onChange={(e) => setClipTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bedtime Category
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "greeting", label: "Bedtime Greeting" },
                    { id: "story_intro", label: "Story Opening" },
                    { id: "lullaby_whisper", label: "Lullaby Whisper" },
                    { id: "goodnight_blessing", label: "Night Blessing" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`p-2 rounded-xl border text-center transition ${
                        selectedCategory === cat.id
                          ? "bg-amber-400/20 border-amber-400 text-amber-300"
                          : "bg-slate-900/60 border-slate-700/70 text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setRecordingSeconds(0);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Discard & Re-record
                </button>
                <button
                  type="button"
                  onClick={handleSaveClip}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-heading shadow-md transition"
                >
                  Save Clip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved clips library */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Saved Mother's Voice Library ({voiceRecordings.length})
            </h4>
          </div>

          {voiceRecordings.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center">
              <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                No voice clips saved yet. Record a warm greeting above to comfort your child even when you are resting or away.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {voiceRecordings.map((clip) => {
                const isPlaying = playingClipId === clip.id;
                return (
                  <div
                    key={clip.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handlePlayClip(clip)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                          isPlaying
                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                            : "bg-slate-700 text-amber-300 hover:bg-slate-600"
                        }`}
                      >
                        {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-amber-300 ml-0.5" />}
                      </button>
                      <div>
                        <div className="font-semibold text-xs text-white">{clip.title}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span className="capitalize">{clip.category.replace("_", " ")}</span>
                          <span>•</span>
                          <span>{clip.durationSeconds}s</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteVoiceRecording(clip.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                      title="Delete recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
