import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Heart, Trophy, Play } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  points: number;
  alive: boolean;
}

export const BrickBreakerGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);

  // Mutable refs for physics loop
  const stateRef = useRef({
    paddleX: 180,
    paddleW: 75,
    paddleH: 12,
    ballX: 200,
    ballY: 340,
    ballRadius: 6,
    ballVx: 3.5,
    ballVy: -3.5,
    bricks: [] as Brick[],
    lives: 3,
    score: 0,
    isPlaying: false
  });

  const initBricks = () => {
    const rows = 5;
    const cols = 7;
    const brickW = 44;
    const brickH = 14;
    const padding = 6;
    const offsetTop = 40;
    const offsetLeft = 20;

    const colors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4'];
    const pointValues = [50, 40, 30, 20, 10];

    const newBricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newBricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          w: brickW,
          h: brickH,
          color: colors[r],
          points: pointValues[r],
          alive: true
        });
      }
    }
    return newBricks;
  };

  const startGame = () => {
    sounds.playClick();
    const bricks = initBricks();
    stateRef.current = {
      paddleX: 160,
      paddleW: 75,
      paddleH: 12,
      ballX: 200,
      ballY: 300,
      ballRadius: 6,
      ballVx: (Math.random() < 0.5 ? -3.5 : 3.5),
      ballVy: -3.8,
      bricks,
      lives: 3,
      score: 0,
      isPlaying: true
    };
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setCoinsEarned(0);
    setIsPlaying(true);
  };

  // Canvas loop
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

      // Draw background grid
      ctx.fillStyle = '#080c1a';
      ctx.fillRect(0, 0, w, h);

      // Draw Bricks
      let aliveCount = 0;
      s.bricks.forEach(b => {
        if (!b.alive) return;
        aliveCount++;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Paddle
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(s.paddleX, h - 25, s.paddleW, s.paddleH, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, s.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (s.isPlaying) {
        // Move ball
        s.ballX += s.ballVx;
        s.ballY += s.ballVy;

        // Wall collisions
        if (s.ballX - s.ballRadius <= 0) {
          s.ballX = s.ballRadius;
          s.ballVx = -s.ballVx;
          sounds.playTick();
        } else if (s.ballX + s.ballRadius >= w) {
          s.ballX = w - s.ballRadius;
          s.ballVx = -s.ballVx;
          sounds.playTick();
        }

        if (s.ballY - s.ballRadius <= 0) {
          s.ballY = s.ballRadius;
          s.ballVy = -s.ballVy;
          sounds.playTick();
        }

        // Paddle collision
        const paddleY = h - 25;
        if (
          s.ballY + s.ballRadius >= paddleY &&
          s.ballY - s.ballRadius <= paddleY + s.paddleH &&
          s.ballX >= s.paddleX &&
          s.ballX <= s.paddleX + s.paddleW &&
          s.ballVy > 0
        ) {
          // Reflect based on hit position
          const hitPos = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2);
          s.ballVx = hitPos * 4.5;
          s.ballVy = -Math.abs(s.ballVy);
          sounds.playTick();
        }

        // Brick collisions
        s.bricks.forEach(b => {
          if (!b.alive) return;
          if (
            s.ballX + s.ballRadius > b.x &&
            s.ballX - s.ballRadius < b.x + b.w &&
            s.ballY + s.ballRadius > b.y &&
            s.ballY - s.ballRadius < b.y + b.h
          ) {
            b.alive = false;
            s.ballVy = -s.ballVy;
            s.score += b.points;
            setScore(s.score);
            sounds.playCoin();
          }
        });

        // Bottom hit (lose life)
        if (s.ballY + s.ballRadius >= h) {
          s.lives--;
          setLives(s.lives);
          sounds.playCrash();

          if (s.lives <= 0) {
            s.isPlaying = false;
            setIsPlaying(false);
            setGameOver(true);
            const coins = Math.round(s.score / 5);
            setCoinsEarned(coins);
            recordGameResult('brick-breaker', s.score, coins, `Scored ${s.score} in Neon Brick Smasher`);
          } else {
            // Reset ball
            s.ballX = s.paddleX + s.paddleW / 2;
            s.ballY = h - 50;
            s.ballVy = -3.8;
            s.ballVx = (Math.random() < 0.5 ? -3 : 3);
          }
        }

        // Win check
        if (aliveCount === 0 && s.isPlaying) {
          s.isPlaying = false;
          setIsPlaying(false);
          setGameWon(true);
          sounds.playWin();
          const winCoins = Math.round(s.score / 4) + 100;
          setCoinsEarned(winCoins);
          recordGameResult('brick-breaker', s.score + 500, winCoins, `Cleared all neon bricks! (${s.score} pts)`);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [recordGameResult]);

  // Touch and mouse paddle controls
  const handleMove = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const paddleW = stateRef.current.paddleW;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - paddleW, x - paddleW / 2));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-red-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
            Arcade
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-red-300">
            Neon Brick Smasher
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Score</span>
            <span className="font-display font-black text-xl text-red-400 font-mono">{score}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Lives</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-700'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Screen */}
        <div className="relative w-full aspect-[4/5] max-w-[370px] mx-auto rounded-2xl overflow-hidden border border-red-500/30 shadow-2xl bg-[#080c1a]">
          <canvas
            ref={canvasRef}
            width={380}
            height={460}
            onMouseMove={e => handleMove(e.clientX)}
            onTouchMove={e => handleMove(e.touches[0].clientX)}
            className="w-full h-full block touch-none cursor-ew-resize"
          />

          {/* Idle / Game Over Overlay */}
          {(!isPlaying || gameOver || gameWon) && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              {gameWon ? (
                <div className="animate-bounce">
                  <span className="text-4xl">🏆</span>
                  <h3 className="font-display font-black text-2xl text-amber-400 mt-2">Stage Cleared!</h3>
                  <p className="text-xs text-slate-300 mt-1">+{coinsEarned} Virtual Coins Added!</p>
                </div>
              ) : gameOver ? (
                <div>
                  <span className="text-4xl">💥</span>
                  <h3 className="font-display font-black text-2xl text-red-500 mt-2">Game Over</h3>
                  <p className="text-xs text-slate-300 mt-1">Final Score: {score}</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">+{coinsEarned} Virtual Coins Won</p>
                </div>
              ) : (
                <div>
                  <span className="text-4xl">🕹️</span>
                  <h3 className="font-display font-black text-2xl text-white mt-2">Neon Brick Smasher</h3>
                  <p className="text-xs text-slate-300 mt-1">Slide finger or mouse to guide paddle</p>
                </div>
              )}

              <button
                onClick={startGame}
                className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 font-display font-bold text-base shadow-lg active:scale-95 transition flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{gameOver || gameWon ? 'PLAY AGAIN' : 'START GAME'}</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Drag paddle left & right to bounce the ball and smash bricks
        </p>
      </div>
    </div>
  );
};
