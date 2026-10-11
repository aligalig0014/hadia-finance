import React, { useState } from 'react';
import { Heart, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';
import confetti from 'canvas-confetti';

export const SoulmateMeter: React.FC = () => {
  const [tested, setTested] = useState(false);
  const [score, setScore] = useState(100);

  const handleTest = () => {
    romanticAudio.playSparkle();
    setTested(true);
    setScore(1000);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#fb7185', '#fef08a'],
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 sm:p-8 rounded-3xl glass-romantic border border-rose-500/30 text-center shadow-xl">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Celestial Compatibility</span>
      </div>

      <h3 className="font-cursive text-3xl sm:text-5xl text-rose-100">
        Hadia &amp; Ali: Soulmates By Destiny
      </h3>

      <div className="my-6 flex items-center justify-center gap-4 sm:gap-8">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-800 to-pink-600 border-2 border-rose-300 shadow-lg flex items-center justify-center text-white font-cursive text-2xl sm:text-3xl">
            Hadia
          </div>
          <span className="text-xs font-bold text-rose-300 tracking-wider uppercase mt-1 block">
            The Queen
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-rose-500 text-rose-500 animate-heartbeat" />
          <span className="font-cursive text-xl text-amber-300 mt-1">&amp;</span>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-indigo-900 to-rose-700 border-2 border-amber-300 shadow-lg flex items-center justify-center text-white font-cursive text-2xl sm:text-3xl">
            Ali
          </div>
          <span className="text-xs font-bold text-amber-300 tracking-wider uppercase mt-1 block">
            The King
          </span>
        </div>
      </div>

      {/* Score Meter */}
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-black/40 border border-rose-500/20 mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-rose-200 mb-2">
          <span>Soulmate Score</span>
          <span className="text-amber-300 text-sm font-mono">{score}% Infinite Love</span>
        </div>
        <div className="w-full h-3 rounded-full bg-rose-950 overflow-hidden p-0.5 border border-rose-500/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-1000"
            style={{ width: `${Math.min(100, score)}%` }}
          />
        </div>
        <p className="text-xs text-rose-300/80 font-serif-luxury italic mt-2.5">
          "Result: Written in the stars before time began. Irreplaceable and infinite."
        </p>
      </div>

      {!tested ? (
        <button
          onClick={handleTest}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg transition active:scale-95"
        >
          💖 Calculate Our Eternal Bond 💖
        </button>
      ) : (
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-4 py-1.5 rounded-full border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Match Verified: Soulmates in this Life &amp; Jannah</span>
        </div>
      )}
    </div>
  );
};
