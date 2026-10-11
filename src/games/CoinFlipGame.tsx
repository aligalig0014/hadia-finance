import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Coins, Flame, Trophy, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

export const CoinFlipGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound, user, deductStake } = useGame();

  const [side, setSide] = useState<'heads' | 'tails'>('heads');
  const [userChoice, setUserChoice] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [betStake, setBetStake] = useState<number>(50);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [resultMsg, setResultMsg] = useState<{ text: string; won: boolean; coins: number } | null>(null);

  const flipCoin = () => {
    if (isFlipping) return;

    // Deduct stake
    const success = deductStake(betStake);
    if (!success) return;

    setIsFlipping(true);
    setResultMsg(null);
    sounds.playCoin();

    const outcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
    const flips = 5 + Math.floor(Math.random() * 3); // 5 to 7 half-rotations
    const newRot = rotation + flips * 180 + (outcome === 'heads' ? 0 : 180);

    setRotation(newRot);

    setTimeout(() => {
      setSide(outcome);
      setIsFlipping(false);

      if (userChoice === outcome) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        const coinsAwarded = Math.round(betStake * 2 + (newStreak - 1) * 15);
        setResultMsg({
          text: `Awesome! It landed on ${outcome.toUpperCase()}!`,
          won: true,
          coins: coinsAwarded
        });
        sounds.playWin();
        recordGameResult('coin-flip', newStreak, coinsAwarded, `Bet ${betStake} on ${userChoice.toUpperCase()} & won ${coinsAwarded} Coins!`);
      } else {
        setStreak(0);
        setResultMsg({
          text: `Landed on ${outcome.toUpperCase()}. Better luck next flip!`,
          won: false,
          coins: 0
        });
        sounds.playTick();
        recordGameResult('coin-flip', 0, 0, `Bet ${betStake} on ${userChoice.toUpperCase()}, landed ${outcome.toUpperCase()}`);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-amber-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Mini Arcade
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide gold-gradient-text">
            Royal Coin Flip
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col items-center gap-6">
        {/* Streak Bar */}
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Flip Streak</span>
            </div>
            <span className="font-bold text-base text-amber-400">{streak}x</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Best Streak</span>
            </div>
            <span className="font-bold text-base text-yellow-400">{bestStreak}x</span>
          </div>
        </div>

        {/* 3D Animated Coin */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-4 border-yellow-200 gold-glow flex items-center justify-center transition-transform duration-[1200ms] shadow-2xl relative"
            style={{
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-800/60 flex flex-col items-center justify-center">
              <span className="text-3xl">👑</span>
              <span className="font-display font-black text-xs text-amber-950 uppercase tracking-widest mt-1">
                {side}
              </span>
            </div>
          </div>
        </div>

        {/* Result Message */}
        {resultMsg && (
          <div
            className={`w-full p-3.5 rounded-xl text-center font-bold text-sm ${
              resultMsg.won
                ? 'bg-amber-950/70 border border-amber-500/50 text-amber-300 gold-glow animate-bounce'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            <div>{resultMsg.text}</div>
            {resultMsg.won && (
              <div className="text-xs text-emerald-400 mt-1 font-semibold">
                +{resultMsg.coins} Virtual Coins Added!
              </div>
            )}
          </div>
        )}

        {/* Bet Stake Selector (Paisa Kam / Zyada Krne Wala System) */}
        <div className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Bet Stake (Paisa Chunein):</span>
            <span className="font-mono font-bold text-amber-400">
              Balance: {user.virtualCoins.toLocaleString()} Coins
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBetStake(b => Math.max(10, b - 10))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg border border-slate-700 flex items-center justify-center transition"
              title="Kam Karein (-10)"
            >
              -
            </button>

            <div className="flex-1 relative">
              <input
                type="number"
                min={10}
                max={user.virtualCoins}
                value={betStake}
                onChange={e => setBetStake(Math.max(10, Number(e.target.value)))}
                className="w-full text-center py-2 px-3 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-display font-black text-lg focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase pointer-events-none">
                Coins
              </span>
            </div>

            <button
              type="button"
              onClick={() => setBetStake(b => Math.min(user.virtualCoins, b + 10))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg border border-slate-700 flex items-center justify-center transition"
              title="Zyada Karein (+10)"
            >
              +
            </button>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-6 gap-1.5 pt-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setBetStake(10)}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              MIN
            </button>
            <button
              type="button"
              onClick={() => setBetStake(50)}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              50
            </button>
            <button
              type="button"
              onClick={() => setBetStake(100)}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              100
            </button>
            <button
              type="button"
              onClick={() => setBetStake(b => Math.max(10, Math.floor(b / 2)))}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30"
            >
              1/2
            </button>
            <button
              type="button"
              onClick={() => setBetStake(b => Math.min(user.virtualCoins, b * 2))}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30"
            >
              2X
            </button>
            <button
              type="button"
              onClick={() => setBetStake(Math.max(10, user.virtualCoins))}
              className="py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Prediction Selector */}
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-300">Choose Your Side:</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { sounds.playClick(); setUserChoice('heads'); }}
              className={`py-3.5 rounded-xl font-bold text-sm transition border flex items-center justify-center gap-2 ${
                userChoice === 'heads'
                  ? 'bg-amber-500 border-yellow-300 text-slate-950 gold-glow'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>👑</span>
              <span>HEADS</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setUserChoice('tails'); }}
              className={`py-3.5 rounded-xl font-bold text-sm transition border flex items-center justify-center gap-2 ${
                userChoice === 'tails'
                  ? 'bg-amber-500 border-yellow-300 text-slate-950 gold-glow'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🦁</span>
              <span>TAILS</span>
            </button>
          </div>
        </div>

        {/* Flip Button */}
        <button
          onClick={flipCoin}
          disabled={isFlipping}
          className={`w-full py-4 rounded-xl font-display font-black text-xl tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
            isFlipping
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 gold-glow active:scale-95'
          }`}
        >
          <Coins className="w-6 h-6 text-slate-950" />
          <span>{isFlipping ? 'FLIPPING...' : 'FLIP COIN'}</span>
        </button>
      </div>
    </div>
  );
};
