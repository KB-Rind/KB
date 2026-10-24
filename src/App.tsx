/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { StarrySky } from "./components/StarrySky";
import { Navbar } from "./components/Navbar";
import { HomeDashboard } from "./components/HomeDashboard";
import { StoryStudio } from "./components/StoryStudio";
import { NurseryRhymeStudio } from "./components/NurseryRhymeStudio";
import { SoundMixer } from "./components/SoundMixer";
import { BedtimeRoutineBuilder } from "./components/BedtimeRoutineBuilder";
import { OfflineLibrary } from "./components/OfflineLibrary";
import { StoryReaderModal } from "./components/StoryReaderModal";
import { SleepyModeView } from "./components/SleepyModeView";
import { ChildProfileModal } from "./components/ChildProfileModal";
import { SleepTimerModal } from "./components/SleepTimerModal";
import { MothersVoiceModal } from "./components/MothersVoiceModal";
import { ParentGateModal } from "./components/ParentGateModal";

function MainContent() {
  const { activeTab, currentReadingStory, closeStory } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isMotherVoiceModalOpen, setIsMotherVoiceModalOpen] = useState(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [parentGateAction, setParentGateAction] = useState<(() => void) | null>(null);

  const handleOpenParentGate = (action: () => void) => {
    setParentGateAction(() => action);
    setIsParentGateOpen(true);
  };

  const handleParentGateSuccess = () => {
    if (parentGateAction) {
      parentGateAction();
      setParentGateAction(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200">
      {/* Background Starry Sky */}
      <StarrySky />

      {/* Main Navigation Bar */}
      <Navbar
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        onOpenParentGate={handleOpenParentGate}
        onOpenMotherVoiceModal={() => setIsMotherVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {activeTab === "home" && (
          <HomeDashboard
            onOpenTimerModal={() => setIsTimerModalOpen(true)}
            onOpenMotherVoiceModal={() => setIsMotherVoiceModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === "stories" && <StoryStudio />}

        {activeTab === "rhymes" && <NurseryRhymeStudio />}

        {activeTab === "sounds" && (
          <SoundMixer onOpenTimerModal={() => setIsTimerModalOpen(true)} />
        )}

        {activeTab === "routine" && (
          <BedtimeRoutineBuilder onOpenTimerModal={() => setIsTimerModalOpen(true)} />
        )}

        {activeTab === "library" && (
          <OfflineLibrary
            onOpenMotherVoiceModal={() => setIsMotherVoiceModalOpen(true)}
          />
        )}
      </main>

      {/* Subtle Nighttime Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400 font-medium">Cozimo • Cozy stories. Calm nights.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => handleOpenParentGate(() => setIsMotherVoiceModalOpen(true))}
              className="hover:text-amber-300 transition"
            >
              Mother's Voice Studio
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTimerModalOpen(true)}
              className="hover:text-amber-300 transition"
            >
              Sleep Timer
            </button>
            <span>•</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-amber-300 transition"
            >
              Child Profiles
            </button>
          </div>

          <p className="text-slate-600 text-[11px]">
            Designed with child sleep psychology & parental ease.
          </p>
        </div>
      </footer>

      {/* Full-Screen Sleepy Mode View */}
      <SleepyModeView />

      {/* Interactive Story Reader Modal */}
      {currentReadingStory && (
        <StoryReaderModal story={currentReadingStory} onClose={closeStory} />
      )}

      {/* Modals */}
      <ChildProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenParentGate={handleOpenParentGate}
      />

      <SleepTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />

      <MothersVoiceModal
        isOpen={isMotherVoiceModalOpen}
        onClose={() => setIsMotherVoiceModalOpen(false)}
      />

      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => {
          setIsParentGateOpen(false);
          setParentGateAction(null);
        }}
        onSuccess={handleParentGateSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
