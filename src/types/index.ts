export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  favoriteAnimal: string;
  favoriteTheme: string;
  avatarColor: string;
  avatarEmoji: string;
  preferredLanguage: string;
  createdAt: number;
}

export interface StoryPage {
  pageNumber: number;
  title?: string;
  text: string;
  sceneDescription: string;
  calmAction?: string;
}

export interface BedtimeStory {
  id: string;
  title: string;
  subtitle?: string;
  childName: string;
  age: number;
  favoriteAnimal: string;
  theme: string;
  estimatedReadMinutes: number;
  recommendedSound: string;
  closingAffirmation: string;
  pages: StoryPage[];
  isCustomGenerated?: boolean;
  isFavorite?: boolean;
  createdAt: number;
  motherVoiceClipId?: string;
}

export interface NurseryRhyme {
  id: string;
  title: string;
  routineCategory: string; // "brush_teeth" | "tidy_toys" | "bathtime" | "pajamas" | "sweet_dreams" | "classic"
  stanzas: {
    stanzaNumber: number;
    lines: string[];
    parentActionTip?: string;
  }[];
  closingNote?: string;
  isCustomGenerated?: boolean;
  isFavorite?: boolean;
}

export interface SoundTrackConfig {
  id: string;
  name: string;
  category: "ambient" | "music" | "nature" | "womb";
  iconName: string;
  description: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export interface VoiceRecording {
  id: string;
  title: string;
  category: "greeting" | "story_intro" | "lullaby_whisper" | "goodnight_blessing";
  audioDataUrl: string; // base64 or blob URL
  durationSeconds: number;
  createdAt: number;
}

export interface RoutineStep {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  durationMinutes: number;
  contentType: "rhyme" | "story" | "music" | "quiet_snuggle" | "bath";
  contentId?: string;
  completed?: boolean;
}

export interface BedtimeRoutine {
  id: string;
  title: string;
  childId: string;
  steps: RoutineStep[];
  autoFadeTimerMinutes: number;
}
