import React from 'react';
import { Sparkles, Trophy, Gift, Flame, Play, ArrowRight, Zap, Star, ShieldCheck, Gamepad2, Megaphone } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GAMES_LIST } from '../data/gamesList';

export const HomePage: React.FC = () => {
  const {
    user,
    openGame,
    setActiveTab,
    setIsWalletModalOpen,
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    claimDailyStreak,
    adminSettings,
    leaderboard
  } = useGame();

  const nextStreakDay = Math.min(7, user.streak + (user.claimedDays.includes(user.streak) ? 1 : 0));
  const hasClaimableStreakToday = !user.claimedDays.includes(user.streak) && user.streak <= 7;

  // Games subsets
  const popularGames = [GAMES_LIST[0], GAMES_LIST[1], GAMES_LIST[2], GAMES_LIST[3]];
  const newGames = GAMES_LIST.slice(4, 8);
  const quickPlayGames = [GAMES_LIST[0], GAMES_LIST[1], GAMES_LIST[2], GAMES_LIST[3], GAMES_LIST[7]];

  return (
    <div className="flex flex-col gap-5 pb-24 px-3.5 pt-3 max-w-lg mx-auto w-full">
      {/* Announcement Ticker Banner */}
      {adminSettings.announcementActive && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 overflow-hidden">
          <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="truncate font-medium text-[11px]">
            {adminSettings.announcementText}
          </div>
        </div>
      )}

      {/* Live Players Real-time Winning Ticker */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-slate-900 border border-emerald-500/30 text-[11px] overflow-hidden shadow-inner">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[9px] shrink-0">Live Win:</span>
        <div className="truncate text-slate-300 font-medium animate-pulse">
          <span className="text-amber-300 font-bold">Malik_VIP</span> cashed <span className="text-emerald-400 font-bold">3.20x</span> on Sky Jet (+1,600 Coins) • <span className="text-amber-300 font-bold">Zara_Queen</span> won <span className="text-emerald-400 font-bold">4,800 Coins</span> in Teen Patti!
        </div>
      </div>

      {/* Main Luxury Wallet Card */}
      <div className="relative p-4 rounded-3xl glass-panel-gold gold-glow overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
              <span>👑</span>
              <span>Virtual Wallet Balance</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-black text-3xl sm:text-4xl text-amber-300">
                {user.virtualCoins.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-400">Coins</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Today: <span className="text-emerald-400 font-bold">+{user.todayEarned}</span> • Streak: <span className="text-amber-400 font-bold">{user.streak}d</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 text-xs font-black transition shadow active:scale-95 flex items-center gap-1"
              >
                <span>+</span>
                <span>Deposit</span>
              </button>

              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400 text-purple-200 text-xs font-bold transition shadow active:scale-95"
              >
                Withdraw
              </button>
            </div>

            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="text-[10px] text-amber-300/80 hover:text-amber-300 font-semibold underline mt-0.5"
            >
              Transactions →
            </button>
          </div>
        </div>

        {/* Quick Claim Daily Bonus Button */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Day {user.streak} Reward Available</span>
          </div>

          {hasClaimableStreakToday ? (
            <button
              onClick={() => claimDailyStreak(user.streak)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-xs uppercase tracking-wider gold-glow active:scale-95 transition flex items-center gap-1"
            >
              <span>CLAIM BONUS</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('rewards')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
            >
              <span>View Streak</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Animated Game Banner */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-br from-[#1c1236] via-[#100e24] to-[#0d142b] border border-purple-500/30 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-widest">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>PLAY • WIN VIRTUAL COINS • HAVE FUN</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
            Ascend to Royalty in <br />
            <span className="gold-gradient-text font-brand">ALI KING ARCADE</span>
          </h1>

          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            12 original arcade mini-games, instant virtual coins, 7-day reward streaks, and weekly championship leaderboards!
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <button
              onClick={() => openGame('teen-patti')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:opacity-95 text-slate-950 font-display font-black text-xs tracking-wider gold-glow active:scale-95 transition flex items-center gap-1.5 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>TEEN PATTI (10s)</span>
              <span>🃏</span>
            </button>

            <button
              onClick={() => openGame('aviator')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-xs tracking-wider purple-glow active:scale-95 transition flex items-center gap-1.5 shadow-lg"
            >
              <span>SKY JET JAHAZ</span>
              <span>🚀</span>
            </button>

            <button
              onClick={() => openGame('lucky-spin')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition active:scale-95"
            >
              <span>SPIN</span>
              <span>🎡</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Play Horizontal Carousel */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="font-brand font-bold text-sm text-white uppercase tracking-wider">
              Quick Play
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('games')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <span>All 12 Games</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {quickPlayGames.map(game => (
            <div
              key={game.id}
              onClick={() => openGame(game.id)}
              className="w-36 shrink-0 p-3 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between shadow-lg group select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{game.icon === 'Plane' ? '🚀' : game.icon === 'Disc3' ? '🎡' : game.icon === 'Dices' ? '🎲' : game.icon === 'Box' ? '🔢' : '🐦'}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {game.badge || 'HOT'}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-xs text-white truncate group-hover:text-amber-400 transition">
                  {game.title}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">{game.subtitle}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{game.rating}</span>
                </span>
                <span className="text-purple-400 font-semibold group-hover:translate-x-0.5 transition">
                  PLAY →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Games Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <h2 className="font-brand font-bold text-sm text-white uppercase tracking-wider">
              Popular Games
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Top Rated</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {popularGames.map(game => (
            <div
              key={game.id}
              onClick={() => openGame(game.id)}
              className="p-3.5 rounded-2xl bg-gradient-to-b from-[#111628] to-[#0b0e1b] border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg flex flex-col justify-between select-none"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-xl shadow-inner">
                  {game.id === 'aviator' ? '🚀' : game.id === 'lucky-spin' ? '🎡' : game.id === 'dice-challenge' ? '🎲' : '🪙'}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {game.badge || 'HOT'}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-xs text-white truncate">{game.title}</h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {game.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">
                  {(game.playedCount / 1000).toFixed(1)}k plays
                </span>
                <span className="font-bold text-amber-400">START →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Rewards Promo Banner */}
      <div
        onClick={() => setActiveTab('rewards')}
        className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 border border-purple-500/30 flex items-center justify-between cursor-pointer hover:border-purple-400/60 transition shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/30 shrink-0">
            🎁
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">7-Day Login Streak</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Day 7 grand prize: <span className="text-amber-400 font-bold">300 Coins!</span>
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shrink-0">
          Claim →
        </div>
      </div>

      {/* New Games Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="font-brand font-bold text-sm text-white uppercase tracking-wider">
              Arcade & Puzzles
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {newGames.map(game => (
            <div
              key={game.id}
              onClick={() => openGame(game.id)}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg flex flex-col justify-between select-none"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl shadow-inner">
                  {game.id === 'number-guess' ? '🔢' : game.id === 'memory-match' ? '🃏' : game.id === 'game-2048' ? '👑' : '🧱'}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {game.badge || 'NEW'}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-xs text-white truncate">{game.title}</h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {game.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">
                  {(game.playedCount / 1000).toFixed(1)}k plays
                </span>
                <span className="font-bold text-cyan-400">PLAY →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-brand font-bold text-xs uppercase tracking-wider text-white">
              Top Champions
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('ranking')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <span>Full Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {leaderboard.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 text-center font-bold font-mono text-amber-400">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </span>
                <span className="text-lg">{item.avatar}</span>
                <span className="font-bold text-slate-200">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-amber-300">
                🪙 {item.virtualCoins.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
