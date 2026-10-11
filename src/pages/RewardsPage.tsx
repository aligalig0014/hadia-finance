import React from 'react';
import { Gift, Flame, Trophy, CheckCircle, Sparkles, Award, Shield, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { DAILY_STREAK_REWARDS } from '../data/gamesList';

export const RewardsPage: React.FC = () => {
  const {
    user,
    claimDailyStreak,
    dailyMissions,
    claimMission,
    achievements,
    claimAchievement,
    adminSettings
  } = useGame();

  const currentStreak = user.streak;
  const streakMultiplier = adminSettings.dailyBonusMultiplier || 1;

  return (
    <div className="flex flex-col gap-5 pb-24 px-3.5 pt-3 max-w-lg mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-400" />
          <h1 className="font-brand font-black text-xl text-white">
            REWARDS & STREAKS
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Free Coins
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Check in daily to build your 7-day streak and unlock royal bonus points!
        </p>
      </div>

      {/* 7-Day Streak Ladder Card */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel-gold gold-glow relative overflow-hidden flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
              🔥
            </div>
            <div>
              <h2 className="font-brand font-bold text-sm text-white">7-Day Login Streak</h2>
              <p className="text-[10px] text-amber-300/80 font-semibold">
                Current Streak: {currentStreak} Days
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs">
            Day 7: +{300 * streakMultiplier} Coins
          </div>
        </div>

        {/* 7-Days Visual Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {DAILY_STREAK_REWARDS.map(r => {
            const isClaimed = user.claimedDays.includes(r.day);
            const isToday = user.streak === r.day && !isClaimed;
            const isLocked = r.day > user.streak;
            const rewardCoins = r.coins * streakMultiplier;

            return (
              <div
                key={r.day}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                  isClaimed
                    ? 'bg-slate-900/60 border border-emerald-500/40 text-slate-400'
                    : isToday
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 gold-glow scale-105'
                    : isLocked
                    ? 'bg-slate-900/40 border border-slate-800 text-slate-500'
                    : 'bg-slate-900/80 border border-purple-500/30 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold">Day {r.day}</span>
                <span className="text-xl my-1">
                  {isClaimed ? '✅' : r.day === 7 ? '👑' : '🪙'}
                </span>
                <span className="font-mono text-[11px] font-bold text-amber-300">
                  +{rewardCoins}
                </span>

                {isToday && (
                  <button
                    onClick={() => claimDailyStreak(r.day)}
                    className="w-full mt-1.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] uppercase tracking-wider animate-pulse shadow"
                  >
                    CLAIM
                  </button>
                )}
                {isClaimed && (
                  <span className="text-[9px] font-semibold text-emerald-400 mt-1">Claimed</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (user.claimedDays.length / 7) * 100)}%` }}
          />
        </div>
      </div>

      {/* Daily Missions */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-purple-400" />
          <h2 className="font-brand font-bold text-sm text-white uppercase tracking-wider">
            Daily Missions
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {dailyMissions.map(m => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-lg shrink-0">
                  {m.icon === 'Disc3' ? '🎡' : m.icon === 'Gamepad2' ? '🎮' : m.icon === 'Plane' ? '🚀' : '🧱'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">{m.title}</h3>
                  <p className="text-[10px] text-slate-400">{m.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono">
                      {m.progress}/{m.target}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {m.claimed ? (
                  <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs">
                    Claimed
                  </span>
                ) : m.completed ? (
                  <button
                    onClick={() => claimMission(m.id)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider gold-glow active:scale-95 transition"
                  >
                    +{m.reward} Coins
                  </button>
                ) : (
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    +{m.reward} 🪙
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Shelf */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h2 className="font-brand font-bold text-sm text-white uppercase tracking-wider">
            Achievements
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {achievements.map(a => (
            <div
              key={a.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 text-xs ${
                a.unlocked
                  ? 'bg-purple-950/40 border-purple-500/30'
                  : 'bg-slate-900/60 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">
                  {a.icon === 'Plane' ? '🚀' : a.icon === 'Dices' ? '🎲' : a.icon === 'Grid3X3' ? '🃏' : a.icon === 'Flame' ? '🔥' : a.icon === 'Coins' ? '🪙' : a.icon === 'Car' ? '🏎️' : a.icon === 'Box' ? '👑' : '🎯'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-200">{a.title}</h3>
                    {a.unlocked && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{a.description}</p>
                </div>
              </div>

              <div className="shrink-0">
                {a.rewardCoins > 0 && a.unlocked ? (
                  <button
                    onClick={() => claimAchievement(a.id)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider gold-glow active:scale-95 transition"
                  >
                    +{a.rewardCoins} Coins
                  </button>
                ) : (
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    {a.rewardCoins === 0 ? 'Claimed' : `+${a.rewardCoins} 🪙`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
