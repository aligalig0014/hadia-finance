import React, { useState } from 'react';
import { User, Shield, Volume2, VolumeX, LogOut, Settings, Award, History, Edit3, Coins, Trophy, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

const AVATAR_OPTIONS = ['👑', '🦁', '⚡', '🎯', '💎', '⭐', '🐯', '🥷', '🚀', '🐉'];

export const ProfilePage: React.FC = () => {
  const {
    user,
    updateProfile,
    logout,
    soundEnabled,
    toggleSound,
    setIsAdminOpen,
    setIsAuthModalOpen,
    achievements,
    gameSessions
  } = useGame();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfile({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const handlePickAvatar = (av: string) => {
    updateProfile({ avatar: av });
    setShowAvatarPicker(false);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="flex flex-col gap-4 pb-24 px-3.5 pt-3 max-w-lg mx-auto w-full">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl glass-panel-purple purple-glow relative overflow-hidden flex flex-col items-center text-center">
        {/* Avatar with edit badge */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-[2.5px] shadow-2xl transition hover:scale-105 active:scale-95"
            title="Change Avatar"
          >
            <div className="w-full h-full bg-[#0b0e1e] rounded-[22px] flex items-center justify-center text-4xl">
              {user.avatar}
            </div>
          </button>
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold border border-white/20">
            EDIT
          </span>
        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-purple-500/40 w-full animate-fadeIn">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              Select Your Royal Mascot:
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {AVATAR_OPTIONS.map(av => (
                <button
                  key={av}
                  onClick={() => handlePickAvatar(av)}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border transition ${
                    user.avatar === av
                      ? 'bg-purple-600/40 border-purple-400 scale-110'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Name & Info */}
        <div className="mt-3 flex flex-col items-center">
          {isEditingName ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-purple-400 text-white font-bold text-sm text-center focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl text-white">{user.name}</h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-0.5">{user.emailOrPhone}</p>
          <span className="text-[10px] text-purple-300/80 font-mono mt-0.5">
            Member Since: {user.createdAt || '2026-03-01'}
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="w-full mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Balance</span>
            <span className="font-mono font-bold text-xs text-amber-300">
              🪙 {user.virtualCoins.toLocaleString()}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Games</span>
            <span className="font-mono font-bold text-xs text-purple-300">
              {user.totalGames}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Streak</span>
            <span className="font-mono font-bold text-xs text-orange-400">
              {user.streak}d
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Best Score</span>
            <span className="font-mono font-bold text-xs text-emerald-400">
              {user.bestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Badges Shelf */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-brand font-bold text-xs uppercase tracking-wider text-white">
              Achievement Badges
            </h3>
          </div>
          <span className="text-xs text-purple-300 font-mono font-bold">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {achievements.map(a => (
            <div
              key={a.id}
              className={`p-2.5 rounded-2xl flex flex-col items-center text-center border transition ${
                a.unlocked
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600 grayscale'
              }`}
            >
              <span className="text-2xl mb-1">
                {a.icon === 'Plane' ? '🚀' : a.icon === 'Dices' ? '🎲' : a.icon === 'Grid3X3' ? '🃏' : a.icon === 'Flame' ? '🔥' : a.icon === 'Coins' ? '🪙' : a.icon === 'Car' ? '🏎️' : a.icon === 'Box' ? '👑' : '🎯'}
              </span>
              <span className="text-[10px] font-bold truncate w-full leading-tight">
                {a.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Game History */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="font-brand font-bold text-xs uppercase tracking-wider text-white">
              Recent Game History
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">{gameSessions.length} sessions</span>
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {gameSessions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No recent game history yet.</p>
          ) : (
            gameSessions.slice(0, 5).map(s => (
              <div
                key={s.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200">{s.gameName}</span>
                  <span className="block text-[10px] text-slate-400">{s.details}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold ${
                      s.coinsEarned > 0 ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {s.coinsEarned > 0 ? `+${s.coinsEarned}` : '0'} Coins
                  </span>
                  <span className="block text-[9px] text-slate-500">{s.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings & Admin Menu */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
        <h3 className="font-brand font-bold text-xs uppercase tracking-wider text-slate-300">
          Preferences & Controls
        </h3>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>Arcade Audio Effects</span>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-xl font-bold text-xs transition border ${
              soundEnabled
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>

        {/* Open Admin Portal Button */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-900/80 to-slate-900 border border-purple-500/40 hover:border-purple-400 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95"
        >
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Launch Admin Demo Portal</span>
        </button>

        {/* Auth / Account Switcher Button */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={() => setIsAuthModalOpen(true, 'login')}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition text-center"
          >
            Switch Account
          </button>

          <button
            onClick={logout}
            className="py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
