import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Trophy, Target, Clock, Zap, Play } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface ActiveTarget {
  id: number;
  x: number; // percentage 10% to 90%
  y: number; // percentage 10% to 90%
  isGolden: boolean;
  spawnTime: number;
}

export const TargetHitGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(null);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_target_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [coinsWon, setCoinsWon] = useState<number>(0);

  const targetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnTarget = () => {
    const isGolden = Math.random() < 0.25;
    const newTarget: ActiveTarget = {
      id: Date.now(),
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      isGolden,
      spawnTime: Date.now()
    };
    setActiveTarget(newTarget);

    if (targetTimerRef.current) clearTimeout(targetTimerRef.current);
    // Target vanishes after 1.1s if not clicked
    targetTimerRef.current = setTimeout(() => {
      setActiveTarget(null);
      spawnTarget();
    }, 1100);
  };

  const startGame = () => {
    sounds.playClick();
    setIsPlaying(true);
    setTimeLeft(30);
    setScore(0);
    setHits(0);
    setTotalClicks(0);
    setGameOver(false);
    setCoinsWon(0);
    spawnTarget();
  };

  // 30s countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Game over
      if (targetTimerRef.current) clearTimeout(targetTimerRef.current);
      setIsPlaying(false);
      setGameOver(true);
      setActiveTarget(null);

      const accuracy = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
      const calculatedCoins = Math.round(score * 1.5 + accuracy * 0.5);
      setCoinsWon(calculatedCoins);

      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('ali_king_target_best', String(score));
      }

      sounds.playWin();
      recordGameResult('target-hit', score, calculatedCoins, `Scored ${score} with ${accuracy}% accuracy in Target Strike`);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, totalClicks, hits, score, bestScore, recordGameResult]);

  const handleContainerClick = () => {
    if (!isPlaying) return;
    setTotalClicks(c => c + 1);
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying || !activeTarget) return;

    setTotalClicks(c => c + 1);
    setHits(h => h + 1);

    const points = activeTarget.isGolden ? 30 : 10;
    setScore(s => s + points);

    if (activeTarget.isGolden) {
      sounds.playCoin();
    } else {
      sounds.playTick();
    }

    if (targetTimerRef.current) clearTimeout(targetTimerRef.current);
    setActiveTarget(null);
    spawnTarget();
  };

  const accuracy = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 100;

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-orange-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
            Reflex
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-orange-300">
            Rapid Target Strike
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Score & Timer Ribbon */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-orange-500/30 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-orange-400" />
              <span>Time</span>
            </div>
            <span className="font-display font-black text-base text-orange-400 font-mono">{timeLeft}s</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">Score</span>
            <span className="font-display font-black text-base text-amber-400 font-mono">{score}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">Accuracy</span>
            <span className="font-display font-black text-base text-purple-300 font-mono">{accuracy}%</span>
          </div>
        </div>

        {/* Target Arena */}
        <div
          onClick={handleContainerClick}
          className="relative w-full aspect-square max-w-[370px] mx-auto rounded-2xl overflow-hidden border border-orange-500/30 shadow-2xl bg-[#090b17] cursor-crosshair select-none"
        >
          {/* Target Arena Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          {/* Active Target */}
          {isPlaying && activeTarget && (
            <button
              onClick={handleTargetClick}
              style={{
                left: `${activeTarget.x}%`,
                top: `${activeTarget.y}%`
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-transform active:scale-90 animate-pulse ${
                activeTarget.isGolden
                  ? 'w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white gold-glow text-slate-950 font-black text-xs'
                  : 'w-14 h-14 bg-gradient-to-tr from-red-600 to-orange-500 border-2 border-red-200 text-white font-black text-xs'
              }`}
            >
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/80 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
            </button>
          )}

          {/* Start / Game Over Overlay */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              {gameOver ? (
                <div>
                  <span className="text-4xl">🎯</span>
                  <h3 className="font-display font-black text-2xl text-amber-400 mt-2">Time's Up!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Score: {score} • Hits: {hits} • Accuracy: {accuracy}%
                  </p>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    +{coinsWon} Virtual Coins Awarded!
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-4xl">⚡</span>
                  <h3 className="font-display font-black text-2xl text-white mt-2">Rapid Target Strike</h3>
                  <p className="text-xs text-slate-300 mt-1">Tap targets as fast as they appear! Gold targets give 3x.</p>
                </div>
              )}

              <button
                onClick={startGame}
                className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-display font-bold text-base shadow-lg active:scale-95 transition flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{gameOver ? 'STRIKE AGAIN' : 'START 30s ROUND'}</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Gold bullseyes award +30 points • Normal targets award +10 points
        </p>
      </div>
    </div>
  );
};
