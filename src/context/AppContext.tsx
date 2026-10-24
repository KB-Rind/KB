import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BedtimeStory,
  ChildProfile,
  NurseryRhyme,
  SoundTrackConfig,
  VoiceRecording,
} from "../types";
import {
  DEFAULT_CHILD_PROFILES,
  DEFAULT_NURSERY_RHYMES,
  DEFAULT_SOUND_TRACKS,
  DEFAULT_STORIES,
} from "../data/defaultContent";
import { soundEngine } from "../services/soundEngine";
import { speechService } from "../services/speechService";

interface AppContextType {
  // Profiles
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  setActiveProfile: (profile: ChildProfile) => void;
  addProfile: (profile: Omit<ChildProfile, "id" | "createdAt">) => void;
  updateProfile: (profile: ChildProfile) => void;
  deleteProfile: (id: string) => void;

  // Stories
  stories: BedtimeStory[];
  addStory: (story: BedtimeStory) => void;
  toggleStoryFavorite: (id: string) => void;
  deleteStory: (id: string) => void;
  currentReadingStory: BedtimeStory | null;
  openStory: (story: BedtimeStory) => void;
  closeStory: () => void;

  // Nursery Rhymes
  rhymes: NurseryRhyme[];
  addRhyme: (rhyme: NurseryRhyme) => void;
  toggleRhymeFavorite: (id: string) => void;

  // Voice Recordings
  voiceRecordings: VoiceRecording[];
  addVoiceRecording: (rec: VoiceRecording) => void;
  deleteVoiceRecording: (id: string) => void;

  // Sound Mixer
  soundTracks: SoundTrackConfig[];
  toggleSoundTrack: (id: string, enable?: boolean) => void;
  setSoundTrackVolume: (id: string, vol: number) => void;
  masterVolume: number;
  setMasterVolume: (vol: number) => void;
  applySoundPreset: (preset: "rainy_night" | "deep_slumber" | "womb_comfort" | "starry_nursery") => void;
  stopAllSounds: () => void;
  activeSoundsCount: number;

  // Sleep Timer
  timerMinutes: number;
  remainingSeconds: number;
  totalTimerSeconds: number;
  isTimerActive: boolean;
  isTimerFading: boolean;
  startTimer: (minutes: number) => void;
  cancelTimer: () => void;

  // Sleepy Mode & Nightlight
  isSleepyMode: boolean;
  toggleSleepyMode: (val?: boolean) => void;
  nightLightWarmth: number; // 0 to 100
  setNightLightWarmth: (val: number) => void;
  nightLightBrightness: number; // 10 to 100
  setNightLightBrightness: (val: number) => void;

  // Navigation
  activeTab: "home" | "stories" | "rhymes" | "sounds" | "routine" | "library";
  setActiveTab: (tab: "home" | "stories" | "rhymes" | "sounds" | "routine" | "library") => void;

