import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Trophy, Award, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

type Grid = number[][];

export const Game2048: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const [grid, setGrid] = useState<Grid>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_2048_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Add random tile (2 or 4) to empty spot
  const addRandomTile = (currentGrid: Grid): Grid => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const restartGame = useCallback(() => {
    sounds.playClick();
    let initialGrid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    initialGrid = addRandomTile(initialGrid);
    initialGrid = addRandomTile(initialGrid);
    setGrid(initialGrid);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    restartGame();
  }, [restartGame]);

  // Slide & Merge logic
  const slideRow = (row: number[]): { newRow: number[]; points: number } => {
    const filtered = row.filter(val => val !== 0);
    const newRow: number[] = [];
    let points = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        points += mergedVal;
        i++; // skip next
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, points };
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let pointsGained = 0;
    let newGrid: Grid = grid.map(r => [...r]);
    let moved = false;

    if (direction === 'left') {
      for (let r = 0; r < 4; r++) {
        const { newRow, points } = slideRow(newGrid[r]);
        if (newRow.join(',') !== newGrid[r].join(',')) moved = true;
        newGrid[r] = newRow;
        pointsGained += points;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const reversed = [...newGrid[r]].reverse();
        const { newRow, points } = slideRow(reversed);
        const normalRow = newRow.reverse();
        if (normalRow.join(',') !== newGrid[r].join(',')) moved = true;
        newGrid[r] = normalRow;
        pointsGained += points;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        const { newRow, points } = slideRow(col);
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== newRow[r]) moved = true;
          newGrid[r][c] = newRow[r];
        }
        pointsGained += points;
      }
    } else if (direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [newGrid[3][c], newGrid[2][c], newGrid[1][c], newGrid[0][c]];
        const { newRow, points } = slideRow(col);
        const normal = newRow.reverse();
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== normal[r]) moved = true;
          newGrid[r][c] = normal[r];
        }
        pointsGained += points;
      }
    }

    if (moved) {
      sounds.playTick();
      const updatedGrid = addRandomTile(newGrid);
      setGrid(updatedGrid);

      const nextScore = score + pointsGained;
      setScore(nextScore);

      if (nextScore > bestScore) {
        setBestScore(nextScore);
        localStorage.setItem('ali_king_2048_best', String(nextScore));
      }

      if (pointsGained >= 64) {
        sounds.playCoin();
      }

      // Check game over
      let hasMoves = false;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (updatedGrid[r][c] === 0) hasMoves = true;
          if (c < 3 && updatedGrid[r][c] === updatedGrid[r][c + 1]) hasMoves = true;
          if (r < 3 && updatedGrid[r][c] === updatedGrid[r + 1][c]) hasMoves = true;
        }
      }

      if (!hasMoves) {
        setGameOver(true);
        sounds.playCrash();
        const coinsAwarded = Math.round(nextScore / 10);
        recordGameResult('game-2048', nextScore, coinsAwarded, `Scored ${nextScore} in 2048 King`);
      }
    }
  }, [gameOver, grid, score, bestScore, recordGameResult]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) move('right');
        else move('left');
      } else {
        if (dy > 0) move('down');
        else move('up');
      }
    }
    touchStartRef.current = null;
  };

  const getTileStyle = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-slate-800 text-slate-200 border-slate-700';
      case 4:
        return 'bg-cyan-900/80 text-cyan-200 border-cyan-600/50';
      case 8:
        return 'bg-blue-800 text-blue-100 border-blue-500/60';
      case 16:
        return 'bg-purple-800 text-purple-100 border-purple-500/60';
      case 32:
        return 'bg-pink-700 text-pink-100 border-pink-400';
      case 64:
        return 'bg-rose-600 text-white border-rose-400';
      case 128:
        return 'bg-amber-600 text-amber-950 font-black border-amber-300 gold-glow';
      case 256:
        return 'bg-yellow-500 text-yellow-950 font-black border-yellow-200 gold-glow';
      case 512:
        return 'bg-yellow-400 text-black font-black border-white gold-glow';
      case 1024:
        return 'bg-emerald-500 text-slate-950 font-black border-white';
      case 2048:
        return 'bg-gradient-to-r from-purple-500 via-amber-400 to-pink-500 text-slate-950 font-black border-2 border-yellow-300 animate-pulse';
      default:
        return 'bg-slate-950/60 border-slate-800/40 text-transparent';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-violet-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-violet-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Puzzle
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-violet-300">
            2048 King
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-violet-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Score Ribbon */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-violet-500/30 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Score</span>
            <span className="font-display font-black text-xl text-violet-300">{score}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Best</span>
            </div>
            <span className="font-display font-black text-xl text-amber-400">{bestScore}</span>
          </div>
        </div>

        {/* 2048 Board */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative p-3 rounded-2xl bg-[#0e1124] border border-violet-500/30 aspect-square max-w-[360px] mx-auto w-full grid grid-cols-4 gap-2.5 shadow-2xl select-none"
        >
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`rounded-xl flex items-center justify-center font-display font-black text-lg sm:text-xl border transition-all duration-150 ${getTileStyle(
                  val
                )}`}
              >
                {val !== 0 ? val : ''}
              </div>
            ))
          )}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center z-10 animate-fadeIn">
              <span className="text-4xl mb-1">👑</span>
              <h3 className="font-bold text-xl text-white">Game Over!</h3>
              <p className="text-xs text-slate-300 mt-1">Final Score: {score}</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                +{Math.round(score / 10)} Virtual Coins Awarded!
              </p>
              <button
                onClick={restartGame}
                className="mt-4 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* On-screen Mobile D-Pad */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <button
            onClick={() => move('up')}
            className="w-12 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center border border-slate-700 shadow-md text-violet-300"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => move('left')}
              className="w-12 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center border border-slate-700 shadow-md text-violet-300"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => move('down')}
              className="w-12 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center border border-slate-700 shadow-md text-violet-300"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onClick={() => move('right')}
              className="w-12 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center border border-slate-700 shadow-md text-violet-300"
            >
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
          <span className="text-[11px] text-slate-500">Swipe on board or use D-pad</span>
        </div>
      </div>
    </div>
  );
};
