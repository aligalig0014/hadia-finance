import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Award, CheckCircle2, RotateCcw, Volume2, ShieldCheck } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

interface ProposalRingCeremonyProps {
  onProposalAccepted?: () => void;
}

export const ProposalRingCeremony: React.FC<ProposalRingCeremonyProps> = ({ onProposalAccepted }) => {
  const [boxOpen, setBoxOpen] = useState(false);
  const [hasSaidYes, setHasSaidYes] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);

  const noPhrases = [
    'No 😜',
    'Arey aise kaise! 😉',
    'Ali loves you too much! 💖',
    'Heart locked by Ali! 🔐',
    'Only YES allowed! 🥰',
    'You are mine forever! 💍',
  ];

  const handleOpenBox = () => {
    romanticAudio.playWaxSealOpen();
    romanticAudio.playSparkle();
    setBoxOpen(true);
  };

  const handleSayYes = () => {
    setHasSaidYes(true);
    romanticAudio.playProposalCelebration();
    if (onProposalAccepted) onProposalAccepted();

    // Multistage luxury confetti explosion
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#f43f5e', '#fb7185', '#fef08a', '#e11d48', '#ffffff', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleNoDodge = () => {
    romanticAudio.playSparkle();
    setNoHoverCount((c) => c + 1);
    // Random offset
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 120;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-12 p-6 sm:p-10 rounded-3xl glass-romantic border-2 border-rose-500/40 shadow-2xl overflow-hidden">
      {/* Background Starlight & Aura */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>The Eternal Vow · Ali To Hadia</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="font-cursive text-4xl sm:text-6xl text-rose-100 drop-shadow-md">
          Will You Marry Me Again?
        </h2>
        <p className="font-serif-luxury text-sm sm:text-base text-rose-200/80 italic mt-2 max-w-lg mx-auto">
          "ہادیہ، کیا تم میری زندگی، میری خوشی، اور میری ابدی رفاقت قبول کرو گی؟"
        </p>
      </div>

      {/* 3D Ring Box Presentation */}
      <div className="flex flex-col items-center justify-center my-8 relative z-10">
        {!boxOpen ? (
          <div
            onClick={handleOpenBox}
            className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
          >
            {/* Closed Velvet Ring Box */}
            <div className="relative w-44 h-40 sm:w-52 sm:h-48 rounded-3xl bg-gradient-to-b from-rose-900 via-rose-950 to-black border-4 border-amber-400/80 shadow-[0_20px_50px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center">
              {/* Golden Ribbon Cross */}
              <div className="absolute inset-y-0 w-6 bg-gradient-to-b from-amber-300 to-amber-600 shadow-md" />
              <div className="absolute inset-x-0 h-6 bg-gradient-to-r from-amber-300 to-amber-600 shadow-md" />
              {/* Gold Bow on top */}
              <div className="w-14 h-14 rounded-full bg-amber-400 border-2 border-amber-200 shadow-xl flex items-center justify-center z-10 group-hover:rotate-12 transition-transform">
                <Heart className="w-7 h-7 fill-rose-700 text-rose-700 animate-pulse" />
              </div>
              <span className="absolute bottom-2 text-[10px] uppercase font-bold tracking-widest text-amber-300">
                ROYAL JEWELRY
              </span>
            </div>
            <p className="mt-4 text-xs sm:text-sm font-semibold tracking-wider text-rose-300 group-hover:text-amber-300 transition flex items-center gap-1.5 animate-bounce">
              <span>✨ Tap to Open Ring Box ✨</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            {/* Open Velvet Ring Box with Diamond Ring Rising */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-b from-[#2a0614] via-[#1a040d] to-black border-4 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.5)] flex items-center justify-center">
              {/* Radiant Light Burst */}
              <div className="absolute inset-0 rounded-3xl bg-radial from-amber-300/20 via-rose-500/10 to-transparent animate-pulse" />

              {/* The Solitaire Diamond Ring */}
              <div className="relative flex flex-col items-center z-10 animate-float">
                {/* Solitaire Diamond with light rays */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-tr from-cyan-100 via-white to-sky-200 rotate-45 border-2 border-white shadow-[0_0_35px_rgba(255,255,255,1)] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-sky-400 rotate-[-45deg] animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  {/* Diamond Sparkle Beams */}
                  <div className="absolute -top-3 -right-3 w-3 h-3 bg-white rounded-full blur-[1px] animate-ping" />
                </div>
                {/* Platinum Gold Ring Band */}
                <div className="w-24 h-24 rounded-full border-[6px] border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] -mt-5 bg-transparent" />
                {/* Velvet ring cushion slit */}
                <div className="w-28 h-6 bg-rose-950 rounded-full border border-rose-800 -mt-3 shadow-inner" />
              </div>

              {/* Engraving plate */}
              <div className="absolute bottom-3 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-[10px] font-mono tracking-widest text-amber-200">
                ENGRAVED: HADIA &amp; ALI · FOREVER
              </div>
            </div>

            <p className="mt-4 text-xs font-serif-luxury tracking-wide text-amber-200 italic">
              "For my queen Hadia — the only owner of my heart"
            </p>
          </div>
        )}
      </div>

      {/* Proposal Question & Interactive Yes/No Buttons */}
      {boxOpen && !hasSaidYes && (
        <div className="mt-6 text-center space-y-6 relative z-10">
          <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 max-w-xl mx-auto">
            <p className="text-sm sm:text-base font-serif-luxury text-rose-100 leading-relaxed">
              "Hadia, tumne meri zindagi ko rehmat aur noor se bhar diya hai. Har janam mein, har dua mein, main sirf tumhara haath thaamna chahta hoon. Will you say yes?"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* The Grand YES Button */}
            <button
              onClick={handleSayYes}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(244,63,94,0.6)] border-2 border-rose-300 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 animate-pulse"
            >
              <Heart className="w-6 h-6 fill-white" />
              <span>YES! A THOUSAND TIMES YES! 💍💖</span>
            </button>

            {/* The Playful Dodging NO Button */}
            <button
              onMouseEnter={handleNoDodge}
              onTouchStart={handleNoDodge}
              style={{
                transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                transition: 'all 0.2s ease-out',
              }}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-rose-300 text-sm font-semibold border border-rose-500/20 select-none cursor-pointer"
            >
              {noPhrases[noHoverCount % noPhrases.length]}
            </button>
          </div>
        </div>
      )}

      {/* Celebratory Accepted Screen: Soulmate Certificate */}
      {hasSaidYes && (
        <div className="mt-8 text-center animate-in zoom-in duration-700 relative z-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-950/80 via-black to-rose-950/80 border-2 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.4)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-amber-300 mb-4 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Proposal Officially Accepted · She Said Yes!</span>
            </div>

            <h3 className="font-cursive text-4xl sm:text-6xl text-amber-200 mt-2">
              Hadia &amp; Ali Forever
            </h3>

            <p className="font-serif-luxury text-sm sm:text-base text-rose-200 mt-3 max-w-lg mx-auto leading-relaxed">
              "Mubarak ho! In the grand tapestry of the stars, two souls were written as one: Ali and his Queen Hadia. Bound by love, laughter, and an unbreakable vow."
            </p>

            {/* Official Marriage Vow Certificate Card */}
            <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-amber-100 text-stone-900 border border-amber-400/60 shadow-lg max-w-md mx-auto text-left relative overflow-hidden">
              <div className="text-center pb-3 border-b border-amber-800/20">
                <span className="text-[10px] tracking-widest uppercase font-bold text-amber-900">
                  OFFICIAL LOVE REGISTRY
                </span>
                <div className="font-serif-luxury text-xl font-bold text-rose-950">
                  Certificate of Eternal Soulmates
                </div>
              </div>
              <div className="space-y-2 text-xs font-serif-luxury text-stone-700 py-3">
                <div className="flex justify-between">
                  <span className="font-bold text-stone-900">Husband &amp; Proposer:</span>
                  <span className="font-semibold text-rose-900">Ali</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-stone-900">Beloved Wife:</span>
                  <span className="font-semibold text-rose-900">Hadia</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-stone-900">Vow Status:</span>
                  <span className="font-bold text-emerald-800">Accepted for Eternity 💍</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-stone-900">Love Score:</span>
                  <span className="font-bold text-rose-700">100% Infinite Pure Love</span>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-amber-800/20 text-[11px] font-signature text-rose-900 text-xl">
                Signed by Ali with all my heart ❤️
              </div>
            </div>

            <button
              onClick={() => {
                romanticAudio.playProposalCelebration();
                confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
              }}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate Again with Petals &amp; Fireworks!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
