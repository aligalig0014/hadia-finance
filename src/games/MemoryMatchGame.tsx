import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Clock, Trophy, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['👑', '💎', '⭐', '🚀', '🏆', '⚔️', '🛡️', '🔥'];

export const MemoryMatchGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bestTime, setBestTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_memory_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const initializeGame = () => {
    sounds.playClick();
    const pairs = [...SYMBOLS, ...SYMBOLS];
    // Fisher-Yates shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    const newCards: Card[] = pairs.map((symbol, idx) => ({
      id: idx,
      symbol,
      isFlipped: false,
      isMatched: false
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setIsPlaying(true);
    setIsCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || isCompleted) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedCards.length === 2) return;

    sounds.playTick();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Matched!
        sounds.playCoin();
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setFlippedCards([]);
          setMatches(m => {
            const nextMatch = m + 1;
            if (nextMatch === SYMBOLS.length) {
              // Completed!
              setIsCompleted(true);
              setIsPlaying(false);
              sounds.playWin();

              // Calculate virtual coins reward
              const timeBonus = Math.max(10, 100 - seconds * 2);
              const moveBonus = Math.max(10, 80 - moves * 2);
              const coins = timeBonus + moveBonus;

              if (bestTime === 0 || seconds < bestTime) {
                setBestTime(seconds);
                localStorage.setItem('ali_king_memory_best', String(seconds));
              }

              recordGameResult('memory-match', seconds, coins, `Solved 4x4 Memory in ${seconds}s (${moves} moves)`);
            }
            return nextMatch;
          });
        }, 500);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-cyan-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Brain Arcade
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-cyan-300">
            Crown Memory 4x4
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Time</span>
            </div>
            <span className="font-bold text-sm text-cyan-300 font-mono">{seconds}s</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>Moves</span>
            </div>
            <span className="font-bold text-sm text-cyan-300 font-mono">{moves}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Best</span>
            </div>
            <span className="font-bold text-sm text-amber-400 font-mono">{bestTime ? `${bestTime}s` : '--'}</span>
          </div>
        </div>

        {/* 4x4 Cards Grid */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0c1828] to-[#070e17] border border-cyan-500/30 grid grid-cols-4 gap-2.5 aspect-square max-w-[360px] mx-auto w-full">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`rounded-xl text-2xl flex items-center justify-center transition-all duration-300 select-none shadow-md ${
                card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-2 border-cyan-300 scale-100 rotate-0'
                  : 'bg-slate-900/90 border border-cyan-500/30 hover:bg-slate-800 text-transparent active:scale-95'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '👑'}
            </button>
          ))}
        </div>

        {/* Win / Complete Banner */}
        {isCompleted && (
          <div className="p-4 rounded-2xl glass-panel-gold gold-glow text-center animate-bounce">
            <h3 className="font-bold text-lg text-amber-400">🎉 Memory Solved!</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Completed in {seconds} seconds across {moves} moves!
            </p>
            <p className="text-sm font-black text-emerald-400 mt-1">
              +{Math.max(10, 100 - seconds * 2) + Math.max(10, 80 - moves * 2)} Virtual Coins Earned!
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={initializeGame}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>RESTART GAME</span>
        </button>
      </div>
    </div>
  );
};
