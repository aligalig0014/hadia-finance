import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, Clock, Trophy, Flame, Shield, Coins, Sparkles, RefreshCw, Award, Users } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

interface Card {
  val: number; // 2..14 (14 is Ace)
  name: string;
  suit: '♠' | '♥' | '♦' | '♣';
  color: 'red' | 'black';
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const CARD_NAMES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

interface HandResult {
  rank: number;
  label: string;
  highVals: number[];
}

interface TableBot {
  id: string;
  name: string;
  avatar: string;
  chips: number;
  betAmount: number;
  betSide: 'player' | 'dealer' | 'tie';
  status: 'chaal' | 'pack';
  cards: Card[];
  hand?: HandResult;
}

export const TeenPattiGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound, user, deductStake, setIsDepositModalOpen } = useGame();

  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'showdown' | 'ended'>('betting');
  const [countdown, setCountdown] = useState<number>(10);
  const [betSide, setBetSide] = useState<'player' | 'dealer' | 'tie'>('player');
  const [betStake, setBetStake] = useState<number>(50);

  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [revealPlayer, setRevealPlayer] = useState<boolean>(false);
  const [revealDealer, setRevealDealer] = useState<boolean>(false);

  // Computer Table Players
  const [tableBots, setTableBots] = useState<TableBot[]>([
    { id: 'bot-1', name: 'Sultan_VIP', avatar: '👳‍♂️', chips: 3500, betAmount: 50, betSide: 'player', status: 'chaal', cards: [] },
    { id: 'bot-2', name: 'Zara_Queen', avatar: '🧕', chips: 4800, betAmount: 100, betSide: 'player', status: 'chaal', cards: [] },
    { id: 'bot-3', name: 'Farhan_Pro', avatar: '🧔', chips: 2200, betAmount: 50, betSide: 'dealer', status: 'chaal', cards: [] },
    { id: 'bot-4', name: 'Kabir_Boss', avatar: '🤴', chips: 5400, betAmount: 100, betSide: 'dealer', status: 'chaal', cards: [] }
  ]);

  const [playerHand, setPlayerHand] = useState<HandResult | null>(null);
  const [dealerHand, setDealerHand] = useState<HandResult | null>(null);
  const [winner, setWinner] = useState<'player' | 'dealer' | 'tie' | null>(null);
  const [payoutWon, setPayoutWon] = useState<number>(0);
  const [history, setHistory] = useState<('P' | 'D' | 'T')[]>(['P', 'D', 'P', 'P', 'D']);
  const [roundNumber, setRoundNumber] = useState<number>(1);

  // Helper to draw random card
  const drawCard = (exclude: Card[]): Card => {
    while (true) {
      const val = Math.floor(Math.random() * 13) + 2;
      const name = CARD_NAMES[val - 2];
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
      const exists = exclude.some(c => c.val === val && c.suit === suit);
      if (!exists) return { val, name, suit, color };
    }
  };

  // Evaluate 3-card hand in Teen Patti
  const evaluateTeenPatti = (cards: Card[]): HandResult => {
    if (!cards || cards.length < 3) return { rank: 1, label: 'High Card', highVals: [10] };
    const sorted = [...cards].sort((a, b) => b.val - a.val);
    const [c1, c2, c3] = sorted;
    const sameSuit = c1.suit === c2.suit && c2.suit === c3.suit;

    // Check Trail / Trio (Three of a kind)
    if (c1.val === c2.val && c2.val === c3.val) {
      return { rank: 6, label: `Trail of ${c1.name}s (Trio)`, highVals: [c1.val] };
    }

    // Check Sequence (A-K-Q, K-Q-J, ... or A-2-3)
    const isNormalSeq = c1.val === c2.val + 1 && c2.val === c3.val + 1;
    const isAcesLowSeq = c1.val === 14 && c2.val === 3 && c3.val === 2; // A-2-3
    const isSeq = isNormalSeq || isAcesLowSeq;

    if (isSeq && sameSuit) {
      return { rank: 5, label: 'Pure Sequence (Straight Flush)', highVals: [c1.val] };
    }

    if (isSeq) {
      return { rank: 4, label: 'Sequence (Run)', highVals: [c1.val] };
    }

    if (sameSuit) {
      return { rank: 3, label: 'Color (Flush)', highVals: [c1.val, c2.val, c3.val] };
    }

    // Check Pair
    if (c1.val === c2.val) {
      return { rank: 2, label: `Pair of ${c1.name}s`, highVals: [c1.val, c3.val] };
    }
    if (c2.val === c3.val) {
      return { rank: 2, label: `Pair of ${c2.name}s`, highVals: [c2.val, c1.val] };
    }
    if (c1.val === c3.val) {
      return { rank: 2, label: `Pair of ${c1.name}s`, highVals: [c1.val, c2.val] };
    }

    return { rank: 1, label: `High Card (${c1.name})`, highVals: [c1.val, c2.val, c3.val] };
  };

  const compareHands = (h1: HandResult, h2: HandResult): number => {
    if (h1.rank !== h2.rank) return h1.rank > h2.rank ? 1 : -1;
    for (let i = 0; i < h1.highVals.length; i++) {
      if (h1.highVals[i] !== h2.highVals[i]) {
        return h1.highVals[i] > h2.highVals[i] ? 1 : -1;
      }
    }
    return 0;
  };

  // 10-Second Bet Countdown loop
  useEffect(() => {
    if (gameState !== 'betting') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(c => c - 1);
        if (countdown <= 3) {
          sounds.playTick();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      dealCards();
    }
  }, [gameState, countdown]);

  const startNewRound = () => {
    setGameState('betting');
    setCountdown(10);
    setPlayerCards([]);
    setDealerCards([]);
    setRevealPlayer(false);
    setRevealDealer(false);
    setPlayerHand(null);
    setDealerHand(null);
    setWinner(null);
    setPayoutWon(0);
    setRoundNumber(r => r + 1);

    // Reset bot states with fresh stakes
    setTableBots(prev =>
      prev.map(b => ({
        ...b,
        status: Math.random() < 0.15 ? 'pack' : 'chaal',
        betAmount: [50, 100, 200][Math.floor(Math.random() * 3)],
        cards: [],
        hand: undefined
      }))
    );
  };

  const dealCards = () => {
    const ok = deductStake(betStake);
    if (!ok) {
      setGameState('betting');
      setCountdown(10);
      return;
    }

    setGameState('dealing');
    sounds.playCardDeal();

    // Deal 3 cards to Player, 3 to Dealer, and cards to bots
    const drawn: Card[] = [];
    const p1 = drawCard(drawn); drawn.push(p1);
    const d1 = drawCard(drawn); drawn.push(d1);
    const p2 = drawCard(drawn); drawn.push(p2);
    const d2 = drawCard(drawn); drawn.push(d2);
    const p3 = drawCard(drawn); drawn.push(p3);
    const d3 = drawCard(drawn); drawn.push(d3);

    // Deal 3 cards for each bot
    const updatedBots = tableBots.map(b => {
      const bc1 = drawCard(drawn); drawn.push(bc1);
      const bc2 = drawCard(drawn); drawn.push(bc2);
      const bc3 = drawCard(drawn); drawn.push(bc3);
      const bCards = [bc1, bc2, bc3];
      return {
        ...b,
        cards: bCards,
        hand: evaluateTeenPatti(bCards)
      };
    });

    setTableBots(updatedBots);
    setPlayerCards([p1, p2, p3]);
    setDealerCards([d1, d2, d3]);

    // Flip Player cards first
    setTimeout(() => {
      setRevealPlayer(true);
      sounds.playCardDeal();
      const pHand = evaluateTeenPatti([p1, p2, p3]);
      setPlayerHand(pHand);
    }, 1200);

    // Flip Dealer cards
    setTimeout(() => {
      setRevealDealer(true);
      sounds.playCardDeal();
      const dHand = evaluateTeenPatti([d1, d2, d3]);
      setDealerHand(dHand);
      setGameState('showdown');

      // Determine outcome
      const pHandVal = evaluateTeenPatti([p1, p2, p3]);
      const cmp = compareHands(pHandVal, dHand);
      let winOutcome: 'player' | 'dealer' | 'tie' = 'tie';
      if (cmp > 0) winOutcome = 'player';
      else if (cmp < 0) winOutcome = 'dealer';

      setWinner(winOutcome);
      setHistory(prev => [(winOutcome === 'player' ? 'P' : winOutcome === 'dealer' ? 'D' : 'T'), ...prev.slice(0, 9)]);

      let wonAmount = 0;
      if (betSide === winOutcome) {
        if (winOutcome === 'tie') {
          wonAmount = betStake * 9;
        } else {
          wonAmount = Math.round(betStake * 1.95);
        }
        setPayoutWon(wonAmount);
        sounds.playWin();
        recordGameResult('teen-patti', wonAmount, wonAmount, `Teen Patti Win (${winOutcome.toUpperCase()}) with ${pHandVal.label}!`);
      } else {
        setPayoutWon(0);
        sounds.playCrash();
        recordGameResult('teen-patti', 0, 0, `Teen Patti round lost to ${winOutcome.toUpperCase()}`);
      }
      setGameState('ended');
    }, 2500);
  };

  // Total Pot calculation: Player stake + bot bets
  const totalTablePot = betStake + tableBots.reduce((sum, b) => sum + (b.status === 'chaal' ? b.betAmount : 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#060814] text-white pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0a0f24]/90 backdrop-blur-md border-b border-amber-500/20">
        <button
          onClick={closeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            3 Patti Live (5 Players)
          </span>
          <h2 className="font-brand font-black text-base tracking-wide gold-gradient-text">
            Royal Teen Patti Pro
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-3.5 pt-3 flex flex-col gap-3">
        {/* Top 10-Second Countdown & History Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#18132d] to-[#0d1024] border border-amber-500/30 shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg border ${
              countdown <= 3 && gameState === 'betting'
                ? 'bg-red-500/20 border-red-400 text-red-400 animate-pulse'
                : 'bg-amber-500/20 border-amber-400 text-amber-300'
            }`}>
              {gameState === 'betting' ? `${countdown}s` : '🔒'}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                {gameState === 'betting' ? 'Betting Open' : gameState === 'dealing' ? 'Dealing Cards' : 'Round Result'}
              </span>
              <span className="text-xs font-bold text-white">
                {gameState === 'betting' ? `Bet Time: ${countdown}s Left` : 'Showdown'}
              </span>
            </div>
          </div>

          {/* History Pills */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium mr-1">Rnd #{roundNumber}:</span>
            {history.slice(0, 5).map((h, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center border shadow-sm ${
                  h === 'P'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                    : h === 'D'
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                    : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Visual 10-Second Countdown Meter */}
        <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden border border-amber-500/20 p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              countdown <= 3
                ? 'bg-gradient-to-r from-red-500 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
            }`}
            style={{ width: gameState === 'betting' ? `${(countdown / 10) * 100}%` : '100%' }}
          />
        </div>

        {/* Royal Green Felt Card Table with 5 Seats (Computer Players + User) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0e3b23] via-[#092b18] to-[#061e11] border-4 border-[#c59b27] shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-3.5 flex flex-col justify-between min-h-[420px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0,transparent_70%)] pointer-events-none" />

          {/* TOP ROW: Computer Players 1 & 2 flanking Dealer */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            {/* Bot 1: Sultan_VIP */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-yellow-400/60 flex items-center justify-center text-base shadow">
                  {tableBots[0].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-emerald-600 text-[8px] font-bold text-white">
                  {tableBots[0].status === 'chaal' ? 'Chaal' : 'Pack'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-yellow-200 mt-1">{tableBots[0].name}</span>
              <span className="text-[9px] text-slate-300 font-mono">🪙 {tableBots[0].betAmount}</span>
            </div>

            {/* Dealer's Cards (Center) */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest bg-black/50 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                  Dealer
                </span>
                {dealerHand && revealDealer && (
                  <span className="text-[9px] font-bold text-amber-200 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/40">
                    {dealerHand.label}
                  </span>
                )}
              </div>

              {/* 3 Dealer Cards */}
              <div className="flex items-center justify-center gap-1.5">
                {[0, 1, 2].map(idx => {
                  const card = dealerCards[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-14 h-20 sm:w-16 sm:h-24 rounded-lg border-2 shadow-xl flex flex-col justify-between p-1.5 select-none transition-all duration-500 transform ${
                        revealDealer && card
                          ? 'bg-slate-100 border-slate-300 rotate-0 scale-100'
                          : 'bg-gradient-to-br from-red-800 to-purple-900 border-amber-400 -rotate-2 scale-95'
                      }`}
                    >
                      {revealDealer && card ? (
                        <>
                          <div className={`font-black text-xs leading-none ${card.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
                            <div>{card.name}</div>
                            <div className="text-[10px]">{card.suit}</div>
                          </div>
                          <div className={`text-center font-black text-lg ${card.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
                            {card.suit}
                          </div>
                          <div className={`font-black text-xs leading-none self-end rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
                            <div>{card.name}</div>
                            <div className="text-[10px]">{card.suit}</div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full rounded border border-yellow-400/30 flex items-center justify-center">
                          <span className="text-lg">👑</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bot 2: Zara_Queen */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-yellow-400/60 flex items-center justify-center text-base shadow">
                  {tableBots[1].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-emerald-600 text-[8px] font-bold text-white">
                  {tableBots[1].status === 'chaal' ? 'Chaal' : 'Pack'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-yellow-200 mt-1">{tableBots[1].name}</span>
              <span className="text-[9px] text-slate-300 font-mono">🪙 {tableBots[1].betAmount}</span>
            </div>
          </div>

          {/* CENTER: Table Pot & Match Status */}
          <div className="relative z-10 py-1.5 flex flex-col items-center justify-center text-center">
            <div className="mb-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-yellow-500/50 text-xs font-black text-amber-300 shadow-md">
              <span>🪙</span>
              <span>Total Table Pot: {totalTablePot.toLocaleString()} Coins</span>
            </div>

            {winner ? (
              <div className="px-5 py-2 rounded-2xl bg-black/85 backdrop-blur-md border-2 border-amber-400 gold-glow animate-bounce">
                <span className="text-xs uppercase tracking-widest font-black text-amber-300">
                  {winner === 'tie' ? '🤝 MATCH TIED!' : `👑 ${winner.toUpperCase()} WINS!`}
                </span>
                {payoutWon > 0 && (
                  <p className="text-sm font-black text-emerald-400 mt-0.5">
                    +{payoutWon.toLocaleString()} Virtual Coins Won!
                  </p>
                )}
              </div>
            ) : gameState === 'betting' ? (
              <div className="px-4 py-1 rounded-full bg-black/60 border border-yellow-500/40 text-yellow-300 text-xs font-bold animate-pulse">
                All players placing bets ({countdown}s)!
              </div>
            ) : (
              <div className="px-4 py-1 rounded-full bg-black/60 border border-yellow-500/40 text-yellow-300 text-xs font-bold">
                Dealing cards to all seats...
              </div>
            )}
          </div>

          {/* BOTTOM ROW: Bot 3 + YOU (Player) + Bot 4 */}
          <div className="relative z-10 flex items-end justify-between gap-2">
            {/* Bot 3: Farhan_Pro */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-yellow-400/60 flex items-center justify-center text-base shadow">
                  {tableBots[2].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-emerald-600 text-[8px] font-bold text-white">
                  {tableBots[2].status === 'chaal' ? 'Chaal' : 'Pack'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-yellow-200 mt-1">{tableBots[2].name}</span>
              <span className="text-[9px] text-slate-300 font-mono">🪙 {tableBots[2].betAmount}</span>
            </div>

            {/* Player's Cards (Center) */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest bg-black/50 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                  YOU (Player)
                </span>
                {playerHand && revealPlayer && (
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    {playerHand.label}
                  </span>
                )}
              </div>

              {/* 3 Player Cards */}
              <div className="flex items-center justify-center gap-1.5">
                {[0, 1, 2].map(idx => {
                  const card = playerCards[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-16 h-24 sm:w-18 sm:h-28 rounded-xl border-2 shadow-2xl flex flex-col justify-between p-1.5 select-none transition-all duration-500 transform ${
                        revealPlayer && card
                          ? 'bg-slate-100 border-amber-400 rotate-0 scale-100 gold-glow'
                          : 'bg-gradient-to-br from-indigo-900 to-purple-950 border-amber-400/80 rotate-1 scale-95'
                      }`}
                    >
                      {revealPlayer && card ? (
                        <>
                          <div className={`font-black text-xs leading-none ${card.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
                            <div>{card.name}</div>
                            <div className="text-[10px]">{card.suit}</div>
                          </div>
                          <div className={`text-center font-black text-xl ${card.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
                            {card.suit}
                          </div>
                          <div className={`font-black text-xs leading-none self-end rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-slate-950'}`}>
                            <div>{card.name}</div>
                            <div className="text-[10px]">{card.suit}</div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full rounded border border-yellow-400/30 flex items-center justify-center">
                          <span className="text-xl">⚡</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bot 4: Kabir_Boss */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-yellow-400/60 flex items-center justify-center text-base shadow">
                  {tableBots[3].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-emerald-600 text-[8px] font-bold text-white">
                  {tableBots[3].status === 'chaal' ? 'Chaal' : 'Pack'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-yellow-200 mt-1">{tableBots[3].name}</span>
              <span className="text-[9px] text-slate-300 font-mono">🪙 {tableBots[3].betAmount}</span>
            </div>
          </div>
        </div>

        {/* Bet Selection Area (Player / Dealer / Tie) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={gameState !== 'betting'}
            onClick={() => { sounds.playClick(); setBetSide('player'); }}
            className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
              betSide === 'player'
                ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow-lg scale-102 ring-2 ring-blue-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs uppercase text-white">PLAYER</span>
            <span className="text-[10px] text-blue-400 font-extrabold mt-0.5">Pays 1:1.95</span>
          </button>

          <button
            type="button"
            disabled={gameState !== 'betting'}
            onClick={() => { sounds.playClick(); setBetSide('tie'); }}
            className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
              betSide === 'tie'
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg scale-102 ring-2 ring-emerald-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs uppercase text-amber-300">TIE (BARABAR)</span>
            <span className="text-[10px] text-emerald-400 font-extrabold mt-0.5">Pays 1:9.00 🔥</span>
          </button>

          <button
            type="button"
            disabled={gameState !== 'betting'}
            onClick={() => { sounds.playClick(); setBetSide('dealer'); }}
            className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
              betSide === 'dealer'
                ? 'bg-rose-600/30 border-rose-400 text-rose-200 shadow-lg scale-102 ring-2 ring-rose-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs uppercase text-white">DEALER</span>
            <span className="text-[10px] text-rose-400 font-extrabold mt-0.5">Pays 1:1.95</span>
          </button>
        </div>

        {/* Bet Stake Selector */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Bet Stake (Paisa Chunein):</span>
            <span className="font-mono font-bold text-amber-400">
              Balance: {user.virtualCoins.toLocaleString()} Coins
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(b => Math.max(10, b - 10)); }}
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
                disabled={gameState !== 'betting'}
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
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(b => Math.min(user.virtualCoins, b + 10)); }}
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
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(10); }}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              MIN
            </button>
            <button
              type="button"
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(50); }}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              50
            </button>
            <button
              type="button"
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(100); }}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              100
            </button>
            <button
              type="button"
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(b => Math.max(10, Math.floor(b / 2))); }}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30"
            >
              1/2
            </button>
            <button
              type="button"
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(b => Math.min(user.virtualCoins, b * 2)); }}
              className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30"
            >
              2X
            </button>
            <button
              type="button"
              disabled={gameState !== 'betting'}
              onClick={() => { sounds.playChipBet(); setBetStake(Math.max(10, user.virtualCoins)); }}
              className="py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Action Button */}
        {gameState === 'betting' ? (
          <button
            onClick={dealCards}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:opacity-95 text-slate-950 font-display font-black text-lg tracking-wider shadow-xl gold-glow active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5 text-slate-950" />
            <span>CONFIRM BET NOW ({betStake} COINS ON {betSide.toUpperCase()})</span>
          </button>
        ) : gameState === 'ended' ? (
          <button
            onClick={startNewRound}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-display font-black text-lg tracking-wider shadow-xl purple-glow active:scale-95 transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>START NEXT ROUND (10s TIMER)</span>
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-2xl bg-slate-800 text-slate-400 text-center font-bold text-sm">
            Showdown in progress...
          </div>
        )}
      </div>
    </div>
  );
};
