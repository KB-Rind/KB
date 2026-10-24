import React, { useState, useEffect } from "react";
import { Lock, X, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Grown-Ups Only",
  description = "Please solve this quick challenge to access parent settings.",
}) => {
  const { verifyParentPin } = useApp();
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(7);
  const [userAnswer, setUserAnswer] = useState("");
  const [pinMode, setPinMode] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNum1(Math.floor(Math.random() * 8) + 4);
      setNum2(Math.floor(Math.random() * 9) + 5);
      setUserAnswer("");
      setPinInput("");
      setErrorMsg("");
      setPinMode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = num1 + num2;
    if (parseInt(userAnswer.trim(), 10) === sum) {
      setErrorMsg("");
      onSuccess();
      onClose();
    } else {
      setErrorMsg("That wasn't quite right. Please try again.");
      setUserAnswer("");
      setNum1(Math.floor(Math.random() * 8) + 4);
      setNum2(Math.floor(Math.random() * 9) + 5);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyParentPin(pinInput)) {
      setErrorMsg("");
      onSuccess();
      onClose();
    } else {
      setErrorMsg("Incorrect PIN. Please try again.");
      setPinInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/60 p-6 text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400">Child-safe security gate</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">{description}</p>

        {!pinMode ? (
          <form onSubmit={handleMathSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Parent Challenge
              </span>
              <div className="text-2xl font-bold font-heading text-amber-300 tracking-wide">
                What is {num1} + {num2}?
              </div>
            </div>

            <div>
              <input
                type="number"
                inputMode="numeric"
                autoFocus
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer"
                className="w-full text-center text-xl font-bold tracking-widest px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {errorMsg && <p className="text-xs text-rose-400 text-center">{errorMsg}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                Unlock
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setPinMode(true)}
                className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-2 transition"
              >
                Or enter Parental 4-digit PIN
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Enter 4-Digit PIN
              </span>
              <p className="text-xs text-slate-400">(Default is 1234)</p>
            </div>

            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-2xl font-bold tracking-[0.5em] px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {errorMsg && <p className="text-xs text-rose-400 text-center">{errorMsg}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                Verify PIN
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setPinMode(false)}
                className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-2 transition"
              >
                Back to math challenge
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
