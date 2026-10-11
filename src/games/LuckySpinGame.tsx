import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Sparkles, Clock, History, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

const SLICES = [
  { coins: 1000, label: '1,000', color: '#f59e0b', text: '#000', bg: 'from-amber-400 to-amber-600' },
  { coins: 10, label: '10', color: '#6366f1', text: '#fff', bg: 'from-indigo-600 to-indigo-800' },
  { coins: 250, label: '250', color: '#ec4899', text: '#fff', bg: 'from-pink-500 to-rose-600' },
  { coins: 25, label: '25', color: '#8b5cf6', text: '#fff', bg: 'from-purple-600 to-purple-800' },
  { coins: 500, label: '500', color: '#eab308', text: '#000', bg: 'from-yellow-400 to-amber-500' },
  { coins: 50, label: '50', color: '#3b82f6', text: '#fff', bg: 'from-blue-600 to-blue-800' },
  { coins: 100, label: '100', color: '#10b981', text: '#fff', bg: 'from-emerald-500 to-teal-700' },
  { coins: 50, label: '50', color: '#a855f7', text: '#fff', bg: 'from-purple-500 to-indigo-700' }
];

export const LuckySpinGame: React.FC = () => {
  const { spinLuckyWheelClaim, closeGame, soundEnabled, toggleSound } = useGame();

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winResult, setWinResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([100, 50, 250]);
  const [lastSpinTime, setLastSpinTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ali_king_last_spin');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [hasFreeDailySpin, setHasFreeDailySpin] = useState<boolean>(true);

  // Check 24hr cooldown
  useEffect(() => {
    const elapsed = Date.now() - lastSpinTime;
    const oneDay = 24 * 60 * 60 * 1000;
    setHasFreeDailySpin(elapsed >= oneDay || lastSpinTime === 0);
  }, [lastSpinTime]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinResult(null);
    sounds.playClick();

    // Pick a winning index (weighted slightly towards 25, 50, 100, but with real chance for 500/1000)
    const weights = [1, 5, 2, 6, 2, 5, 4, 5]; // index 0 is 1000, index 4 is 500
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    let winningIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      if (rand < weights[i]) {
        winningIndex = i;
        break;
      }
      rand -= weights[i];
    }

    const sliceAngle = 360 / SLICES.length;
    // Calculate final rotation to align winning slice at top arrow (270 deg or pointer)
    const extraSpins = 5 * 360; // 5 full rotations
    // Winning slice center angle
    const targetSliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
    // Top pointer is at 0 (or 270 relative). Let's align so top indicator points to target:
    const finalRot = rotation + extraSpins + (360 - (targetSliceCenter % 360));

    setRotation(finalRot);

    // Audio ticks during spin
    const tickInterval = setInterval(() => {
      sounds.playTick();
    }, 180);

    setTimeout(() => {
      clearInterval(tickInterval);
      const wonCoins = SLICES[winningIndex].coins;
      setIsSpinning(false);
      setWinResult(wonCoins);
      setHistory(prev => [wonCoins, ...prev.slice(0, 9)]);

      const now = Date.now();
      setLastSpinTime(now);
      localStorage.setItem('ali_king_last_spin', String(now));
      setHasFreeDailySpin(false);

      spinLuckyWheelClaim(wonCoins);
    }, 4000);
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
            Daily Spin
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide gold-gradient-text">
            King Lucky Wheel
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col items-center gap-5">
        {/* Wheel Container */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/40 gold-glow animate-pulse" />

          {/* Top Indicator Arrow */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_4px_8px_rgba(245,158,11,0.8)]" />
          </div>

          {/* SVG Rotating Wheel */}
          <div
            className="w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {SLICES.map((slice, i) => {
                const angle = 360 / SLICES.length;
                const startAngle = (i * angle * Math.PI) / 180;
                const endAngle = ((i + 1) * angle * Math.PI) / 180;
                const x1 = 100 + 100 * Math.cos(startAngle);
                const y1 = 100 + 100 * Math.sin(startAngle);
                const x2 = 100 + 100 * Math.cos(endAngle);
                const y2 = 100 + 100 * Math.sin(endAngle);
                const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;

                const midAngle = ((i + 0.5) * angle * Math.PI) / 180;
                const textX = 100 + 62 * Math.cos(midAngle);
                const textY = 100 + 62 * Math.sin(midAngle);
                const rotationDeg = (i + 0.5) * angle + 90;

                return (
                  <g key={i}>
                    <path
                      d={pathData}
                      fill={slice.color}
                      stroke="#070913"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={slice.text}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="Space Grotesk, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}
                    >
                      {slice.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Crown Hub */}
          <div className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 border-4 border-slate-950 flex items-center justify-center shadow-xl">
            <span className="text-xl">👑</span>
          </div>
        </div>

        {/* Spin Result Banner */}
        {winResult !== null && (
          <div className="w-full p-4 rounded-2xl glass-panel-gold gold-glow text-center animate-bounce">
            <p className="text-xs uppercase tracking-widest text-amber-300 font-bold">Awesome Fortune!</p>
            <p className="text-3xl font-display font-black text-amber-400 mt-1">
              +{winResult} Virtual Coins
            </p>
            <p className="text-xs text-slate-300 mt-1">Credited straight to your virtual balance!</p>
          </div>
        )}

        {/* Spin Control Button */}
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`w-full py-4 rounded-2xl font-display font-black text-xl tracking-wider shadow-xl transition flex items-center justify-center gap-2 ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 gold-glow hover:scale-[1.02] active:scale-95'
            }`}
          >
            <Sparkles className="w-6 h-6 text-slate-900" />
            <span>{isSpinning ? 'SPINNING...' : hasFreeDailySpin ? 'FREE DAILY SPIN' : 'SPIN AGAIN (DEMO)'}</span>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{hasFreeDailySpin ? 'Daily Free Spin Ready' : 'Bonus Demo Spins Unlimited'}</span>
            </span>
            <span className="text-amber-300 font-semibold">Top Prize: 1,000 Coins</span>
          </div>
        </div>

        {/* History of spins */}
        <div className="w-full p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>Recent Spin Rewards</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {history.map((coins, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold shrink-0 flex items-center gap-1"
              >
                <span>🪙</span>
                <span>+{coins}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
