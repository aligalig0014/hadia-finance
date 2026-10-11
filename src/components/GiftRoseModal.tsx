import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, Plus, RotateCcw } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';
import confetti from 'canvas-confetti';

interface GiftRoseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftRoseModal: React.FC<GiftRoseModalProps> = ({ isOpen, onClose }) => {
  const [roseCount, setRoseCount] = useState(101);
  const [blooming, setBlooming] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const sweetNotes = [
    'Every petal whispers how deeply Ali loves you, Hadia.',
    'A red rose that never fades, just like our eternal bond.',
    'You are the sweetest flower in the garden of my life.',
    'In a world full of flowers, my eyes will always search for you.',
    'ہادیہ، تمہاری خوشبو سے میری روح مہک اٹھتی ہے۔',
  ];

  useEffect(() => {
    if (isOpen) {
      setBlooming(true);
      romanticAudio.playSparkle();
      // Burst petals around the bouquet
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#be123c', '#fda4af', '#f43f5e', '#fef08a'],
      });
    } else {
      setBlooming(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMoreRoses = () => {
    romanticAudio.playSparkle();
    setRoseCount((c) => c + 10);
    setActiveMessageIndex((prev) => (prev + 1) % sweetNotes.length);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#e11d48', '#fef08a'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background glow halos */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-rose-600/30 blur-3xl pointer-events-none -z-10" />

      {/* Main Bouquet Card Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#200517] via-[#12020e] to-[#0a0108] border-2 border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.4)] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Small Ribbon Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>A Surprise For Hadia</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h3 className="font-cursive text-3xl sm:text-5xl text-rose-100">
          A Royal Bouquet of Red Roses
        </h3>

        <p className="font-serif-luxury text-xs sm:text-sm text-rose-200/80 italic mt-1">
          "علی کی طرف سے اپنی ملکہ ہادیہ کے لیے محبت بھرا تحفہ"
        </p>

        {/* Animated Grand Rose Bouquet Illustration */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-radial from-rose-500/20 via-pink-600/10 to-transparent animate-pulse" />

          {/* Detailed SVG Rose Bouquet */}
          <svg
            viewBox="0 0 320 320"
            className={`w-full h-full drop-shadow-[0_15px_30px_rgba(225,29,72,0.5)] transition-transform duration-700 ${
              blooming ? 'scale-100' : 'scale-75'
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="roseRed1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
              <linearGradient id="roseRed2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="40%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="60%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>
              <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
            </defs>

            {/* Bouquet Wrapping Cone / Gold Craft Paper */}
            <path
              d="M 90 200 L 160 305 L 230 200 C 210 220, 110 220, 90 200 Z"
              fill="url(#paperGrad)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            <path
              d="M 110 185 L 160 305 L 140 185 Z"
              fill="rgba(0,0,0,0.15)"
            />

            {/* Satin Ribbon & Bow */}
            <path
              d="M 130 240 C 145 235, 175 235, 190 240 C 180 250, 140 250, 130 240 Z"
              fill="url(#ribbonGrad)"
            />
            {/* Ribbon Loops */}
            <circle cx="145" cy="242" r="12" fill="url(#ribbonGrad)" stroke="#fecdd3" strokeWidth="1.5" />
            <circle cx="175" cy="242" r="12" fill="url(#ribbonGrad)" stroke="#fecdd3" strokeWidth="1.5" />
            {/* Center knot */}
            <circle cx="160" cy="242" r="6" fill="#be123c" />
            {/* Hanging tails */}
            <path d="M 155 246 C 150 265, 140 280, 135 295" stroke="url(#ribbonGrad)" strokeWidth="5" strokeLinecap="round" />
            <path d="M 165 246 C 170 265, 180 280, 185 295" stroke="url(#ribbonGrad)" strokeWidth="5" strokeLinecap="round" />

            {/* Lush Green Emerald Leaves */}
            {/* Leaf Left */}
            <path
              d="M 120 180 C 80 170, 60 145, 55 125 C 80 135, 105 160, 120 180 Z"
              fill="url(#leafGrad)"
            />
            <path d="M 70 145 C 90 155, 105 165, 120 180" stroke="#bbf7d0" strokeWidth="1" />

            {/* Leaf Right */}
            <path
              d="M 200 180 C 240 170, 260 145, 265 125 C 240 135, 215 160, 200 180 Z"
              fill="url(#leafGrad)"
            />
            <path d="M 250 145 C 230 155, 215 165, 200 180" stroke="#bbf7d0" strokeWidth="1" />

            {/* Top Leaves */}
            <path d="M 160 110 C 150 70, 135 55, 120 45 C 135 65, 145 90, 160 110 Z" fill="url(#leafGrad)" />
            <path d="M 160 110 C 170 70, 185 55, 200 45 C 185 65, 175 90, 160 110 Z" fill="url(#leafGrad)" />

            {/* === BLOOMING ROSES === */}
            {/* Rose 1: Center-Left */}
            <g transform="translate(100, 110)">
              <circle cx="25" cy="25" r="26" fill="url(#roseRed1)" />
              {/* Petal layers spiral */}
              <path d="M 10 25 C 10 10, 40 10, 40 25 C 40 40, 10 40, 10 25 Z" fill="url(#roseRed2)" />
              <path d="M 15 22 C 18 14, 32 14, 35 22 C 32 30, 18 30, 15 22 Z" fill="#9f1239" />
              <circle cx="25" cy="22" r="5" fill="#f43f5e" />
            </g>

            {/* Rose 2: Center-Right */}
            <g transform="translate(170, 110)">
              <circle cx="25" cy="25" r="26" fill="url(#roseRed1)" />
              <path d="M 10 25 C 10 10, 40 10, 40 25 C 40 40, 10 40, 10 25 Z" fill="url(#roseRed2)" />
              <path d="M 15 22 C 18 14, 32 14, 35 22 C 32 30, 18 30, 15 22 Z" fill="#9f1239" />
              <circle cx="25" cy="22" r="5" fill="#f43f5e" />
            </g>

            {/* Rose 3: Top Crown Center */}
            <g transform="translate(135, 65)">
              <circle cx="25" cy="25" r="28" fill="url(#roseRed2)" />
              <path d="M 8 25 C 8 8, 42 8, 42 25 C 42 42, 8 42, 8 25 Z" fill="url(#roseRed1)" />
              <path d="M 14 22 C 17 12, 33 12, 36 22 C 33 32, 17 32, 14 22 Z" fill="#881337" />
              <circle cx="25" cy="22" r="6" fill="#f43f5e" />
            </g>

            {/* Rose 4: Bottom Center Focal */}
            <g transform="translate(135, 140)">
              <circle cx="25" cy="25" r="30" fill="url(#roseRed1)" />
              <path d="M 7 25 C 7 7, 43 7, 43 25 C 43 43, 7 43, 7 25 Z" fill="url(#roseRed2)" />
              <path d="M 13 22 C 16 11, 34 11, 37 22 C 34 33, 16 33, 13 22 Z" fill="#4c0519" />
              <circle cx="25" cy="22" r="7" fill="#fb7185" />
            </g>

            {/* Rose 5: Far Left Wing */}
            <g transform="translate(70, 140)">
              <circle cx="20" cy="20" r="20" fill="url(#roseRed2)" />
              <circle cx="20" cy="18" r="10" fill="#9f1239" />
              <circle cx="20" cy="18" r="4" fill="#f43f5e" />
            </g>

            {/* Rose 6: Far Right Wing */}
            <g transform="translate(210, 140)">
              <circle cx="20" cy="20" r="20" fill="url(#roseRed2)" />
              <circle cx="20" cy="18" r="10" fill="#9f1239" />
              <circle cx="20" cy="18" r="4" fill="#f43f5e" />
            </g>

            {/* Baby's Breath White Blossoms */}
            <circle cx="115" cy="95" r="4" fill="#ffffff" />
            <circle cx="205" cy="95" r="4" fill="#ffffff" />
            <circle cx="95" cy="130" r="3.5" fill="#ffffff" />
            <circle cx="225" cy="130" r="3.5" fill="#ffffff" />
            <circle cx="160" cy="60" r="4" fill="#ffffff" />
          </svg>

          {/* Golden Rose Plaque Inscription */}
          <div className="absolute -bottom-1 px-4 py-1 rounded-full bg-amber-500/90 text-amber-950 font-bold text-xs uppercase tracking-widest shadow-lg border border-amber-200">
            {roseCount} Red Roses
          </div>
        </div>

        {/* Dynamic Sweet Love Note */}
        <div className="p-3.5 rounded-2xl bg-black/50 border border-rose-500/20 max-w-sm w-full mb-4">
          <p className="text-xs sm:text-sm font-serif-luxury text-rose-100 italic leading-relaxed">
            "{sweetNotes[activeMessageIndex]}"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={handleAddMoreRoses}
            className="flex-1 min-w-[150px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg transition transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add +10 More Roses 🌹</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-semibold border border-rose-500/20 transition"
          >
            Keep in My Heart 💖
          </button>
        </div>
      </div>
    </div>
  );
};
