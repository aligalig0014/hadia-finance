import React, { useState } from 'react';
import { Trophy, Crown, Medal, Award, Flame, Star, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LeaderboardPage: React.FC = () => {
  const { leaderboard, user } = useGame();
  const [filter, setFilter] = useState<'all' | 'weekly' | 'today'>('all');

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="flex flex-col gap-4 pb-24 px-3.5 pt-3 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h1 className="font-brand font-black text-xl text-white">
            HALL OF FAME
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Top Players
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Climb the ranks by accumulating virtual winnings across all arcade games!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
        {(['all', 'weekly', 'today'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`py-2 rounded-xl uppercase tracking-wider transition ${
              filter === tab
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All-Time' : tab === 'weekly' ? 'Weekly' : 'Today'}
          </button>
        ))}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 items-end pt-5 pb-2">
        {/* Rank 2 (Silver) */}
        {topThree[1] && (
          <div className="p-3 rounded-2xl bg-gradient-to-t from-slate-900 to-[#12162b] border border-slate-700 flex flex-col items-center text-center shadow-lg relative h-40 justify-between">
            <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-200">
              2
            </div>
            <div className="text-3xl mt-2">{topThree[1].avatar}</div>
            <div className="w-full">
              <span className="font-bold text-xs text-slate-200 block truncate">
                {topThree[1].name}
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-300 block">
                {topThree[1].virtualCoins.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-500">Coins</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold) */}
        {topThree[0] && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-t from-amber-950/80 to-[#221c10] border-2 border-amber-400/70 flex flex-col items-center text-center shadow-2xl relative h-48 justify-between gold-glow scale-105 z-10">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-yellow-200 shadow-lg">
              👑
            </div>
            <div className="text-4xl mt-3">{topThree[0].avatar}</div>
            <div className="w-full">
              <span className="font-bold text-xs gold-gradient-text block truncate">
                {topThree[0].name}
              </span>
              <span className="font-mono text-xs font-black text-amber-300 block">
                {topThree[0].virtualCoins.toLocaleString()}
              </span>
              <span className="text-[9px] text-amber-400/80 font-bold uppercase">Champion</span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {topThree[2] && (
          <div className="p-3 rounded-2xl bg-gradient-to-t from-slate-900 to-[#191522] border border-amber-700/50 flex flex-col items-center text-center shadow-lg relative h-36 justify-between">
            <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-amber-500">
              3
            </div>
            <div className="text-3xl mt-2">{topThree[2].avatar}</div>
            <div className="w-full">
              <span className="font-bold text-xs text-slate-200 block truncate">
                {topThree[2].name}
              </span>
              <span className="font-mono text-[11px] font-bold text-amber-500 block">
                {topThree[2].virtualCoins.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-500">Coins</span>
            </div>
          </div>
        )}
      </div>

      {/* Your Rank Highlight Card */}
      {(() => {
        const myRank = leaderboard.find(l => l.name.toLowerCase() === user.name.toLowerCase());
        if (!myRank) return null;
        return (
          <div className="p-3.5 rounded-2xl bg-purple-950/70 border-2 border-purple-500/50 purple-glow flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center font-mono">
                #{myRank.rank}
              </span>
              <span className="text-2xl">{user.avatar}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{user.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    YOU
                  </span>
                </div>
                <span className="text-[10px] text-purple-300 font-mono">
                  {user.totalGames} Games Played
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-display font-black text-sm text-amber-300">
                {user.virtualCoins.toLocaleString()}
              </span>
              <span className="block text-[9px] text-slate-400">Virtual Coins</span>
            </div>
          </div>
        );
      })()}

      {/* Standings List */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 px-1">
          Full Ranks Standings
        </span>

        {remaining.map(item => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
              item.isCurrentUser
                ? 'bg-purple-950/50 border-purple-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-mono font-bold text-slate-400">
                #{item.rank}
              </span>
              <span className="text-2xl">{item.avatar}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-200">{item.name}</span>
                  {item.isCurrentUser && (
                    <span className="px-1 py-0.2 rounded bg-purple-500/30 text-purple-200 text-[8px] font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">
                  {item.gamesPlayed} games • Win rate: {item.winRate}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-amber-300">
                🪙 {item.virtualCoins.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
