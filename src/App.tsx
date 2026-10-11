import React, { useState } from 'react';
import { PetalRainCanvas } from './components/PetalRainCanvas';
import { RomanticOpeningCurtain } from './components/RomanticOpeningCurtain';
import { CoupleEmbraceScene } from './components/CoupleEmbraceScene';
import { RoyalLoveLetter } from './components/RoyalLoveLetter';
import { ProposalRingCeremony } from './components/ProposalRingCeremony';
import { SacredVowsSection } from './components/SacredVowsSection';
import { RomanticGallery } from './components/RomanticGallery';
import { SoulmateMeter } from './components/SoulmateMeter';
import { RomanticAudioPlayer } from './components/RomanticAudioPlayer';
import { GiftRoseModal } from './components/GiftRoseModal';
import { Heart, Sparkles, Feather, Crown, Gift, Music2 } from 'lucide-react';
import { romanticAudio } from './utils/romanticAudio';
import confetti from 'canvas-confetti';

export function App() {
  const [showOpeningCurtain, setShowOpeningCurtain] = useState(true);
  const [petalDensity, setPetalDensity] = useState<'gentle' | 'romantic' | 'storm'>('romantic');
  const [heartsCount, setHeartsCount] = useState(786);
  const [activeSection, setActiveSection] = useState<'all' | 'hug' | 'letter' | 'proposal' | 'vows'>('all');
  const [isRoseModalOpen, setIsRoseModalOpen] = useState(false);

  const handleSendHeart = () => {
    romanticAudio.playSparkle();
    setHeartsCount((c) => c + 1);
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.2, x: 0.8 },
      colors: ['#f43f5e', '#fb7185', '#fef08a'],
    });
  };

  const handleOpenRoseGift = () => {
    romanticAudio.playSparkle();
    setIsRoseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b030e] text-rose-50 flex flex-col font-sans select-none antialiased relative overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* 1. Interactive Petal Rain Shower with Real Physics */}
      <PetalRainCanvas density={petalDensity} interactive={true} />

      {/* 2. Breathtaking Grand Opening Envelope */}
      {showOpeningCurtain && (
        <RomanticOpeningCurtain onOpen={() => setShowOpeningCurtain(false)} />
      )}

      {/* 3. Floating Music & Audio / Petals Controls */}
      <RomanticAudioPlayer
        petalDensity={petalDensity}
        onDensityChange={(d) => setPetalDensity(d)}
        onReplayOpening={() => {
          setShowOpeningCurtain(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSendHeart={handleSendHeart}
        heartsCount={heartsCount}
      />

      {/* Ambient Starlight & Nebula Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-rose-950/40 via-purple-950/20 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Header Presentation */}
      <header className="pt-16 sm:pt-20 pb-8 px-4 text-center relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-4 shadow-lg">
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span>A Royal Love Confession · Ali &amp; Hadia</span>
          <Crown className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl text-rose-100 drop-shadow-[0_4px_25px_rgba(244,63,94,0.6)] leading-tight">
          Meri Pyari Hadia
        </h1>

        <p className="font-serif-luxury text-base sm:text-xl text-rose-200/90 font-medium italic mt-3 max-w-2xl mx-auto leading-relaxed">
          "تم میری زندگی کا سب سے خوبصورت تحفہ ہو، میری صبح کی روشنی اور میری رات کا سکون۔"
        </p>

        <p className="text-xs sm:text-sm text-rose-300/70 tracking-widest uppercase font-semibold mt-2">
          Ali's Forever Proposal To His Beloved Wife
        </p>

        {/* Featured Interactive "Gift a Rose" Hero Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleOpenRoseGift}
            className="group relative px-7 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-pink-600 text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_0_35px_rgba(225,29,72,0.6)] border-2 border-rose-300 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 animate-pulse"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🌹</span>
            <span>Gift a Rose to Hadia</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        </div>

        {/* Quick Romantic Jump Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => {
              setActiveSection('all');
              romanticAudio.playSparkle();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/20'
            }`}
          >
            All Experiences ✨
          </button>
          <button
            onClick={handleOpenRoseGift}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md hover:from-red-500 hover:to-rose-500 transition flex items-center gap-1"
          >
            <span>Gift a Rose 🌹</span>
          </button>
          <button
            onClick={() => {
              setActiveSection('hug');
              romanticAudio.playSparkle();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === 'hug'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/20'
            }`}
          >
            Couple Embrace 🫂
          </button>
          <button
            onClick={() => {
              setActiveSection('proposal');
              romanticAudio.playSparkle();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === 'proposal'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/20'
            }`}
          >
            The Ring Proposal 💍
          </button>
          <button
            onClick={() => {
              setActiveSection('letter');
              romanticAudio.playSparkle();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === 'letter'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/20'
            }`}
          >
            Love Letter 💌
          </button>
          <button
            onClick={() => {
              setActiveSection('vows');
              romanticAudio.playSparkle();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === 'vows'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/20'
            }`}
          >
            Ali's 7 Vows 💖
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full px-4 pb-20 relative z-10 space-y-12 sm:space-y-16">
        {/* Section 1: Animated Couple Embrace (Video-Style Hug Scene) */}
        {(activeSection === 'all' || activeSection === 'hug') && (
          <section className="animate-in fade-in duration-500">
            <CoupleEmbraceScene onHeartTrigger={handleSendHeart} />
          </section>
        )}

        {/* Section 2: The Grand Proposal & Solitaire Ring Box */}
        {(activeSection === 'all' || activeSection === 'proposal') && (
          <section className="animate-in fade-in duration-500">
            <ProposalRingCeremony onProposalAccepted={handleSendHeart} />
          </section>
        )}

        {/* Section 3: Royal Handwritten Love Letter */}
        {(activeSection === 'all' || activeSection === 'letter') && (
          <section className="animate-in fade-in duration-500">
            <RoyalLoveLetter />
          </section>
        )}

        {/* Section 4: Ali's 7 Sacred Promises to Hadia */}
        {(activeSection === 'all' || activeSection === 'vows') && (
          <section className="animate-in fade-in duration-500">
            <SacredVowsSection />
          </section>
        )}

        {/* Section 5: Why Ali Loves Hadia & Polaroid Memories */}
        {activeSection === 'all' && (
          <>
            <RomanticGallery />
            <SoulmateMeter />
          </>
        )}
      </main>

      {/* Romantic Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-rose-500/20 bg-black/60 text-center">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="font-cursive text-3xl sm:text-4xl text-rose-200">
            Hadia &amp; Ali
          </div>
          <p className="font-serif-luxury text-xs sm:text-sm text-rose-300/80 italic">
            "A love story written by Allah, cherished every single day, and celebrated for all eternity."
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-8 h-[1px] bg-rose-500/30" />
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span className="w-8 h-[1px] bg-rose-500/30" />
          </div>
          <p className="text-[11px] text-rose-400/60 uppercase tracking-widest font-mono">
            Crafted with all of Ali's devotion for his beloved wife Hadia ❤️
          </p>
        </div>
      </footer>

      {/* Floating Interactive Gift a Rose Button */}
      <button
        onClick={handleOpenRoseGift}
        className="fixed bottom-5 left-5 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(225,29,72,0.6)] border border-rose-300 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
        title="Surprise Hadia with a Bouquet of Roses"
      >
        <span className="text-lg group-hover:rotate-12 transition-transform">🌹</span>
        <span className="font-semibold">Gift a Rose</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
      </button>

      {/* Interactive Bouquet of Roses Modal */}
      <GiftRoseModal
        isOpen={isRoseModalOpen}
        onClose={() => setIsRoseModalOpen(false)}
      />
    </div>
  );
}

export default App;
