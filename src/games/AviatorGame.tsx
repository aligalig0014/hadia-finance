import React, { useState, useEffect, useRef } from 'react';
import { Play, Shield, RefreshCw, Trophy, Award, ArrowLeft, Volume2, VolumeX, Flame, Zap, CheckCircle2, Users, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';

type FlightPhase = 'starting' | 'flying' | 'crashed';

interface LiveBotPlayer {
  id: string;
  name: string;
  avatar: string;
  bet: number;
  targetCashout: number;
  cashedAt?: number;
  winCoins?: number;
  status: 'betting' | 'cashed' | 'crashed';
}

const BOT_TEMPLATES = [
  { name: 'Malik_VIP', avatar: '👳‍♂️', baseBet: 250 },
  { name: 'Usman_King', avatar: '👑', baseBet: 500 },
  { name: 'Hamza_786', avatar: '⚡', baseBet: 100 },
  { name: 'Zara_Queen', avatar: '🧕', baseBet: 300 },
  { name: 'Babar_Pro', avatar: '🦁', baseBet: 1000 },
  { name: 'Rana_Legend', avatar: '🔥', baseBet: 150 },
  { name: 'Sher_Khan', avatar: '🐯', baseBet: 750 },
  { name: 'Farhan_Ali', avatar: '🚀', baseBet: 200 }
];

export const AviatorGame: React.FC = () => {
  const { recordGameResult, closeGame, soundEnabled, toggleSound, user, deductStake, setIsDepositModalOpen } = useGame();

  const [flightPhase, setFlightPhase] = useState<FlightPhase>('starting');
  const [countdown, setCountdown] = useState<number>(3);
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [betStake, setBetStake] = useState<number>(50);
  const [autoBet, setAutoBet] = useState<boolean>(false);

  // Player round participation
  const [hasActiveBet, setHasActiveBet] = useState<boolean>(false);
  const [queuedNextBet, setQueuedNextBet] = useState<boolean>(false);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);
  const [collectedAt, setCollectedAt] = useState<number | null>(null);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);

  // Computer Players (Live Bots playing along)
  const [botPlayers, setBotPlayers] = useState<LiveBotPlayer[]>([]);

  // Stats & History
  const [roundHistory, setRoundHistory] = useState<number[]>([1.84, 2.45, 1.15, 4.20, 1.55, 3.10, 1.90]);
  const [bestMultiplier, setBestMultiplier] = useState<number>(4.20);
  const [roundCount, setRoundCount] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(2.40);
  const flightIntervalRef = useRef<number | null>(null);

  // Generate random crash multiplier (weighted realistic curve)
  const generateCrashPoint = () => {
    const rand = Math.random();
    if (rand < 0.10) return +(1.05 + Math.random() * 0.25).toFixed(2); // 1.05 - 1.30
    if (rand < 0.60) return +(1.30 + Math.random() * 1.70).toFixed(2); // 1.30 - 3.00
    if (rand < 0.85) return +(3.00 + Math.random() * 4.00).toFixed(2); // 3.00 - 7.00
    return +(7.00 + Math.random() * 15.00).toFixed(2); // 7.00 - 22.00
  };

  // Generate 5-8 Computer Players with realistic bets & cashout targets
  const spawnBotPlayers = (crashPoint: number) => {
    const count = 5 + Math.floor(Math.random() * 3);
    const shuffled = [...BOT_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, count);

    const generated: LiveBotPlayer[] = shuffled.map((b, idx) => {
      // Varied stakes
      const betOptions = [50, 100, 200, 250, 500, 1000, 1500];
      const botBet = betOptions[Math.floor(Math.random() * betOptions.length)];

      // Bot cashout target: some conservative (1.2 - 1.8), some daring (2.0 - 5.0)
      const isConservative = Math.random() < 0.6;
      let target = isConservative
        ? +(1.15 + Math.random() * 0.95).toFixed(2) // 1.15x - 2.10x
        : +(2.00 + Math.random() * 4.50).toFixed(2); // 2.00x - 6.50x

      return {
        id: `bot-${idx}-${Date.now()}`,
        name: b.name,
        avatar: b.avatar,
        bet: botBet,
        targetCashout: target,
        status: 'betting'
      };
    });

    setBotPlayers(generated);
  };

  // 1. CONTINUOUS FLIGHT CYCLE (Jahaz chalta rahe, ruke na!)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (flightPhase === 'starting') {
      // 3-Second Countdown before Jet Take-off
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(c => c - 1);
        }, 1000);
      } else {
        // Countdown finished: Take off now!
        const crashTarget = generateCrashPoint();
        crashPointRef.current = crashTarget;
        setMultiplier(1.00);
        setCollectedAt(null);
        setCoinsEarned(0);

        // Spawn computer players for this flight
        spawnBotPlayers(crashTarget);

        // Check if player had queued a bet or has autoBet on
        if (queuedNextBet || autoBet) {
          const ok = deductStake(betStake);
          if (ok) {
            setHasActiveBet(true);
            setHasCashedOut(false);
          } else {
            setHasActiveBet(false);
            setHasCashedOut(false);
          }
          setQueuedNextBet(false);
        } else {
          setHasActiveBet(false);
          setHasCashedOut(false);
        }

        sounds.playJetWhoosh();
        setFlightPhase('flying');
      }
    } else if (flightPhase === 'flying') {
      // Flight ascending loop: Multiplier climbs continuously
      let curMult = 1.00;
      const interval = setInterval(() => {
        // Smooth exponential rise
        curMult += 0.015 + curMult * 0.012;
        const formatted = +curMult.toFixed(2);

        // Update live computer players: check who cashes out!
        setBotPlayers(prevBots =>
          prevBots.map(bot => {
            if (bot.status === 'betting' && formatted >= bot.targetCashout && bot.targetCashout <= crashPointRef.current) {
              return {
                ...bot,
                status: 'cashed',
                cashedAt: bot.targetCashout,
                winCoins: Math.round(bot.bet * bot.targetCashout)
              };
            }
            return bot;
          })
        );

        if (formatted >= crashPointRef.current) {
          // Jet flew away / crashed!
          clearInterval(interval);
          setMultiplier(crashPointRef.current);
          setFlightPhase('crashed');
          sounds.playCrash();

          // Mark remaining bots as crashed
          setBotPlayers(prevBots =>
            prevBots.map(bot => (bot.status === 'betting' ? { ...bot, status: 'crashed' } : bot))
          );

          setRoundHistory(prev => [crashPointRef.current, ...prev.slice(0, 8)]);
          setRoundCount(rc => rc + 1);

          // If player didn't cash out in time
          setHasActiveBet(active => {
            if (active) {
              recordGameResult('aviator', crashPointRef.current, 0, `Jet flew away at ${crashPointRef.current.toFixed(2)}x`);
            }
            return false;
          });
        } else {
          setMultiplier(formatted);
        }
      }, 55);

      flightIntervalRef.current = interval as unknown as number;
      return () => clearInterval(interval);
    } else if (flightPhase === 'crashed') {
      // Stay crashed for only 2.5 seconds, then AUTOMATICALLY restart next flight!
      timer = setTimeout(() => {
        setCountdown(3);
        setFlightPhase('starting');
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [flightPhase, countdown, queuedNextBet, autoBet, betStake, deductStake, recordGameResult]);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (flightIntervalRef.current) clearInterval(flightIntervalRef.current);
    };
  }, []);

  // Player actions:
  const handlePlaceBet = () => {
    if (flightPhase === 'starting') {
      if (user.virtualCoins < betStake) {
        setIsDepositModalOpen(true);
        return;
      }
      sounds.playChipBet();
      setQueuedNextBet(true);
    } else {
      if (user.virtualCoins < betStake) {
        setIsDepositModalOpen(true);
        return;
      }
      sounds.playChipBet();
      setQueuedNextBet(prev => !prev);
    }
  };

  // Player Cash Out: Win locked! JAHAZ KEEPS FLYING NON-STOP!
  const handleCashOut = () => {
    if (flightPhase !== 'flying' || !hasActiveBet || hasCashedOut) return;

    const currentMult = multiplier;
    const winCoins = Math.round(betStake * currentMult);

    setHasCashedOut(true);
    setCollectedAt(currentMult);
    setCoinsEarned(winCoins);

    if (currentMult > bestMultiplier) {
      setBestMultiplier(currentMult);
    }

    sounds.playWin();
    recordGameResult('aviator', currentMult, winCoins, `Cashed out at ${currentMult.toFixed(2)}x on Sky Jet (+${winCoins} Coins)`);
  };

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background starfield
    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 300,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.7 + 0.3
    }));

    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
    let flamePulse = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep space night sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#050614');
      skyGrad.addColorStop(0.5, '#0a0d26');
      skyGrad.addColorStop(1, '#130d2a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach(st => {
        if (flightPhase === 'flying') {
          st.x -= st.speed * (1 + (multiplier - 1) * 0.45);
          st.y += st.speed * 0.25;
          if (st.x < 0) st.x = w;
          if (st.y > h) st.y = 0;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Horizon glow
      const horizonGrad = ctx.createRadialGradient(w * 0.5, h, 20, w * 0.5, h, 280);
      horizonGrad.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
      horizonGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      horizonGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, w, h);

      // Clouds
      const cloudPuffs = [
        { cx: 80, cy: 90, r: 55, a: 0.09 },
        { cx: 250, cy: 140, r: 75, a: 0.07 },
        { cx: 390, cy: 70, r: 60, a: 0.11 },
        { cx: 180, cy: 220, r: 85, a: 0.06 }
      ];
      cloudPuffs.forEach(cp => {
        const cGrad = ctx.createRadialGradient(cp.cx, cp.cy, 5, cp.cx, cp.cy, cp.r);
        cGrad.addColorStop(0, `rgba(192, 132, 252, ${cp.a})`);
        cGrad.addColorStop(0.6, `rgba(99, 102, 241, ${cp.a * 0.5})`);
        cGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(cp.cx, cp.cy, cp.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Runway tarmac strip
      if (multiplier < 2.0 || flightPhase === 'starting') {
        const runwayAlpha = flightPhase === 'starting' ? 0.95 : Math.max(0, 1 - (multiplier - 1.0) / 0.9);
        ctx.fillStyle = `rgba(15, 23, 42, ${runwayAlpha * 0.9})`;
        ctx.fillRect(0, h - 28, 160, 28);
        ctx.strokeStyle = `rgba(250, 204, 21, ${runwayAlpha * 0.9})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(10, h - 14);
        ctx.lineTo(150, h - 14);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Supersonic speed streaks
      if (flightPhase === 'flying' && multiplier > 1.8) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        for (let s = 0; s < 5; s++) {
          const sx = (w * 0.2 + (s * 90 + performance.now() * 0.45) % (w * 0.9));
          const sy = (h * 0.15 + s * 45) % (h * 0.8);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - 35, sy + 12);
          ctx.stroke();
        }
      }

      // Radar & Altitude grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = '9px monospace';
      ctx.fillText('10000m', 6, 45);
      ctx.fillText('5000m', 6, 125);
      ctx.fillText('2000m', 6, 205);
      ctx.fillText('ALT 0m', 6, h - 12);

      // Trajectory curve & Jet
      if (flightPhase === 'flying' || flightPhase === 'crashed') {
        const factor = Math.min(1, (multiplier - 1) / 4);
        const endX = 40 + factor * (w - 95);
        const endY = h - 35 - Math.pow(factor, 1.35) * (h - 80);

        ctx.beginPath();
        ctx.moveTo(35, h - 35);
        ctx.quadraticCurveTo(w * 0.42, h - 30, endX, endY);
        ctx.strokeStyle = flightPhase === 'crashed' ? '#ef4444' : '#c084fc';
        ctx.lineWidth = 4;
        ctx.shadowColor = flightPhase === 'crashed' ? '#ef4444' : '#a855f7';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.lineTo(endX, h - 35);
        ctx.lineTo(35, h - 35);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, endY, 0, h - 35);
        if (flightPhase === 'crashed') {
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
          grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        } else {
          grad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
          grad.addColorStop(1, 'rgba(147, 51, 234, 0.0)');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        if (flightPhase === 'flying') {
          flamePulse += 0.3;
          for (let p = 0; p < 2; p++) {
            particles.push({
              x: endX - 16,
              y: endY + 4 + (Math.random() - 0.5) * 4,
              vx: -Math.random() * 3 - 2,
              vy: (Math.random() - 0.5) * 1.5,
              life: 1.0,
              color: Math.random() < 0.5 ? '#f59e0b' : '#ec4899'
            });
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const pt = particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 0.05;
          if (pt.life <= 0) {
            particles.splice(i, 1);
          } else {
            ctx.fillStyle = pt.color;
            ctx.shadowColor = pt.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.life * 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Draw Jet
        ctx.save();
        ctx.translate(endX, endY);
        const angle = -0.38;
        ctx.rotate(angle);

        if (flightPhase === 'crashed') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💥', 0, 0);
        } else {
          const plumeLen = 15 + Math.sin(flamePulse) * 5;
          const flameGrad = ctx.createLinearGradient(-15, 0, -15 - plumeLen, 0);
          flameGrad.addColorStop(0, '#38bdf8');
          flameGrad.addColorStop(0.4, '#f59e0b');
          flameGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(-14, -3);
          ctx.lineTo(-14 - plumeLen, 0);
          ctx.lineTo(-14, 3);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(22, 0);
          ctx.lineTo(-14, -6);
          ctx.lineTo(-12, 0);
          ctx.lineTo(-14, 6);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.ellipse(3, -1, 7, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(4, -2.5, 4, 1.2);

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(4, 0);
          ctx.lineTo(-6, -16);
          ctx.lineTo(-1, -16);
          ctx.lineTo(-1, 0);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(4, 0);
          ctx.lineTo(-6, 16);
          ctx.lineTo(-1, 16);
          ctx.lineTo(-1, 0);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#991b1b';
          ctx.beginPath();
          ctx.moveTo(-8, -4);
          ctx.lineTo(-16, -9);
          ctx.lineTo(-12, -4);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-8, 4);
          ctx.lineTo(-16, 9);
          ctx.lineTo(-12, 4);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(-3, -16, 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(-3, 16, 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('👑', -2, 3);
        }
        ctx.restore();
      } else {
        // Starting
        ctx.save();
        ctx.translate(55, h - 25);
        ctx.rotate(-0.1);

        ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.beginPath();
        ctx.arc(-14, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-14, -5);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-14, 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(3, 0);
        ctx.lineTo(-6, -14);
        ctx.lineTo(-1, -14);
        ctx.lineTo(-1, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(3, 0);
        ctx.lineTo(-6, 14);
        ctx.lineTo(-1, 14);
        ctx.lineTo(-1, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(3, -1, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [flightPhase, multiplier]);

  return (
    <div className="flex flex-col min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Header */}
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
            Live Flight
          </span>
          <h2 className="font-brand font-bold text-base tracking-wide gold-gradient-text">
            Sky Jet Multiplier
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Multiplier History Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs text-slate-400 font-medium shrink-0">History:</span>
          {roundHistory.map((hist, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold shrink-0 border ${
                hist >= 2.0
                  ? 'bg-purple-900/40 text-purple-300 border-purple-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {hist.toFixed(2)}x
            </span>
          ))}
        </div>

        {/* Flight Canvas Radar */}
        <div className="relative w-full aspect-[16/10] bg-[#0b0f24] rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={300}
            className="w-full h-full block"
          />

          {/* Centered Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {flightPhase === 'starting' && (
              <div className="text-center px-4 py-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-purple-500/40 animate-pulse">
                <p className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  🚀 Preparing Take-off
                </p>
                <span className="font-display font-black text-4xl text-white">
                  {countdown}s
                </span>
                <p className="text-[11px] text-purple-300 mt-0.5 font-medium">
                  {queuedNextBet ? 'Bet Ready For Launch!' : 'Place bet before flight'}
                </p>
              </div>
            )}

            {flightPhase === 'flying' && (
              <div className="text-center">
                <span className="font-display font-black text-5xl md:text-6xl text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.8)] tracking-tight">
                  {multiplier.toFixed(2)}x
                </span>
                <p className="text-xs uppercase tracking-widest text-purple-300 font-semibold mt-1">
                  Ascending Altitude...
                </p>

                {hasCashedOut && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-bold animate-bounce shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cashed Out at {collectedAt?.toFixed(2)}x (+{coinsEarned} Coins)! Jet still flying!</span>
                  </div>
                )}
              </div>
            )}

            {flightPhase === 'crashed' && (
              <div className="text-center px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-red-500/40 animate-pulse">
                <p className="text-red-400 font-bold text-xs uppercase tracking-wider">Flew Away at</p>
                <span className="font-display font-black text-4xl text-red-500">
                  {multiplier.toFixed(2)}x
                </span>
                <p className="text-xs text-slate-300 mt-0.5">Next flight launching soon...</p>
              </div>
            )}
          </div>

          {/* Corner Stat Tags */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Best:</span>
            <span className="font-bold text-amber-300">{bestMultiplier.toFixed(2)}x</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs">
            <span className="text-slate-400">Flight #{roundCount}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 rounded-2xl glass-panel-purple flex flex-col gap-3">
          {/* Bet Stake Selector */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Bet Stake (Paisa Lagayein):</span>
              <span className="font-mono font-bold text-amber-400">
                Balance: {user.virtualCoins.toLocaleString()} Coins
              </span>
            </div>

            {/* Input & Step Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
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
                  value={betStake}
                  onChange={e => setBetStake(Math.max(10, Number(e.target.value)))}
                  className="w-full text-center py-2 px-3 rounded-xl bg-slate-950 border border-purple-500/40 text-amber-300 font-display font-black text-lg focus:outline-none focus:border-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase pointer-events-none">
                  Coins
                </span>
              </div>

              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(b => Math.min(user.virtualCoins, b + 10)); }}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg border border-slate-700 flex items-center justify-center transition"
                title="Zyada Karein (+10)"
              >
                +
              </button>
            </div>

            {/* Quick Multiplier Chips */}
            <div className="grid grid-cols-6 gap-1.5 pt-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(10); }}
                className="py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                MIN
              </button>
              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(50); }}
                className="py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                50
              </button>
              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(100); }}
                className="py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                100
              </button>
              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(b => Math.max(10, Math.floor(b / 2))); }}
                className="py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-500/30"
              >
                1/2
              </button>
              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(b => Math.min(user.virtualCoins, b * 2)); }}
                className="py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30"
              >
                2X
              </button>
              <button
                type="button"
                onClick={() => { sounds.playChipBet(); setBetStake(Math.max(10, user.virtualCoins)); }}
                className="py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-amber-300 border border-purple-500/50"
              >
                MAX
              </button>
            </div>

            {/* Auto Bet Toggle Checkbox */}
            <div className="flex items-center justify-between pt-1 border-t border-purple-500/20 text-xs">
              <span className="text-slate-400">Auto-Bet (Har flight me lagao):</span>
              <button
                type="button"
                onClick={() => setAutoBet(!autoBet)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition ${
                  autoBet
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {autoBet ? 'AUTO ON ✅' : 'AUTO OFF'}
              </button>
            </div>
          </div>

          {/* Dynamic Play / Cash Out Button */}
          {flightPhase === 'flying' && hasActiveBet && !hasCashedOut ? (
            /* ACTIVE BET IN FLIGHT: CASH OUT BUTTON */
            <button
              onClick={handleCashOut}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-xl tracking-wider shadow-xl gold-glow active:scale-95 transition flex flex-col items-center justify-center animate-pulse"
            >
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-slate-900" />
                <span>CASH OUT NOW</span>
              </div>
              <span className="text-xs font-bold text-slate-800">
                Win +{Math.round(betStake * multiplier).toLocaleString()} Coins ({multiplier.toFixed(2)}x)
              </span>
            </button>
          ) : flightPhase === 'starting' ? (
            /* COUNTDOWN PHASE: PLACE BET */
            <button
              onClick={handlePlaceBet}
              className={`w-full py-4 rounded-xl font-display font-black text-lg tracking-wider shadow-lg active:scale-95 transition flex items-center justify-center gap-2 ${
                queuedNextBet
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white purple-glow'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {queuedNextBet ? `BET QUEUED (${betStake} COINS) • CANCEL?` : `PLACE BET (${betStake} COINS)`}
              </span>
            </button>
          ) : (
            /* FLYING (AFTER CASH OUT OR WATCHING) OR CRASHED: QUEUE FOR NEXT FLIGHT */
            <button
              onClick={handlePlaceBet}
              className={`w-full py-3.5 rounded-xl font-display font-black text-base tracking-wider shadow-lg active:scale-95 transition flex items-center justify-center gap-2 ${
                queuedNextBet
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white hover:opacity-95'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>
                {queuedNextBet
                  ? `BET QUEUED FOR NEXT FLIGHT (${betStake} COINS)`
                  : `BET FOR NEXT FLIGHT (${betStake} COINS)`}
              </span>
            </button>
          )}

          {/* Unstoppable Live Notice */}
          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Continuous Non-Stop Flight Engine • Virtual Arcade Multiplier</span>
          </div>
        </div>

        {/* LIVE COMPUTER & ONLINE PLAYERS PANEL (Live Multiplayer Simulation) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-xs text-white">Live Players in Flight</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{botPlayers.length + (hasActiveBet ? 1 : 0)} Players Betting</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto no-scrollbar">
            {/* User row if active */}
            {hasActiveBet && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/15 border border-amber-400/50 gold-glow">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">
                    👑
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xs text-amber-300 flex items-center gap-1">
                      <span>{user.name} (YOU)</span>
                      <Crown className="w-3 h-3 text-amber-400" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">🪙 {betStake} Coins</span>
                  </div>
                </div>

                <div>
                  {hasCashedOut ? (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400">
                      Cashed {collectedAt?.toFixed(2)}x (+{coinsEarned})
                    </span>
                  ) : flightPhase === 'crashed' ? (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40">
                      Crashed 💥
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                      In Flight 🚀
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Computer Bots Playing Along */}
            {botPlayers.map(bot => (
              <div
                key={bot.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                    {bot.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-200">{bot.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">🪙 {bot.bet} Coins</span>
                  </div>
                </div>

                <div>
                  {bot.status === 'cashed' ? (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Cashed {bot.cashedAt?.toFixed(2)}x (+{bot.winCoins})
                    </span>
                  ) : bot.status === 'crashed' ? (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      Lost 💥
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                      In Flight 🚀
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">How Aviator Works:</p>
          <p>1. The supersonic jet flies in continuous rounds without stopping.</p>
          <p>2. Tap <strong>CASH OUT</strong> at any moment before the jet flies away.</p>
          <p>3. Other online players and bots play along in real time.</p>
        </div>
      </div>
    </div>
  );
};
