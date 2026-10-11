import React from 'react';
import { Bell, Volume2, VolumeX, Sparkles, Shield, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Header: React.FC = () => {
  const {
    user,
    notifications,
    soundEnabled,
    toggleSound,
    setIsWalletModalOpen,
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    setIsNotificationsOpen,
    setIsAuthModalOpen,
    setActiveTab
  } = useGame();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#070913]/90 backdrop-blur-md border-b border-purple-500/20 px-3.5 py-2.5">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-[1.5px] shadow-lg purple-glow flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0e1e] rounded-[10px] flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-brand font-black text-sm tracking-widest gold-gradient-text">
                ALI KING
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                PRO
              </span>
            </div>
            <span className="text-[9px] text-purple-300 tracking-wider font-semibold uppercase -mt-0.5">
              Virtual Gaming
            </span>
          </div>
        </div>

        {/* Right Action Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Virtual Wallet Chip */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-400/30 hover:border-amber-400/60 transition active:scale-95 group"
          >
            <span className="text-sm">🪙</span>
            <div className="flex flex-col items-start leading-none">
              <span className="font-display font-black text-xs text-amber-300">
                {user.virtualCoins.toLocaleString()}
              </span>
              <span className="text-[7px] text-slate-400 uppercase font-semibold">Coins</span>
            </div>
          </button>

          {/* Deposit Button */}
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-2 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[10px] uppercase tracking-wider transition active:scale-95 shadow flex items-center gap-0.5"
            title="Deposit / Jama"
          >
            <span>+</span>
            <span>Deposit</span>
          </button>

          {/* Withdraw Button */}
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-2 py-1.5 rounded-xl bg-slate-900 border border-purple-500/40 hover:border-purple-400 text-purple-300 font-bold text-[10px] uppercase tracking-wider transition active:scale-95 shadow hidden xs:flex items-center gap-0.5"
            title="Withdraw / Nikalna"
          >
            <span>Withdraw</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            title="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar / Login */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1.5px] transition hover:scale-105 active:scale-95"
            title="My Profile"
          >
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sm">
              {user.avatar || '👑'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
