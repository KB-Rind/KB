import React, { useState } from "react";
import { X, Plus, Check, Trash2, Heart, Sparkles, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChildProfile } from "../types";

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenParentGate: (callback: () => void) => void;
}

const EMOJI_OPTIONS = ["🐰", "🐻", "🐱", "🐶", "🦉", "🦌", "🦊", "🦕", "🐘", "🌙", "⭐", "🐨"];
const COLOR_OPTIONS = [
  "from-pink-500 to-rose-400",
  "from-indigo-500 to-amber-400",
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-purple-500 to-violet-400",
  "from-amber-500 to-orange-400",
];

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenParentGate,
}) => {
  const { profiles, activeProfile, setActiveProfile, addProfile, deleteProfile } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(3);
  const [favoriteAnimal, setFavoriteAnimal] = useState("Bunny");
  const [favoriteTheme, setFavoriteTheme] = useState("The silver moon and drifting clouds");
  const [avatarEmoji, setAvatarEmoji] = useState("🐰");
  const [avatarColor, setAvatarColor] = useState(COLOR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSelectProfile = (profile: ChildProfile) => {
    setActiveProfile(profile);
    onClose();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProfile({
      name: name.trim(),
      age: Number(age),
      favoriteAnimal: favoriteAnimal.trim() || "Bunny",
      favoriteTheme: favoriteTheme.trim() || "Gentle stars and sweet dreams",
      avatarColor,
      avatarEmoji,
      preferredLanguage: "English",
    });

    setIsCreating(false);
    setName("");
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenParentGate(() => {
      deleteProfile(id);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCreating ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">Who is going to sleep?</h3>
                <p className="text-xs text-slate-400">Select or add your child's profile</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {profiles.map((profile) => {
                const isActive = activeProfile.id === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-all ${
                      isActive
                        ? "bg-slate-800/90 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40"
                        : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-2xl shadow-md`}
                      >
                        {profile.avatarEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-semibold text-white text-base">
                            {profile.name}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/80 text-amber-300 font-medium">
                            {profile.age} {profile.age === 1 ? "yr" : "yrs"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>Loves: {profile.favoriteAnimal}</span>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{profile.favoriteTheme}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      {profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(profile.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 rounded-xl transition"
                          title="Delete profile (Requires parent PIN)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-amber-400/40 hover:border-amber-400 text-amber-300 font-heading font-semibold text-sm hover:bg-amber-400/10 transition"
            >
              <Plus className="w-4 h-4" />
              Add Another Child
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-400 hover:text-amber-300 transition"
              >
                ← Back
              </button>
              <h3 className="font-heading text-lg font-bold text-white ml-auto">
                Add Child Profile
              </h3>
            </div>

            {/* Avatar picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Avatar & Tone
              </label>
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-3xl shadow-lg ring-2 ring-white/20`}
                >
                  {avatarEmoji}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatarEmoji(emoji)}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition ${
                          avatarEmoji === emoji
                            ? "bg-slate-700 ring-2 ring-amber-400 scale-110"
                            : "bg-slate-800/80 hover:bg-slate-700"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAvatarColor(c)}
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} transition ${
                          avatarColor === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Child's Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya, Lucas, Liam..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Age slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Age</span>
                <span className="text-amber-300 font-bold">{age} {age === 1 ? "year old" : "years old"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Infant (0)</span>
                <span>Toddler (2-3)</span>
                <span>Preschool (4-5)</span>
                <span>Early school (6-8)</span>
              </div>
            </div>

            {/* Favorite Animal */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Favorite Animal / Companion
              </label>
              <input
                type="text"
                value={favoriteAnimal}
                onChange={(e) => setFavoriteAnimal(e.target.value)}
                placeholder="e.g. Bunny, Bear, Puppy, Little Dragon..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Favorite Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Bedtime Theme
              </label>
              <input
                type="text"
                value={favoriteTheme}
                onChange={(e) => setFavoriteTheme(e.target.value)}
                placeholder="e.g. Silver moon, gentle train, starry ocean..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm shadow-lg shadow-amber-500/20 transition"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
