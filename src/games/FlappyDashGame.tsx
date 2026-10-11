import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Trophy, Play } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export const FlappyDashGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_flappy_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [coinsWon, setCoinsWon] = useState<number>(0);

  // Game physics state
  const stateRef = useRef({
    birdY: 200,
    birdVy: 0,
    gravity: 0.38,
    jumpPower: -6.5,
    pipes: [] as Pipe[],
    pipeSpeed: 2.4,
    pipeGap: 120,
    pipeWidth: 50,
    score: 0,
    isPlaying: false
  });

  const jump = useCallback(() => {
    if (!stateRef.current.isPlaying) return;
    stateRef.current.birdVy = stateRef.current.jumpPower;
    sounds.playJump();
  }, []);

  const startGame = useCallback(() => {
    sounds.playClick();
    stateRef.current = {
      birdY: 200,
      birdVy: -3,
      gravity: 0.38,
      jumpPower: -6.5,
      pipes: [
        { x: 380, topHeight: 120, bottomHeight: 210, passed: false },
        { x: 580, topHeight: 160, bottomHeight: 170, passed: false }
      ],
      pipeSpeed: 2.4,
      pipeGap: 125,
      pipeWidth: 50,
      score: 0,
      isPlaying: true
    };
    setScore(0);
    setGameOver(false);
    setCoinsWon(0);
    setIsPlaying(true);
  }, []);

  // Keyboard Space listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (stateRef.current.isPlaying) {
          jump();
        } else if (gameOver || !isPlaying) {
          startGame();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump, gameOver, isPlaying, startGame]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Night sky gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0d1f');
      bgGrad.addColorStop(1, '#05070e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 20; i++) {
        const sx = ((i * 37) % w);
        const sy = ((i * 29) % (h - 80));
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Draw Pipes
      s.pipes.forEach(p => {
        // Top Pipe
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, 0, s.pipeWidth, p.topHeight);
        ctx.strokeRect(p.x, 0, s.pipeWidth, p.topHeight);

        // Bottom Pipe
        const bottomY = h - p.bottomHeight;
        ctx.fillRect(p.x, bottomY, s.pipeWidth, p.bottomHeight);
        ctx.strokeRect(p.x, bottomY, s.pipeWidth, p.bottomHeight);
        ctx.shadowBlur = 0;
      });

      // Draw Bird
      const birdX = 80;
      ctx.save();
      ctx.translate(birdX, s.birdY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, s.birdVy * 0.08));
      ctx.rotate(angle);

      // Bird body
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Crown on bird
      ctx.fillStyle = '#f59e0b';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👑', 0, -10);

      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(6, -4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(20, 3);
      ctx.lineTo(12, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Ground
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, h - 20, w, 20);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h - 20);
      ctx.lineTo(w, h - 20);
      ctx.stroke();

      if (s.isPlaying) {
        // Update Bird physics
        s.birdVy += s.gravity;
        s.birdY += s.birdVy;

        // Ground & ceiling collision
        if (s.birdY + 14 >= h - 20 || s.birdY - 14 <= 0) {
          endGame();
        }

        // Update Pipes
        s.pipes.forEach(p => {
          p.x -= s.pipeSpeed;

          // Check pass for points
          if (!p.passed && p.x + s.pipeWidth < birdX) {
            p.passed = true;
            s.score += 1;
            setScore(s.score);
            sounds.playCoin();
          }

          // Check pipe collision
          const birdRadius = 12;
          if (birdX + birdRadius > p.x && birdX - birdRadius < p.x + s.pipeWidth) {
            if (s.birdY - birdRadius < p.topHeight || s.birdY + birdRadius > h - p.bottomHeight) {
              endGame();
            }
          }
        });

        // Spawn new pipes / recycle
        if (s.pipes.length > 0 && s.pipes[0].x < -s.pipeWidth) {
          s.pipes.shift();
          const lastX = s.pipes[s.pipes.length - 1].x;
          const topH = 80 + Math.random() * 140;
          const botH = h - 20 - topH - s.pipeGap;
          s.pipes.push({
            x: lastX + 190,
            topHeight: topH,
            bottomHeight: botH,
            passed: false
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    const endGame = () => {
      const s = stateRef.current;
      s.isPlaying = false;
      setIsPlaying(false);
      setGameOver(true);
      sounds.playCrash();

      const coins = s.score * 15;
      setCoinsWon(coins);

      if (s.score > bestScore) {
        setBestScore(s.score);
        localStorage.setItem('ali_king_flappy_best', String(s.score));
      }

      recordGameResult('flappy-dash', s.score, coins, `Reached score of ${s.score} in Flappy King Dash`);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [bestScore, recordGameResult]);

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-lime-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-lime-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-500/20 text-lime-300 border border-lime-500/30">
            Action
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-lime-300">
            Flappy King Dash
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Score Ribbon */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-lime-500/30 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Score</span>
            <span className="font-display font-black text-xl text-lime-400 font-mono">{score}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Best</span>
            </div>
            <span className="font-display font-black text-xl text-amber-400 font-mono">{bestScore}</span>
          </div>
        </div>

        {/* Canvas Screen */}
        <div
          onClick={isPlaying ? jump : undefined}
          className="relative w-full aspect-[4/5] max-w-[370px] mx-auto rounded-2xl overflow-hidden border border-lime-500/30 shadow-2xl bg-[#080c1a] cursor-pointer select-none"
        >
          <canvas
            ref={canvasRef}
            width={380}
            height={460}
            className="w-full h-full block"
          />

          {/* Start / Game Over Overlay */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              {gameOver ? (
                <div>
                  <span className="text-4xl">👑</span>
                  <h3 className="font-display font-black text-2xl text-red-500 mt-2">Game Over</h3>
                  <p className="text-xs text-slate-300 mt-1">Score: {score}</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    +{coinsWon} Virtual Coins Awarded!
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-4xl">🐦</span>
                  <h3 className="font-display font-black text-2xl text-white mt-2">Flappy King Dash</h3>
                  <p className="text-xs text-slate-300 mt-1">Tap screen or press Space to fly</p>
                </div>
              )}

              <button
                onClick={e => {
                  e.stopPropagation();
                  startGame();
                }}
                className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 text-slate-950 font-display font-bold text-base shadow-lg active:scale-95 transition flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{gameOver ? 'PLAY AGAIN' : 'TAP TO START'}</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Tap anywhere or press Spacebar to flap wings
        </p>
      </div>
    </div>
  );
};
