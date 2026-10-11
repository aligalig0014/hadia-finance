import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Dices, Trophy, Award, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

type BetType = 'low' | 'seven' | 'high';

export const DiceChallengeGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound, user, deductStake } = useGame();

  const [die1, setDie1] = useState<number>(3);
  const [die2, setDie2] = useState<number>(4);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [selectedPrediction, setSelectedPrediction] = useState<BetType>('seven');
  const [betStake, setBetStake] = useState<number>(50);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [history, setHistory] = useState<{ d1: number; d2: number; sum: number; win: boolean }[]>([
    { d1: 3, d2: 4, sum: 7, win: true },
    { d1: 1, d2: 5, sum: 6, win: false }
  ]);

  const renderDots = (val: number) => {
    switch (val) {
      case 1:
        return <div className="w-4 h-4 bg-purple-400 rounded-full shadow-sm" />;
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3.5 h-3.5 bg-purple-400 rounded-full" />
            <div className="w-3.5 h-3.5 bg-purple-400 rounded-full self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full self-center" />
            <div className="w-3 h-3 bg-purple-400 rounded-full self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2 gap-2 place-items-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full relative p-2">
            <div className="absolute top-2 left-2 w-3 h-3 bg-purple-400 rounded-full" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full" />
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-purple-400 rounded-full" />
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-400 rounded-full" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2 gap-1.5 place-items-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
          </div>
        );
    }
  };

  const rollDice = () => {
    if (isRolling) return;

    // Check and deduct stake
    const success = deductStake(betStake);
    if (!success) return;

    setIsRolling(true);
    setLastWin(null);
    sounds.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const final1 = Math.floor(Math.random() * 6) + 1;
        const final2 = Math.floor(Math.random() * 6) + 1;
        const sum = final1 + final2;
        setDie1(final1);
        setDie2(final2);
        setIsRolling(false);

        // Win check
        let isWon = false;
        let reward = 0;
        if (selectedPrediction === 'low' && sum < 7) {
          isWon = true;
          reward = betStake * 2; // 2x payout
        } else if (selectedPrediction === 'seven' && sum === 7) {
          isWon = true;
          reward = betStake * 5; // 5x big payout!
        } else if (selectedPrediction === 'high' && sum > 7) {
          isWon = true;
          reward = betStake * 2; // 2x payout
        }

        if (isWon) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          if (newStreak > bestStreak) setBestStreak(newStreak);
          const bonusStreak = (newStreak - 1) * 10;
          const totalCoins = reward + bonusStreak;
          setLastWin(totalCoins);
          sounds.playWin();
          recordGameResult('dice-challenge', sum, totalCoins, `Bet ${betStake} on ${selectedPrediction.toUpperCase()} & rolled ${sum}!`);
        } else {
          setStreak(0);
          setLastWin(0);
          sounds.playTick();
          recordGameResult('dice-challenge', sum, 0, `Bet ${betStake} on ${selectedPrediction.toUpperCase()}, rolled ${sum}`);
        }

        setHistory(prev => [{ d1: final1, d2: final2, sum, win: isWon }, ...prev.slice(0, 7)]);
      }
    }, 80);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-pink-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-pink-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
            Dice Arena
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide text-pink-300">
            Royal Dice
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-pink-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">Current Streak</span>
            </div>
            <span className="font-bold text-base text-orange-400">{streak}x</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-pink-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Best Streak</span>
            </div>
            <span className="font-bold text-base text-amber-400">{bestStreak}x</span>
          </div>
        </div>

        {/* Dice Arena Board */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14122b] to-[#0a0918] border border-pink-500/30 shadow-2xl flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-6">
            {/* Die 1 */}
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-black border-2 border-pink-500/50 shadow-lg flex items-center justify-center transition-transform ${
                isRolling ? 'rotate-12 scale-105 animate-spin' : ''
              }`}
            >
              {renderDots(die1)}
            </div>

            {/* Plus sign */}
            <span className="text-2xl font-bold text-pink-400">+</span>

            {/* Die 2 */}
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-black border-2 border-pink-500/50 shadow-lg flex items-center justify-center transition-transform ${
                isRolling ? '-rotate-12 scale-105 animate-spin' : ''
              }`}
            >
              {renderDots(die2)}
            </div>
          </div>

          {/* Sum Display */}
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-slate-400">Total Sum</span>
            <span className="font-display font-black text-4xl text-pink-400">
              {die1 + die2}
            </span>
          </div>
        </div>

        {/* Result Message */}
        {lastWin !== null && (
          <div
            className={`p-3 rounded-xl text-center text-sm font-bold ${
              lastWin > 0
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            {lastWin > 0 ? `🎉 Correct Prediction! Won +${lastWin} Virtual Coins!` : 'Missed this round. Roll again!'}
          </div>
        )}

        {/* Bet Stake Selector (Paisa Kam / Zyada Krne Wala System) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-pink-500/30 flex flex-col gap-2">
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
                className="w-full text-center py-2 px-3 rounded-xl bg-slate-950 border border-pink-500/40 text-pink-300 font-display font-black text-lg focus:outline-none focus:border-pink-400"
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
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30"
            >
              2X
            </button>
            <button
              type="button"
              onClick={() => setBetStake(Math.max(10, user.virtualCoins))}
              className="py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 text-amber-300 border border-pink-500/50"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Prediction Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-300">Choose Prediction:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { sounds.playClick(); setSelectedPrediction('low'); }}
              className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition border ${
                selectedPrediction === 'low'
                  ? 'bg-pink-600 border-pink-400 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>LOW (2-6)</div>
              <div className="text-[10px] opacity-90 mt-0.5">Pays 2X ({(betStake * 2).toLocaleString()})</div>
            </button>

            <button
              onClick={() => { sounds.playClick(); setSelectedPrediction('seven'); }}
              className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition border ${
                selectedPrediction === 'seven'
                  ? 'bg-amber-500 border-yellow-300 text-slate-950 gold-glow'
                  : 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800'
              }`}
            >
              <div>LUCKY 7</div>
              <div className="text-[10px] font-semibold mt-0.5">Pays 5X ({(betStake * 5).toLocaleString()}) 🔥</div>
            </button>

            <button
              onClick={() => { sounds.playClick(); setSelectedPrediction('high'); }}
              className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition border ${
                selectedPrediction === 'high'
                  ? 'bg-pink-600 border-pink-400 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>HIGH (8-12)</div>
              <div className="text-[10px] opacity-90 mt-0.5">Pays 2X ({(betStake * 2).toLocaleString()})</div>
            </button>
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`w-full py-4 rounded-xl font-display font-black text-xl tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
            isRolling
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white hover:opacity-90 active:scale-95'
          }`}
        >
          <Dices className="w-6 h-6" />
          <span>{isRolling ? 'ROLLING...' : `ROLL DICE (BET ${betStake} COINS)`}</span>
        </button>

        {/* History */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-2 font-medium">Recent Rolls:</span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {history.map((h, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold shrink-0 border ${
                  h.win
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                [{h.d1}+{h.d2}={h.sum}]
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
