import React from "react";
import { X, Moon, Timer, VolumeX, Sparkles, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMER_OPTIONS = [5, 10, 20, 30, 45, 60];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const { isTimerActive, remainingSeconds, totalTimerSeconds, timerMinutes, startTimer, cancelTimer, isTimerFading } = useApp();

  if (!isOpen) return null;

  const handleSelectTime = (mins: number) => {
    startTimer(mins);
    onClose();
  };

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-white">Smart Sleep Timer</h3>
            <p className="text-xs text-slate-400">Gentle sound fade-out for sweet dreams</p>
          </div>
        </div>

        {isTimerActive && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border border-amber-400/30 text-center">
            <div className="text-xs text-amber-300/80 font-semibold uppercase tracking-wider mb-1">
              {isTimerFading ? "Gentle Fade-Out in Progress..." : "Timer Running"}
            </div>
            <div className="text-3xl font-heading font-bold text-amber-300 tracking-wider mb-2">
              {formatRemaining(remainingSeconds)}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-1000 ${
                  isTimerFading ? "bg-amber-400 animate-pulse" : "bg-gradient-to-r from-amber-500 to-indigo-500"
                }`}
                style={{
                  width: `${totalTimerSeconds > 0 ? (remainingSeconds / totalTimerSeconds) * 100 : 0}%`,
                }}
              />
            </div>
            <button
              onClick={() => {
                cancelTimer();
                onClose();
              }}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold transition"
            >
              Turn Off Timer
            </button>
          </div>
        )}

        <div className="text-xs text-slate-300 mb-3 font-semibold">Select Bedtime Duration:</div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {TIMER_OPTIONS.map((mins) => {
            const isSelected = isTimerActive && timerMinutes === mins;
            return (
              <button
                key={mins}
                onClick={() => handleSelectTime(mins)}
                className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border text-center transition ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600"
                }`}
              >
                <span className="font-heading text-lg font-bold">{mins}</span>
                <span className="text-[11px] text-slate-400">minutes</span>
                {isSelected && <Check className="w-3.5 h-3.5 mt-1 text-amber-400" />}
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/40 text-slate-400 text-xs leading-relaxed flex items-start gap-2.5">
          <Moon className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Zero startling:</strong> Sounds will not cut off abruptly. In the last 60 seconds, volume reduces like a gentle sunset.
          </span>
        </div>
      </div>
    </div>
  );
};
