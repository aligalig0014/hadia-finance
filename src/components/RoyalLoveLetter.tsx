import React, { useState } from 'react';
import { Heart, Sparkles, Volume2, Copy, Check, Feather, BookOpen } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

export const RoyalLoveLetter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);

  const letterVerses = [
    {
      urdu: 'میری جان، میری پیاری بیوی ہادیہ...',
      roman: 'Meri Jaan, Meri Pyari Biwi Hadia...',
      english: 'My Soul, My Beloved Wife Hadia...',
      highlight: true,
    },
    {
      urdu: 'زندگی کے اس سفر میں تم اللہ پاک کا وہ خوبصورت ترین تحفہ ہو جس کا میں ہر سجدے میں شکر ادا کرتا ہوں۔',
      roman: 'Zindagi ke is safar mein tum Allah Tala ka wo khoobsurat-tareen tohfa ho jis ka main har sajday mein shukr ada karta hoon.',
      english: 'In this journey of life, you are the most exquisite gift from the Almighty, for which I thank Him in every prayer.',
    },
    {
      urdu: 'لوگ کہتے ہیں کہ محبت وقت کے ساتھ مدھم پڑ جاتی ہے، مگر میرا دل گواہ ہے کہ تمہارے لیے میرا پیار ہر گزرتے سورج کے ساتھ پہلے سے بھی زیادہ گہرا ہو جاتا ہے۔',
      roman: 'Log kehte hain ke mohabbat waqt ke saath madham parh jaati hai, magar mera dil gawah hai ke tumhare liye mera pyaar har guzartay sooraj ke saath pehle se bhi gehra ho jaata hai.',
      english: 'People say love fades with time, but my heart is witness that my love for you blooms deeper with every passing sunrise.',
    },
    {
      urdu: 'تمہاری ہنسی میرے اداس دنوں کی دوا ہے، اور تمہارا ہاتھ تھامنا میرے لیے دنیا کی سب سے محفوظ پناہ ہے۔',
      roman: 'Tumhari hansi mere udaas dinon ki dawa hai, aur tumhara haath thaamna mere liye dunya ki sab se mehfooz panaah hai.',
      english: 'Your laughter is the cure to my darkest days, and holding your hand is the safest sanctuary in the entire world.',
    },
    {
      urdu: 'تم صرف میری شریکِ حیات نہیں، تم میری سب سے اچھی دوست، میری طاقت، اور میری روح کا سکون ہو۔',
      roman: 'Tum sirf meri shareek-e-hayat nahi, tum meri sab se achi dost, meri taqat, aur meri rooh ka sakoon ho.',
      english: 'You are not merely my life partner; you are my closest best friend, my greatest strength, and the calm to my soul.',
    },
    {
      urdu: 'ہادیہ، میں ہر زندگی میں، ہر جنم میں، صرف اور صرف تمہارا ہونا چاہتا ہوں۔',
      roman: 'Hadia, main har zindagi mein, har morr par, sirf aur sirf tumhara hona chahta hoon.',
      english: 'Hadia, in every life and across every destiny, I want only and forever to belong to you.',
    },
  ];

  const handleCopy = () => {
    romanticAudio.playSparkle();
    const fullText = `💌 A Love Letter from Ali to Hadia 💖\n\n` +
      letterVerses.map(v => `${v.roman}\n"${v.english}"`).join('\n\n') +
      `\n\nForever & Always Yours,\nAli ❤️`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  const handleRecite = (index: number) => {
    setActiveVerse(index);
    romanticAudio.playSparkle();
    romanticAudio.startBgm();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-8">
      {/* Antique Scroll Decorative Edge Top */}
      <div className="flex justify-center -mb-3 z-10 relative">
        <div className="px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-amber-950 font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 border border-amber-300">
          <Feather className="w-3.5 h-3.5 text-amber-950" />
          <span>Ali's Handwritten Love Letter</span>
          <Heart className="w-3 h-3 fill-rose-700 text-rose-700" />
        </div>
      </div>

      {/* Royal Vintage Parchment Paper Body */}
      <div className="relative p-6 sm:p-10 md:p-14 rounded-3xl glass-letter border-2 border-amber-500/40 shadow-2xl overflow-hidden text-stone-900">
        {/* Subtle Ornamental Vintage Corner Filigrees */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-700/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-700/40 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-700/40 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-700/40 rounded-br-xl pointer-events-none" />

        {/* Golden Wax Seal Watermark in Center Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-80 h-80 rounded-full border-8 border-amber-900 flex items-center justify-center">
            <span className="font-cursive text-8xl text-amber-900">A &amp; H</span>
          </div>
        </div>

        {/* Letter Header */}
        <div className="text-center pb-6 border-b border-amber-800/20 mb-8 relative">
          <div className="font-cursive text-4xl sm:text-5xl text-rose-800 mb-2">
            Meri Pyari Hadia
          </div>
          <div className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase text-amber-900/80 font-semibold">
            Dedicated with all my heart to my beloved wife
          </div>
          <div className="flex justify-center items-center gap-3 mt-3 text-amber-700/60">
            <span className="h-[1px] w-16 bg-amber-700/30" />
            <Heart className="w-4 h-4 fill-rose-600 text-rose-600 animate-heartbeat" />
            <span className="h-[1px] w-16 bg-amber-700/30" />
          </div>
        </div>

        {/* Letter Paragraphs & Verses */}
        <div className="space-y-6 relative z-10">
          {letterVerses.map((verse, idx) => (
            <div
              key={idx}
              onClick={() => handleRecite(idx)}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
                activeVerse === idx
                  ? 'bg-amber-100/80 ring-2 ring-rose-400/50 shadow-md'
                  : 'hover:bg-amber-100/40'
              }`}
            >
              {/* Urdu Typography */}
              <p className="text-right text-lg sm:text-2xl font-serif-luxury text-rose-950 font-semibold leading-relaxed mb-1.5" dir="rtl">
                {verse.urdu}
              </p>
              {/* Roman Urdu */}
              <p className="text-sm sm:text-base font-serif-luxury text-stone-800 font-medium leading-relaxed italic">
                "{verse.roman}"
              </p>
              {/* English Meaning */}
              <p className="text-xs sm:text-sm text-stone-600 font-normal mt-1">
                {verse.english}
              </p>
            </div>
          ))}
        </div>

        {/* Letter Closing & Signature */}
        <div className="mt-10 pt-6 border-t border-amber-800/20 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wider text-amber-900/80 font-bold">
              Forever Your Protector &amp; Love,
            </p>
            <div className="font-signature text-4xl sm:text-5xl text-rose-900 mt-1">
              Ali
            </div>
            <p className="text-xs text-stone-500 italic mt-0.5">
              Always &amp; Forever In Love With Hadia
            </p>
          </div>

          {/* Golden Embossed Wax Stamp */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-4 border-amber-400 shadow-xl flex flex-col items-center justify-center text-amber-200 rotate-[-8deg] transform group-hover:rotate-0 transition-transform">
              <span className="font-cursive text-xl font-bold">A &amp; H</span>
              <span className="text-[9px] uppercase tracking-tighter text-amber-300 font-bold">SOULMATES</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-amber-400/80 flex items-center justify-center text-amber-950 text-xs shadow-md">
              💍
            </div>
          </div>
        </div>

        {/* Action Buttons: Copy / Read Mode */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-amber-800/10">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 text-xs font-semibold transition border border-amber-800/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-amber-900" />}
            <span>{copied ? 'Copied to Clipboard! 💌' : 'Copy Love Letter'}</span>
          </button>

          <button
            onClick={() => {
              romanticAudio.playSparkle();
              romanticAudio.startBgm();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-md transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Romantic Violin &amp; Piano</span>
          </button>
        </div>
      </div>
    </div>
  );
};
