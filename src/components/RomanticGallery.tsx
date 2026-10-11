import React, { useState } from 'react';
import { Heart, Sparkles, Camera, Quote, Star } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

export const RomanticGallery: React.FC = () => {
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);

  const reasons = [
    {
      title: 'Your Radiant Smile',
      urdu: 'تمہاری مسکراہٹ میری صبح کا سورج اور رات کا سکون ہے۔',
      english: 'Your smile lights up my darkest days and brings sunshine into my soul.',
      tag: 'PURE JOY',
    },
    {
      title: 'Your Caring & Loving Nature',
      urdu: 'جس محبت اور خلوص سے تم میرا خیال رکھتی ہو، اس کی کوئی مثال نہیں۔',
      english: 'The selfless tenderness with which you care for me has no equal in this world.',
      tag: 'MY QUEEN',
    },
    {
      title: 'Our Late Night Talks & Chai',
      urdu: 'ہمارے درمیان وہ لمبی باتیں، قہقہے اور چائے کا ہر کپ مجھے تم سے اور زیادہ پیار کرواتا ہے۔',
      english: 'Every cup of chai and late night laughter with you makes me fall in love all over again.',
      tag: 'SWEET MOMENTS',
    },
    {
      title: 'You Are My Safest Haven',
      urdu: 'باہر دنیا میں چاہے کتنا ہی طوفان ہو، تمہاری باہوں میں آ کر مجھے سچی پناہ ملتی ہے۔',
      english: 'No matter what happens in the outside world, being with you is my ultimate sanctuary.',
      tag: 'HOME',
    },
    {
      title: 'Allah\'s Greatest Blessing to Me',
      urdu: 'میں نے رب سے جو بھی مانگا، اس نے ہادیہ کی صورت میں مجھے میری اوقات سے بڑھ کر عطا کیا۔',
      english: 'Whenever I prayed to Allah, He answered by blessing my life with Hadia.',
      tag: 'ETERNAL DU\'A',
    },
  ];

  const coupleMoments = [
    {
      title: 'The First Glance',
      date: 'A Blessed Moment',
      caption: 'The moment my heart whispered: She is the one.',
      arabic: 'مَا شَاءَ ٱللَّٰهُ',
    },
    {
      title: 'The Sacred Vows',
      date: 'Our Beautiful Nikkah',
      caption: 'Two hearts, one soul, woven together in the presence of Allah.',
      arabic: 'قَبِلْتُ',
    },
    {
      title: 'Every Little Day with Hadia',
      date: 'Our Sweet Journey',
      caption: 'The best days are simply the ones spent laughing with you.',
      arabic: 'حَبِیبَتِی',
    },
    {
      title: 'Our Forever Future',
      date: 'Till Eternity',
      caption: 'Holding your hand through this life into the gardens of Jannah.',
      arabic: 'إِلَىٰ ٱلأَبَدِ',
    },
  ];

  const romanticShayari = [
    {
      urdu: 'تیری مسکراہٹ سے روشن ہے میرا ہر اک جہاں،\nتو جو ساتھ ہے میرے، تو خوبصورت ہے سارا سماں۔',
      roman: 'Teri muskurahat se roshan hai mera har ik jahan,\nTu jo saath hai mere, toh khoobsurat hai saara samaan.',
      english: 'Your radiant smile illuminates every corner of my world; with you by my side, everything in existence turns beautiful.',
    },
    {
      urdu: 'ہاتھوں میں ہاتھ تیرا، اور عمر بھر کا ساتھ،\nبس اتنی سی ہے ہادیہ، میرے دل کی بات۔',
      roman: 'Haathon mein haath tera, aur umr bhar ka saath,\nBas itni si hai Hadia, mere dil ki baat.',
      english: 'Your hand in my hand, and your companionship for a lifetime; this is the pure, eternal desire of Ali\'s heart.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-14 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Our Love Scrapbook</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="font-cursive text-4xl sm:text-5xl text-rose-100">
          Why Ali Loves Hadia So Deeply
        </h2>
        <p className="font-serif-luxury text-sm text-rose-200/80 italic mt-1">
          "ہادیہ کے لیے علی کی محبت کی وہ وجوہات جن کا کوئی حساب نہیں"
        </p>
      </div>

      {/* Interactive Reasons Carousel / Cards */}
      <div className="p-6 sm:p-8 rounded-3xl glass-romantic border border-rose-500/30 mb-10 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rose-500/20">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
            {reasons[activeReasonIndex].tag} · REASON #{activeReasonIndex + 1}
          </span>
          <div className="flex gap-1.5">
            {reasons.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  romanticAudio.playSparkle();
                  setActiveReasonIndex(i);
                }}
                className={`w-7 h-2 rounded-full transition-all ${
                  activeReasonIndex === i ? 'bg-rose-500 w-10' : 'bg-rose-950 hover:bg-rose-800'
                }`}
                title={`Reason ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="py-6 text-center">
          <h3 className="font-cursive text-3xl sm:text-4xl text-rose-200 mb-3">
            {reasons[activeReasonIndex].title}
          </h3>
          <p className="font-serif-luxury text-xl sm:text-2xl text-rose-100 font-semibold mb-2" dir="rtl">
            {reasons[activeReasonIndex].urdu}
          </p>
          <p className="text-sm sm:text-base text-rose-300/90 font-light italic max-w-lg mx-auto">
            "{reasons[activeReasonIndex].english}"
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => {
              romanticAudio.playSparkle();
              setActiveReasonIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
            }}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-500/30 transition"
          >
            ← Previous Reason
          </button>
          <button
            onClick={() => {
              romanticAudio.playSparkle();
              setActiveReasonIndex((prev) => (prev + 1) % reasons.length);
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition"
          >
            Next Reason →
          </button>
        </div>
      </div>

      {/* Romantic Moments Timeline Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {coupleMoments.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#fffaf5] text-stone-900 shadow-xl border border-amber-300/40 transform hover:-translate-y-1.5 transition-transform"
          >
            {/* Polaroid Photo Frame Placeholder with Art */}
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-tr from-rose-900 via-rose-950 to-purple-950 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden mb-3 border border-stone-200">
              <span className="text-xs font-serif-luxury text-amber-300 mb-1 tracking-widest">
                {m.arabic}
              </span>
              <span className="font-cursive text-2xl text-white">
                Ali &amp; Hadia
              </span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 mt-2 animate-pulse" />
              <div className="absolute bottom-1 right-2 text-[9px] text-rose-200/60 font-mono">
                {m.date}
              </div>
            </div>

            <h4 className="font-serif-luxury text-sm font-bold text-stone-900">
              {m.title}
            </h4>
            <p className="text-xs text-stone-600 italic mt-1 leading-relaxed">
              "{m.caption}"
            </p>
          </div>
        ))}
      </div>

      {/* Romantic Poetry (Shayari) Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/60 via-black to-rose-950/60 border border-rose-500/30">
        <div className="flex items-center gap-2 mb-6 text-rose-300">
          <Quote className="w-5 h-5 text-amber-400" />
          <span className="font-serif-luxury text-xs uppercase tracking-widest font-bold">
            Ali's Romantic Shayari for Hadia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {romanticShayari.map((sh, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/20">
              <p className="text-lg sm:text-xl font-serif-luxury text-rose-100 font-semibold leading-relaxed whitespace-pre-line text-right mb-3" dir="rtl">
                {sh.urdu}
              </p>
              <p className="text-xs sm:text-sm font-serif-luxury text-rose-200/90 italic whitespace-pre-line leading-relaxed">
                "{sh.roman}"
              </p>
              <p className="text-xs text-rose-300/70 mt-2">
                {sh.english}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