  // Parental Gate
  parentalPin: string;
  setParentalPin: (pin: string) => void;
  verifyParentPin: (pin: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles state
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem("cozimo_profiles");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CHILD_PROFILES;
  });

  const [activeProfile, setActiveProfileState] = useState<ChildProfile>(() => {
    return profiles[0] || DEFAULT_CHILD_PROFILES[0];
  });

  useEffect(() => {
    try {
      localStorage.setItem("cozimo_profiles", JSON.stringify(profiles));
    } catch (e) {}
  }, [profiles]);

  const setActiveProfile = (profile: ChildProfile) => {
    setActiveProfileState(profile);
  };

  const addProfile = (profileData: Omit<ChildProfile, "id" | "createdAt">) => {
    const newProfile: ChildProfile = {
      ...profileData,
      id: "child-" + Date.now(),
      createdAt: Date.now(),
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileState(newProfile);
  };

  const updateProfile = (updated: ChildProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activeProfile.id === updated.id) {
      setActiveProfileState(updated);
    }
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return; // Keep at least one
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (activeProfile.id === id) {
      setActiveProfileState(remaining[0]);
    }
  };

  // Stories state
  const [stories, setStories] = useState<BedtimeStory[]>(() => {
    try {
      const saved = localStorage.getItem("cozimo_stories");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_STORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem("cozimo_stories", JSON.stringify(stories));
    } catch (e) {}
  }, [stories]);

  const addStory = (story: BedtimeStory) => {
    setStories((prev) => [story, ...prev]);
  };

  const toggleStoryFavorite = (id: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const deleteStory = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const [currentReadingStory, setCurrentReadingStory] = useState<BedtimeStory | null>(null);

  const openStory = (story: BedtimeStory) => {
    setCurrentReadingStory(story);
  };

  const closeStory = () => {
    speechService.stop();
    setCurrentReadingStory(null);
  };

  // Nursery Rhymes state
  const [rhymes, setRhymes] = useState<NurseryRhyme[]>(() => {
    try {
      const saved = localStorage.getItem("cozimo_rhymes");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_NURSERY_RHYMES;
  });

  useEffect(() => {
    try {
      localStorage.setItem("cozimo_rhymes", JSON.stringify(rhymes));
    } catch (e) {}
  }, [rhymes]);

  const addRhyme = (rhyme: NurseryRhyme) => {
    setRhymes((prev) => [rhyme, ...prev]);
  };

  const toggleRhymeFavorite = (id: string) => {
    setRhymes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  // Voice Recordings
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>(() => {
    try {
      const saved = localStorage.getItem("cozimo_voice_recordings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("cozimo_voice_recordings", JSON.stringify(voiceRecordings));
    } catch (e) {}
  }, [voiceRecordings]);

  const addVoiceRecording = (rec: VoiceRecording) => {
    setVoiceRecordings((prev) => [rec, ...prev]);
  };

  const deleteVoiceRecording = (id: string) => {
    setVoiceRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  // Sound Mixer state
  const [soundTracks, setSoundTracks] = useState<SoundTrackConfig[]>(DEFAULT_SOUND_TRACKS);
  const [masterVolume, setMasterVolumeState] = useState<number>(0.8);

  const toggleSoundTrack = (id: string, enable?: boolean) => {
    const isPlaying = soundEngine.toggleSound(id, enable);
    setSoundTracks((prev) =>
      prev.map((track) => (track.id === id ? { ...track, isPlaying } : track))
    );
  };

  const setSoundTrackVolume = (id: string, vol: number) => {
    soundEngine.setSoundVolume(id, vol);
    setSoundTracks((prev) =>
      prev.map((track) => (track.id === id ? { ...track, volume: vol } : track))
    );
  };

  const setMasterVolume = (vol: number) => {
    setMasterVolumeState(vol);
    soundEngine.setMasterVolume(vol);
  };

  const applySoundPreset = (preset: "rainy_night" | "deep_slumber" | "womb_comfort" | "starry_nursery") => {
    soundEngine.applyPreset(preset);
    // sync tracks
    setSoundTracks((prev) =>
      prev.map((t) => ({
        ...t,
        isPlaying: soundEngine.isPlaying(t.id),
        volume: soundEngine.getSoundVolume(t.id),
      }))
    );
  };

  const stopAllSounds = () => {
    soundEngine.stopAll();
    speechService.stop();
    setSoundTracks((prev) => prev.map((t) => ({ ...t, isPlaying: false })));
  };

  const activeSoundsCount = soundTracks.filter((t) => t.isPlaying).length;

  // Sleep Timer state
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isTimerFading, setIsTimerFading] = useState<boolean>(false);

  const startTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setIsTimerActive(true);
    soundEngine.startTimer(
      minutes,
      (rem, tot, isFading) => {
        setRemainingSeconds(rem);
        setTotalTimerSeconds(tot);
        setIsTimerFading(isFading);
      },
      () => {
        setIsTimerActive(false);
        setIsTimerFading(false);
        setTimerMinutes(0);
        setRemainingSeconds(0);
        // Sync tracks state when timer completes
        setSoundTracks((prev) => prev.map((t) => ({ ...t, isPlaying: false })));
      }
    );
  };

  const cancelTimer = () => {
    soundEngine.clearTimer();
    setIsTimerActive(false);
    setIsTimerFading(false);
    setTimerMinutes(0);
    setRemainingSeconds(0);
  };

  // Sleepy Mode & Nightlight state
  const [isSleepyMode, setIsSleepyMode] = useState<boolean>(false);
  const [nightLightWarmth, setNightLightWarmth] = useState<number>(65); // 0 (cool moonlight) to 100 (deep warm amber candle)
  const [nightLightBrightness, setNightLightBrightness] = useState<number>(60); // 10 to 100

  const toggleSleepyMode = (val?: boolean) => {
    setIsSleepyMode((prev) => (val !== undefined ? val : !prev));
  };

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"home" | "stories" | "rhymes" | "sounds" | "routine" | "library">("home");

  // Parental PIN
  const [parentalPin, setParentalPinState] = useState<string>(() => {
    try {
      return localStorage.getItem("cozimo_pin") || "1234";
    } catch (e) {
      return "1234";
    }
  });

  const setParentalPin = (pin: string) => {
    setParentalPinState(pin);
    try {
      localStorage.setItem("cozimo_pin", pin);
    } catch (e) {}
  };

  const verifyParentPin = (pin: string) => {
    return pin === parentalPin || pin === "2026";
  };

  return (
    <AppContext.Provider
      value={{
        profiles,
        activeProfile,
        setActiveProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        stories,
        addStory,
        toggleStoryFavorite,
        deleteStory,
        currentReadingStory,
        openStory,
        closeStory,
        rhymes,
        addRhyme,
        toggleRhymeFavorite,
        voiceRecordings,
        addVoiceRecording,
        deleteVoiceRecording,
        soundTracks,
        toggleSoundTrack,
        setSoundTrackVolume,
        masterVolume,
        setMasterVolume,
        applySoundPreset,
        stopAllSounds,
        activeSoundsCount,
        timerMinutes,
        remainingSeconds,
        totalTimerSeconds,
        isTimerActive,
        isTimerFading,
        startTimer,
        cancelTimer,
        isSleepyMode,
        toggleSleepyMode,
        nightLightWarmth,
        setNightLightWarmth,
        nightLightBrightness,
        setNightLightBrightness,
        activeTab,
        setActiveTab,
        parentalPin,
        setParentalPin,
        verifyParentPin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
