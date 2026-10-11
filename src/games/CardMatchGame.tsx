import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Layers, Trophy, Flame, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface PlayingCard {
  val: number; // 2..14
  name: string;
  suit: '♠' | '♥' | '♦' | '♣';
  color: 'red' | 'black';
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const CARD_NAMES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const CardMatchGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound, user, deductStake } = useGame();

  const getRandomCard = (): PlayingCard => {
    const val = Math.floor(Math.random() * 13) + 2; // 2 to 14
    const name = CARD_NAMES[val - 2];
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
    return { val, name, suit, color };
  };

  const [currentCard, setCurrentCard] = useState<PlayingCard>(() => getRandomCard());
  const [nextCard, setNextCard] = useState<PlayingCard | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [betStake, setBetStake] = useState<number>(50);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_card_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [coinsPot, setCoinsPot] = useState<number>(0);
  const [resultMsg, setResultMsg] = useState<{ text: string; won: boolean } | null>(null);

  const makeGuess = (guess: 'higher' | 'lower') => {
    if (isFlipping) return;

    // If starting a fresh streak, deduct stake
    if (streak === 0) {
      const success = deductStake(betStake);
      if (!success) return;
    }

    setIsFlipping(true);
    setResultMsg(null);
    sounds.playTick();

    const drawn = getRandomCard();
    setNextCard(drawn);

    setTimeout(() => {
      setIsFlipping(false);
      let isCorrect = false;

      if (guess === 'higher' && drawn.val >= currentCard.val) {
        isCorrect = true;
      } else if (guess === 'lower' && drawn.val <= currentCard.val) {
        isCorrect = true;
      }

      if (isCorrect) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        const pot = Math.round(betStake * (1 + nextStreak * 0.8));
        setCoinsPot(pot);

        if (nextStreak > bestStreak) {
          setBestStreak(nextStreak);
          localStorage.setItem('ali_king_card_best', String(nextStreak));
        }

        sounds.playCoin();
        setResultMsg({
          text: `Correct! ${drawn.name}${drawn.suit} is ${guess.toUpperCase()}! Pot: ${pot} Coins`,
          won: true
        });
        setCurrentCard(drawn);
      } else {
        // Lost
        sounds.playCrash();
        setResultMsg({
          text: `Bust! ${drawn.name}${drawn.suit} wasn't ${guess.toUpperCase()}. Streak broke!`,
          won: false
        });
        recordGameResult('card-match', streak, 0, `Bet ${betStake}, streak broke on ${drawn.name}${drawn.suit}`);
        setStreak(0);
        setCoinsPot(0);
        setCurrentCard(drawn);
      }
    }, 700);
  };

  const cashOutPot = () => {
    if (coinsPot <= 0) return;
    const finalPot = coinsPot;
    sounds.playWin();
    recordGameResult('card-match', streak, finalPot, `Cashed out ${finalPot} virtual coins on ${streak}x streak!`);
    setResultMsg({
      text: `🎉 Cashed out ${finalPot} virtual coins to your wallet!`,
      won: true
    });
    setStreak(0);
    setCoinsPot(0);
    setCurrentCard(getRandomCard());
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c1020]/90 backdrop-blur-md border-b border-purple-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Duel
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide purple-gradient-text">
            High-Low Duel
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-4">
        {/* Streak Ribbon */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Streak</span>
            </div>
            <span className="font-display font-black text-base text-purple-400">{streak}x</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col items-center">
            <span className="text-[11px] text-slate-400">Current Pot</span>
            <span className="font-display font-black text-base text-amber-400 font-mono">🪙 {coinsPot}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-violet-500/30 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Best</span>
            </div>
            <span className="font-display font-black text-base text-amber-300 font-mono">{bestStreak}x</span>
          </div>
        </div>

        {/* Playing Card Stage */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#170e28] to-[#0a0715] border border-purple-500/30 flex items-center justify-center gap-5 shadow-2xl">
          {/* Current Visible Card */}
          <div className="w-28 h-40 sm:w-32 sm:h-44 rounded-2xl bg-slate-100 border-2 border-purple-400 shadow-2xl flex flex-col justify-between p-3 select-none transition-transform">
            <div className={`font-black text-lg ${currentCard.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
              <div>{currentCard.name}</div>
              <div className="text-base leading-none">{currentCard.suit}</div>
            </div>

            <div className={`text-center font-black text-4xl ${currentCard.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
              {currentCard.suit}
            </div>

            <div className={`font-black text-lg self-end rotate-180 ${currentCard.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
              <div>{currentCard.name}</div>
              <div className="text-base leading-none">{currentCard.suit}</div>
            </div>
          </div>

          {/* Versus Arrow */}
          <div className="text-purple-400 font-bold text-xs uppercase tracking-wider">
            VS
          </div>

          {/* Next Card Slot */}
          <div
            className={`w-28 h-40 sm:w-32 sm:h-44 rounded-2xl border-2 border-dashed border-purple-500/40 flex items-center justify-center p-3 select-none ${
              isFlipping
                ? 'bg-purple-900/50 animate-pulse'
                : 'bg-purple-950/30'
            }`}
          >
            <span className="text-3xl text-purple-400">❓</span>
          </div>
        </div>

        {/* Message Banner */}
        {resultMsg && (
          <div
            className={`p-3 rounded-xl text-center font-bold text-xs ${
              resultMsg.won
                ? 'bg-purple-950/80 border border-purple-500/40 text-purple-200'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            {resultMsg.text}
          </div>
        )}

        {/* Bet Stake Selector (Paisa Kam / Zyada Krne Wala System) */}
        {streak === 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Initial Bet Stake (Paisa Chunein):</span>
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
                  className="w-full text-center py-2 px-3 rounded-xl bg-slate-950 border border-purple-500/40 text-purple-300 font-display font-black text-lg focus:outline-none focus:border-purple-400"
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
                className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30"
              >
                2X
              </button>
              <button
                type="button"
                onClick={() => setBetStake(Math.max(10, user.virtualCoins))}
                className="py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-amber-300 border border-purple-500/50"
              >
                MAX
              </button>
            </div>
          </div>
        )}

        {/* Guess Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => makeGuess('higher')}
            disabled={isFlipping}
            className="py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 active:scale-95 font-display font-black text-base text-white shadow-lg flex items-center justify-center gap-2 transition"
          >
            <ArrowUp className="w-5 h-5" />
            <span>HIGHER ⬆️</span>
          </button>

          <button
            onClick={() => makeGuess('lower')}
            disabled={isFlipping}
            className="py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 active:scale-95 font-display font-black text-base text-white shadow-lg flex items-center justify-center gap-2 transition"
          >
            <ArrowDown className="w-5 h-5" />
            <span>LOWER ⬇️</span>
          </button>
        </div>

        {/* Cash Out Pot Button */}
        {coinsPot > 0 && (
          <button
            onClick={cashOutPot}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-display font-black text-base shadow-lg gold-glow active:scale-95 transition flex items-center justify-center gap-2 animate-bounce"
          >
            <Award className="w-5 h-5" />
            <span>CASH OUT POT (+{coinsPot} COINS)</span>
          </button>
        )}
      </div>
    </div>
  );
};
