import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Trophy, Play, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface RoadItem {
  id: number;
  lane: number; // 0: left, 1: mid, 2: right
  y: number;
  type: 'obstacle' | 'coin';
  color: string;
}

export const RacingChallengeGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_racing_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [playerLane, setPlayerLane] = useState<number>(1); // 0, 1, 2

  const stateRef = useRef({
    lane: 1,
    speed: 4,
    items: [] as RoadItem[],
    distance: 0,
    coins: 0,
    isPlaying: false
  });

  const switchLane = useCallback((dir: 'left' | 'right') => {
    if (!stateRef.current.isPlaying) return;
    sounds.playTick();
    if (dir === 'left') {
      stateRef.current.lane = Math.max(0, stateRef.current.lane - 1);
    } else {
      stateRef.current.lane = Math.min(2, stateRef.current.lane + 1);
    }
    setPlayerLane(stateRef.current.lane);
  }, []);

  const startGame = useCallback(() => {
    sounds.playClick();
    stateRef.current = {
      lane: 1,
      speed: 4.5,
      items: [],
      distance: 0,
      coins: 0,
      isPlaying: true
    };
    setPlayerLane(1);
    setScore(0);
    setCoinsCollected(0);
    setGameOver(false);
    setIsPlaying(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        switchLane('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        switchLane('right');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [switchLane]);

  // Main canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let spawnTimer = 0;
    let roadStripeOffset = 0;

    const loop = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const laneW = w / 3;

      ctx.clearRect(0, 0, w, h);

      // Asphalt background
      ctx.fillStyle = '#0b0f1d';
      ctx.fillRect(0, 0, w, h);

      // Road side borders
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, 0, 8, h);
      ctx.fillRect(w - 8, 0, 8, h);

      // Moving road lane dividers
      if (s.isPlaying) {
        roadStripeOffset = (roadStripeOffset + s.speed) % 40;
      }

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -roadStripeOffset;

      ctx.beginPath();
      ctx.moveTo(laneW, 0);
      ctx.lineTo(laneW, h);
      ctx.moveTo(laneW * 2, 0);
      ctx.lineTo(laneW * 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Obstacles and Coins
      s.items.forEach(item => {
        const itemX = item.lane * laneW + laneW / 2;

        if (item.type === 'coin') {
          // Gold coin
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(itemX, item.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350f';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🪙', itemX, item.y);
          ctx.shadowBlur = 0;
        } else {
          // Obstacle car
          ctx.fillStyle = item.color;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(itemX - 22, item.y - 35, 44, 70, 8);
          ctx.fill();

          // Windshield
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(itemX - 16, item.y - 15, 32, 16);

          // Headlights
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(itemX - 18, item.y + 28, 8, 4);
          ctx.fillRect(itemX + 10, item.y + 28, 8, 4);
          ctx.shadowBlur = 0;
        }
      });

      // Draw Player Car
      const playerX = s.lane * laneW + laneW / 2;
      const playerY = h - 75;

      ctx.fillStyle = '#9333ea';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.roundRect(playerX - 22, playerY - 35, 44, 70, 8);
      ctx.fill();

      // Roof & Crown
      ctx.fillStyle = '#581c87';
      ctx.fillRect(playerX - 16, playerY - 15, 32, 28);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👑', playerX, playerY + 4);

      // Tail lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(playerX - 18, playerY + 30, 8, 3);
      ctx.fillRect(playerX + 10, playerY + 30, 8, 3);
      ctx.shadowBlur = 0;

      if (s.isPlaying) {
        s.distance += 1;
        setScore(Math.floor(s.distance / 2));

        // Speed ramp
        s.speed = 4.5 + Math.min(8, s.distance / 300);

        // Spawn items
        spawnTimer++;
        if (spawnTimer > Math.max(35, 65 - s.speed * 3)) {
          spawnTimer = 0;
          const lane = Math.floor(Math.random() * 3);
          const isCoin = Math.random() < 0.35;
          const carColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706'];

          s.items.push({
            id: Date.now() + Math.random(),
            lane,
            y: -50,
            type: isCoin ? 'coin' : 'obstacle',
            color: carColors[Math.floor(Math.random() * carColors.length)]
          });
        }

        // Move items & collisions
        for (let i = s.items.length - 1; i >= 0; i--) {
          const item = s.items[i];
          item.y += s.speed;

          // Check collision with player
          if (item.lane === s.lane && item.y > playerY - 45 && item.y < playerY + 45) {
            if (item.type === 'coin') {
              // Collect coin
              sounds.playCoin();
              s.coins += 1;
              setCoinsCollected(s.coins);
              s.items.splice(i, 1);
              continue;
            } else {
              // Crash obstacle
              sounds.playCrash();
              s.isPlaying = false;
              setIsPlaying(false);
              setGameOver(true);

              const totalScore = Math.floor(s.distance / 2);
              const totalCoinsAwarded = s.coins * 10 + Math.floor(totalScore / 5);

              if (totalScore > bestScore) {
                setBestScore(totalScore);
                localStorage.setItem('ali_king_racing_best', String(totalScore));
              }

              recordGameResult('racing-challenge', totalScore, totalCoinsAwarded, `Raced ${totalScore}m and gathered ${s.coins} coins!`);
              break;
            }
          }

          // Off screen remove
          if (item.y > h + 60) {
            s.items.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [bestScore, recordGameResult]);

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-blue-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Speed
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-blue-300">
            Midnight Highway
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/30 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">Distance</span>
            <span className="font-display font-black text-base text-blue-400 font-mono">{score}m</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-medium">Coins</span>
            <span className="font-display font-black text-base text-amber-400 font-mono">🪙 {coinsCollected}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Best</span>
            </div>
            <span className="font-display font-black text-base text-amber-300 font-mono">{bestScore}m</span>
          </div>
        </div>

        {/* Canvas Highway */}
        <div className="relative w-full aspect-[4/5] max-w-[370px] mx-auto rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl bg-[#080c1a]">
          <canvas
            ref={canvasRef}
            width={360}
            height={460}
            className="w-full h-full block"
          />

          {/* Overlay */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              {gameOver ? (
                <div>
                  <span className="text-4xl">💥</span>
                  <h3 className="font-display font-black text-2xl text-red-500 mt-2">Crash!</h3>
                  <p className="text-xs text-slate-300 mt-1">Distance: {score}m • Coins: {coinsCollected}</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    +{coinsCollected * 10 + Math.floor(score / 5)} Virtual Coins Earned!
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-4xl">🏎️</span>
                  <h3 className="font-display font-black text-2xl text-white mt-2">Midnight Highway</h3>
                  <p className="text-xs text-slate-300 mt-1">Switch lanes to avoid oncoming cars & snatch coins!</p>
                </div>
              )}

              <button
                onClick={startGame}
                className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-display font-bold text-base shadow-lg active:scale-95 transition flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{gameOver ? 'RACE AGAIN' : 'START RACE'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Lane Switch Buttons */}
        <div className="grid grid-cols-2 gap-4 max-w-[370px] mx-auto w-full pt-1">
          <button
            onClick={() => switchLane('left')}
            className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center gap-2 font-bold text-sm text-blue-300 shadow-md"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>STEER LEFT</span>
          </button>

          <button
            onClick={() => switchLane('right')}
            className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center gap-2 font-bold text-sm text-blue-300 shadow-md"
          >
            <span>STEER RIGHT</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
