import React, { useState } from 'react';
import { Search, Gamepad2, Star, Play, Sparkles, Filter, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GAMES_LIST } from '../data/gamesList';
import { GameCategory } from '../types/game';

export const GamesLobbyPage: React.FC = () => {
  const { openGame } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: GameCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All (12)', icon: '🎮' },
    { id: 'arcade', label: 'Arcade', icon: '🚀' },
    { id: 'luck', label: 'Luck', icon: '🎲' },
    { id: 'puzzle', label: 'Puzzle', icon: '🧩' },
    { id: 'action', label: 'Action', icon: '⚡' }
  ];

  const filteredGames = GAMES_LIST.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getEmojiIcon = (id: string) => {
    switch (id) {
      case 'teen-patti': return '🎴';
      case 'aviator': return '✈️';
      case 'lucky-spin': return '🎡';
      case 'dice-challenge': return '🎲';
      case 'coin-flip': return '🪙';
      case 'number-guess': return '🔢';
      case 'memory-match': return '🃏';
      case 'game-2048': return '👑';
      case 'brick-breaker': return '🧱';
      case 'flappy-dash': return '🐦';
      case 'racing-challenge': return '🏎️';
      case 'target-hit': return '🎯';
      case 'card-match': return '🂡';
      default: return '🎮';
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 px-3.5 pt-3 max-w-lg mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-purple-400" />
          <h1 className="font-brand font-black text-xl text-white">
            GAME LOBBY
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            12 Mini-Games
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Play original arcade & puzzle challenges to earn free virtual coins!
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search games (e.g. Aviator, Spin, 2048)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-1.5 border ${
              selectedCategory === cat.id
                ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Games Grid (12 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredGames.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
            <Gamepad2 className="w-8 h-8 opacity-40" />
            <p>No games matched your search.</p>
          </div>
        ) : (
          filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => openGame(game.id)}
              className="p-4 rounded-3xl bg-gradient-to-b from-[#11152a] to-[#0a0d1b] border border-slate-800/90 hover:border-purple-500/40 cursor-pointer transition-all duration-200 hover:scale-[1.01] shadow-xl flex flex-col justify-between group select-none"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
                  {getEmojiIcon(game.id)}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {game.badge || 'HOT'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{game.rating}</span>
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition">
                    {game.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {game.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  {(game.playedCount / 1000).toFixed(1)}k plays
                </span>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    openGame(game.id);
                  }}
                  className="px-3 py-1 rounded-xl bg-purple-600/90 group-hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1 shadow-md transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>PLAY</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-[10px] text-slate-500">
        All 12 mini-games operate solely with virtual demo coins. No real currency is involved.
      </div>
    </div>
  );
};
