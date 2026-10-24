import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Music,
  BookOpen,
  Moon,
  Volume2,
  ChevronRight,
  Smile,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { RoutineStep } from "../types";

export const BedtimeRoutineBuilder: React.FC<{ onOpenTimerModal: () => void }> = ({
  onOpenTimerModal,
}) => {
  const {
    activeProfile,
    stories,
    rhymes,
    openStory,
    startTimer,
    toggleSoundTrack,
    applySoundPreset,
    toggleSleepyMode,
  } = useApp();

  const [steps, setSteps] = useState<RoutineStep[]>([
    {
      id: "step-1",
      title: "Warm Bath & Gentle Splash",
      subtitle: "Unwind tired muscles with warm water and soft lavender bubbles",
      icon: "🛁",
      durationMinutes: 10,
      contentType: "bath",
      completed: false,
    },
    {
      id: "step-2",
      title: "The Toothbrush Star Song",
      subtitle: "Brush away the sleepy sugar while reciting our bedtime rhyme",
      icon: "🪥",
      durationMinutes: 3,
      contentType: "rhyme",
      completed: false,
    },
    {
      id: "step-3",
      title: "Pajamas & Snuggle In",
      subtitle: "Tuck in with blankets, cozy pillows, and favorite plush toy",
      icon: "🧸",
      durationMinutes: 4,
      contentType: "quiet_snuggle",
      completed: false,
    },
    {
      id: "step-4",
      title: `Bedtime Story for ${activeProfile.name}`,
      subtitle: "Read a calming personalized story that winds down into slumber",
      icon: "📖",
      durationMinutes: 5,
      contentType: "story",
      completed: false,
    },
    {
      id: "step-5",
      title: "Lullaby & Ambient Sleep Sounds",
      subtitle: "Music box melody + gentle rain with automatic 30-min fade-out",
      icon: "🌙",
      durationMinutes: 20,
      contentType: "music",
      completed: false,
    },
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const handleToggleStepComplete = (idx: number) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === idx ? { ...step, completed: !step.completed } : step))
    );
  };

  const handleStartRoutine = () => {
    setActiveStepIndex(0);
  };

  const handleNextStep = () => {
    if (activeStepIndex === null) return;
    // Mark current completed
    handleToggleStepComplete(activeStepIndex);
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      setActiveStepIndex(null);
    }
  };

  const handleResetRoutine = () => {
    setSteps((prev) => prev.map((s) => ({ ...s, completed: false })));
    setActiveStepIndex(null);
  };

  const handleTriggerStepAction = (step: RoutineStep) => {
    if (step.contentType === "story") {
      const storyToRead = stories[0];
      if (storyToRead) openStory(storyToRead);
    } else if (step.contentType === "music") {
      applySoundPreset("starry_nursery");
      startTimer(20);
      toggleSleepyMode(true);
    }
  };

  const currentActiveStep = activeStepIndex !== null ? steps[activeStepIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-900 border border-emerald-400/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Nightly Routine Builder
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">
              Predictable Bedtime Ritual for {activeProfile.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Children thrive on gentle repetition. A 5-step flow takes the stress out of bedtime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartRoutine}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Start Bedtime Flow
            </button>
            <button
              onClick={handleResetRoutine}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset Routine"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Routine Active Step Highlight Modal / Banner */}
      {currentActiveStep && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-indigo-950/50 border border-amber-400/60 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              Now in Progress • Step {activeStepIndex! + 1} of {steps.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ~{currentActiveStep.durationMinutes} min
            </span>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-amber-400/30 flex items-center justify-center text-3xl shadow-md shrink-0">
              {currentActiveStep.icon}
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white">
                {currentActiveStep.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentActiveStep.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentActiveStep.contentType === "story" && (
              <button
                onClick={() => handleTriggerStepAction(currentActiveStep)}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <BookOpen className="w-4 h-4" />
                Open Storybook
              </button>
            )}

            {currentActiveStep.contentType === "music" && (
              <button
                onClick={() => handleTriggerStepAction(currentActiveStep)}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Moon className="w-4 h-4" />
                Start Lullaby & Sleepy Mode
              </button>
            )}

            <button
              onClick={handleNextStep}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition ml-auto"
            >
              <span>Done with this step</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* Routine Steps List */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isCurrent = activeStepIndex === idx;
          return (
            <div
              key={step.id}
              onClick={() => handleToggleStepComplete(idx)}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
                step.completed
                  ? "bg-slate-900/40 border-slate-800/60 opacity-60"
                  : isCurrent
                  ? "bg-slate-800/90 border-amber-400 ring-1 ring-amber-400/40 shadow-lg shadow-amber-500/10"
                  : "bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStepComplete(idx);
                  }}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                    step.completed
                      ? "bg-emerald-500 text-slate-950"
                      : "border-2 border-slate-600 hover:border-amber-400"
                  }`}
                >
                  {step.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="text-2xl">{step.icon}</div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-heading font-semibold text-base ${
                        step.completed ? "line-through text-slate-500" : "text-white"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.durationMinutes}m
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{step.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStepIndex(idx);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Focus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
