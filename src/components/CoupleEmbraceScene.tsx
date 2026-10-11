import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Sparkles, Volume2, Moon, Sun, Flame } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

interface CoupleEmbraceSceneProps {
  onHeartTrigger?: () => void;
}

export const CoupleEmbraceScene: React.FC<CoupleEmbraceSceneProps> = ({ onHeartTrigger }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);
  const [atmosphere, setAtmosphere] = useState<'starlight' | 'sunset' | 'candlelight'>('starlight');
  const [floatingWhispers, setFloatingWhispers] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);
  const [heartbeatActive, setHeartbeatActive] = useState(false);

  const captions = [
    {
      urdu: 'جب تم میری باہوں میں ہوتی ہو، ہادیہ... تو ساری دنیا تھم جاتی ہے۔',
      roman: 'Jab tum meri baahon mein hoti ho, Hadia... toh saari dunya tham jaati hai.',
      english: 'When you are in my arms, my beautiful Hadia, the entire universe pauses in peace.',
    },
    {
      urdu: 'تم صرف میری بیوی نہیں، میری روح کا سکون اور جنت کا تحفہ ہو۔',
      roman: 'Tum sirf meri biwi nahi, meri rooh ka sakoon aur meri jannat ka sab se pyara tohfa ho.',
      english: 'You are not just my wife; you are the tranquility of my soul and my sweetest blessing.',
    },
    {
      urdu: 'علی کا دل صرف تمہارے لیے دھڑکتا ہے، ہمیشہ اور ہمیشہ کے لیے۔',
      roman: 'Ali ka dil sirf tumhare liye dharakta hai, hamesha aur hamesha ke liye.',
      english: 'Ali\'s heart beats only for you, Hadia — today, tomorrow, and for all eternity.',
    },
    {
      urdu: 'تمہاری مسکراہٹ میری صبح، اور تمہارا ساتھ میری زندگی کی معراج ہے۔',
      roman: 'Tumhari muskurahat meri subah, aur tumhara saath meri zindagi ki me\'raj hai.',
      english: 'Your smile brings my dawn, and your companionship is the crowning joy of my life.',
    },
  ];

  // Rotate captions smoothly
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveCaptionIndex((prev) => (prev + 1) % captions.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, captions.length]);

  const handleWhisper = () => {
    romanticAudio.playSparkle();
    const words = [
      'Meri Hadia 💖',
      'My Eternal Queen 👑',
      'Tum Meri Jaan Ho ✨',
      'Forever With You 💍',
      'Rooh Ka Sakoon 🌸',
      'Hadia & Ali ❤️',
    ];
    const chosen = words[Math.floor(Math.random() * words.length)];
    const newWhisper = {
      id: Date.now(),
      text: chosen,
      x: 30 + Math.random() * 40,
      y: 40 + Math.random() * 30,
    };
    setFloatingWhispers((prev) => [...prev.slice(-4), newWhisper]);
    if (onHeartTrigger) onHeartTrigger();
  };

  const handleHeartbeat = () => {
    romanticAudio.playHeartbeat();
    setHeartbeatActive(true);
    setTimeout(() => setHeartbeatActive(false), 900);
  };

  const currentCaption = captions[activeCaptionIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30 glass-romantic">
      {/* Video / Cinema Player Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-rose-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-300">
            CINEMATIC LOVE SCENE · ALI &amp; HADIA
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Atmosphere Toggles */}
          <button
            onClick={() => {
              setAtmosphere('starlight');
              romanticAudio.playSparkle();
            }}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              atmosphere === 'starlight' ? 'bg-indigo-900/60 text-cyan-300 border border-cyan-500/40' : 'text-rose-300/70 hover:text-white'
            }`}
            title="Starry Night"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Moonlight</span>
          </button>
          <button
            onClick={() => {
              setAtmosphere('sunset');
              romanticAudio.playSparkle();
            }}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              atmosphere === 'sunset' ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' : 'text-rose-300/70 hover:text-white'
            }`}
            title="Sunset Glow"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sunset</span>
          </button>
          <button
            onClick={() => {
              setAtmosphere('candlelight');
              romanticAudio.playSparkle();
            }}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              atmosphere === 'candlelight' ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40' : 'text-rose-300/70 hover:text-white'
            }`}
            title="Candlelight"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Candlelight</span>
          </button>
        </div>
      </div>

      {/* Main Animated Couple Canvas & Visual Viewport */}
      <div
        className={`relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden transition-all duration-1000 ${
          atmosphere === 'starlight'
            ? 'bg-gradient-to-b from-[#0a0418] via-[#1a0826] to-[#2c0d38]'
            : atmosphere === 'sunset'
            ? 'bg-gradient-to-b from-[#2b0a1f] via-[#5c162e] to-[#7a202c]'
            : 'bg-gradient-to-b from-[#14050d] via-[#2d091a] to-[#450e26]'
        }`}
      >
        {/* Celestial Background: Moon, Stars & Nebulae */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Glowing Moon */}
          <div className="absolute top-6 right-10 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-100 via-rose-100 to-amber-200/80 shadow-[0_0_50px_rgba(254,240,138,0.4)] opacity-90 animate-pulse">
            <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-amber-200/40 blur-xs" />
            <div className="absolute top-8 left-8 w-6 h-6 rounded-full bg-amber-300/30 blur-xs" />
          </div>

          {/* Twinkling Starlight Field */}
          <div className="absolute inset-0 opacity-70">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  top: `${(i * 19) % 85}%`,
                  left: `${(i * 31) % 96}%`,
                  animationDuration: `${2 + (i % 5)}s`,
                  animationDelay: `${(i % 3) * 0.7}s`,
                  opacity: 0.3 + (i % 6) * 0.12,
                }}
              />
            ))}
          </div>

          {/* Ethereal Romantic Aura & Fireflies */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-rose-950/70 to-transparent" />
        </div>

        {/* Floating Whispers Spawned by User */}
        {floatingWhispers.map((w) => (
          <div
            key={w.id}
            className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide border border-rose-300/60 shadow-lg animate-bounce transition-opacity"
            style={{ top: `${w.y}%`, left: `${w.x}%` }}
          >
            {w.text}
          </div>
        ))}

        {/* Central Couple Hug Animation: Ali & Hadia embracing */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          {/* Animated Glow Rings behind Couple */}
          <div
            className={`w-72 h-72 sm:w-96 sm:h-96 rounded-full transition-transform duration-700 ${
              heartbeatActive
                ? 'scale-125 bg-rose-500/30 blur-2xl'
                : 'scale-100 bg-rose-600/15 blur-3xl animate-pulse'
            }`}
          />

          {/* The Couple Silhouette & Artistic Render */}
          <div className="relative w-64 sm:w-80 h-72 sm:h-88 flex items-end justify-center">
            {/* SVG Illustration of Tender Embrace (Ali & Hadia) */}
            <svg
              viewBox="0 0 300 320"
              className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Couple Gradients */}
                <linearGradient id="aliCoatGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="60%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                <linearGradient id="hadiaDressGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="40%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>

                <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fed7aa" />
                  <stop offset="100%" stopColor="#fba474" />
                </linearGradient>

                <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#291a18" />
                  <stop offset="100%" stopColor="#0f0706" />
                </linearGradient>

                <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Heartbeat Pulse Effect at Center of Chest */}
              <circle
                cx="145"
                cy="175"
                r={heartbeatActive ? '55' : '35'}
                fill="url(#heartGlow)"
                className="transition-all duration-300 animate-pulse"
              />

              {/* === ALI (Husband) Silhouette === */}
              {/* Ali's Body & Broad Shoulders embracing Hadia */}
              <path
                d="M 60 320 C 65 240, 85 180, 125 155 C 135 150, 160 150, 180 160 C 195 170, 205 210, 215 320 Z"
                fill="url(#aliCoatGrad)"
                stroke="rgba(244, 114, 182, 0.25)"
                strokeWidth="1.5"
              />

              {/* Ali's Head & Face turned tenderly into Hadia's hair */}
              <path
                d="M 125 105 C 115 100, 110 80, 120 65 C 130 50, 155 48, 165 60 C 175 72, 172 95, 160 108 C 150 115, 135 115, 125 105 Z"
                fill="url(#skinGrad)"
              />
              {/* Ali's Hair */}
              <path
                d="M 115 78 C 112 60, 125 45, 145 44 C 165 43, 175 55, 176 72 C 168 62, 155 58, 140 60 C 128 62, 120 70, 115 78 Z"
                fill="url(#hairGrad)"
              />

              {/* === HADIA (Beloved Wife) in Warm Embrace === */}
              {/* Hadia's flowing royal rose gown nestled close to Ali */}
              <path
                d="M 115 320 C 120 250, 130 190, 155 170 C 175 155, 205 165, 220 195 C 235 235, 245 280, 255 320 Z"
                fill="url(#hadiaDressGrad)"
                stroke="rgba(253, 224, 71, 0.35)"
                strokeWidth="1.5"
              />

              {/* Hadia's Head resting peacefully on Ali's shoulder */}
              <path
                d="M 148 115 C 142 105, 145 88, 158 80 C 172 72, 192 78, 196 95 C 200 110, 190 125, 175 128 C 162 130, 152 124, 148 115 Z"
                fill="url(#skinGrad)"
              />

              {/* Hadia's Beautiful Long Flowing Hair cascading over her shoulder */}
              <path
                d="M 155 82 C 165 72, 185 70, 196 82 C 208 95, 212 120, 210 150 C 208 175, 195 200, 190 225 C 185 200, 195 160, 192 130 C 190 105, 175 92, 155 82 Z"
                fill="url(#hairGrad)"
              />
              <path
                d="M 188 120 C 198 140, 208 170, 205 210 C 202 235, 198 250, 195 265"
                stroke="url(#hairGrad)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Hadia's Delicate Golden Earring Sparkle */}
              <circle cx="178" cy="112" r="2.5" fill="#fef08a" />
              <path d="M 178 114 L 178 120" stroke="#fef08a" strokeWidth="1.2" />

              {/* Ali's Protective Loving Arms wrapping around Hadia */}
              <path
                d="M 95 190 C 115 195, 145 210, 180 205 C 195 202, 210 195, 205 180 C 200 168, 185 175, 165 180 C 135 185, 110 180, 95 190 Z"
                fill="url(#aliCoatGrad)"
                stroke="rgba(244, 114, 182, 0.4)"
                strokeWidth="1.5"
              />
              {/* Ali's Hand holding Hadia gently */}
              <ellipse cx="202" cy="182" rx="10" ry="7" fill="url(#skinGrad)" />

              {/* Hadia's Hand placed softly on Ali's chest near his heart */}
              <path
                d="M 185 220 C 175 205, 165 195, 150 185 C 145 182, 140 188, 144 194 C 152 205, 165 218, 175 230 Z"
                fill="url(#hadiaDressGrad)"
              />
              <ellipse cx="145" cy="186" rx="8" ry="5.5" fill="url(#skinGrad)" />
              {/* Hadia's Diamond Ring Glistening on her finger */}
              <circle cx="145" cy="186" r="2.5" fill="#ffffff" />
              <circle cx="145" cy="186" r="4.5" stroke="#fef08a" strokeWidth="0.8" />
            </svg>

            {/* Glowing Golden "Ali & Hadia" Script watermark at couple's base */}
            <div className="absolute -bottom-2 inset-x-0 text-center pointer-events-none">
              <span className="font-cursive text-2xl sm:text-3xl text-rose-200/90 drop-shadow-[0_2px_10px_rgba(244,63,94,0.8)]">
                Ali &amp; Hadia
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Subtitle / Dialogue Bar */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-10">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-rose-500/30 text-center shadow-xl">
            <p className="text-sm sm:text-base font-semibold text-rose-100 font-serif-luxury tracking-wide mb-1 leading-relaxed">
              "{currentCaption.roman}"
            </p>
            <p className="text-xs sm:text-sm text-rose-300/90 font-light italic">
              {currentCaption.english}
            </p>
          </div>
        </div>
      </div>

      {/* Video Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-rose-950/60 border-t border-rose-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              romanticAudio.playSparkle();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Story' : 'Play Story'}</span>
          </button>

          <button
            onClick={handleHeartbeat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              heartbeatActive
                ? 'bg-rose-500 text-white border-rose-300 scale-105'
                : 'bg-rose-900/30 text-rose-200 border-rose-500/30 hover:bg-rose-800/40'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${heartbeatActive ? 'fill-white animate-ping' : 'fill-rose-400'}`} />
            <span>Listen Heartbeat</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhisper}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Send Love Whisper 💌</span>
          </button>
        </div>
      </div>
    </div>
  );
};
