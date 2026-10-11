import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Hash, RefreshCw, Trophy, Flame, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

export const NumberGuessGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound } = useGame();

  const [targetNumber, setTargetNumber] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
  const [guessInput, setGuessInput] = useState<number>(50);
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts] = useState<number>(7);
  const [guesses, setGuesses] = useState<{ num: number; clue: string; diff: number }[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [coinsWon, setCoinsWon] = useState<number>(0);

  const startNewGame = () => {
    sounds.playClick();
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuessInput(50);
    setAttempts(0);
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setCoinsWon(0);
  };

  const handleGuess = () => {
    if (gameOver) return;
    const num = Number(guessInput);
    if (isNaN(num) || num < 1 || num > 100) return;

    sounds.playClick();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const diff = Math.abs(num - targetNumber);
    let clue = '';

    if (num === targetNumber) {
      // Won!
      let coins = 50;
      if (newAttempts === 1) coins = 500;
      else if (newAttempts <= 3) coins = 200;
      else if (newAttempts <= 5) coins = 100;

      setWon(true);
      setGameOver(true);
      setCoinsWon(coins);
      sounds.playWin();
      recordGameResult('number-guess', 100 - newAttempts * 10, coins, `Guessed #${num} in ${newAttempts} attempts!`);
      clue = 'EXACT MATCH! 🎯';
    } else {
      if (diff <= 5) clue = num < targetNumber ? 'BOILING HOT! (Higher ⬆️)' : 'BOILING HOT! (Lower ⬇️)';
      else if (diff <= 15) clue = num < targetNumber ? 'WARM (Higher ⬆️)' : 'WARM (Lower ⬇️)';
      else if (diff <= 30) clue = num < targetNumber ? 'COLD (Higher ⬆️)' : 'COLD (Lower ⬇️)';
      else clue = num < targetNumber ? 'FREEZING! (Much Higher ⬆️)' : 'FREEZING! (Much Lower ⬇️)';

      if (newAttempts >= maxAttempts) {
        setGameOver(true);
        sounds.playCrash();
        recordGameResult('number-guess', 0, 0, `Ran out of attempts (Secret was ${targetNumber})`);
      } else {
        sounds.playTick();
      }
    }

    setGuesses(prev => [{ num, clue, diff }, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-emerald-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Puzzle
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-emerald-300">
            Cipher Secret
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        {/* Status Tracker */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Attempts Left</span>
            </div>
            <span className="font-bold text-base text-emerald-400">
              {maxAttempts - attempts} / {maxAttempts}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Range</span>
            </div>
            <span className="font-bold text-base text-amber-400">1 to 100</span>
          </div>
        </div>

        {/* Main Guess Area */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1e1e] to-[#0a1215] border border-emerald-500/30 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-300 text-center font-medium">
            Find the secret cipher number between 1 and 100!
          </p>

          <div className="w-28 h-28 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400/60 shadow-lg flex items-center justify-center">
            <span className="font-display font-black text-5xl text-emerald-300">
              {gameOver && !won ? targetNumber : guessInput}
            </span>
          </div>

          {!gameOver ? (
            <div className="w-full flex flex-col gap-3">
              <input
                type="range"
                min="1"
                max="100"
                value={guessInput}
                onChange={e => setGuessInput(Number(e.target.value))}
                className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setGuessInput(v => Math.max(1, v - 5))}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                >
                  -5
                </button>
                <button
                  onClick={() => setGuessInput(v => Math.max(1, v - 1))}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                >
                  -1
                </button>
                <span className="text-xs text-slate-400 font-mono">Current: {guessInput}</span>
                <button
                  onClick={() => setGuessInput(v => Math.min(100, v + 1))}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                >
                  +1
                </button>
                <button
                  onClick={() => setGuessInput(v => Math.min(100, v + 5))}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                >
                  +5
                </button>
              </div>

              <button
                onClick={handleGuess}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-display font-bold text-lg text-slate-950 active:scale-95 transition shadow-lg mt-1"
              >
                SUBMIT GUESS ({guessInput})
              </button>
            </div>
          ) : (
            <div className="w-full text-center flex flex-col items-center gap-3">
              {won ? (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 w-full animate-bounce">
                  <p className="font-bold text-base">🎉 Incredible! You cracked the cipher!</p>
                  <p className="text-xs font-semibold text-amber-400 mt-1">
                    +{coinsWon} Virtual Coins Awarded!
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 w-full">
                  <p className="font-bold text-sm">Out of attempts!</p>
                  <p className="text-xs text-slate-300 mt-0.5">The secret number was {targetNumber}.</p>
                </div>
              )}

              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-slate-950 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* Guesses Log */}
        {guesses.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-medium">Clue History:</span>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {guesses.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 text-xs border border-slate-700"
                >
                  <span className="font-mono font-bold text-emerald-400">#{g.num}</span>
                  <span className="font-medium text-slate-300">{g.clue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
