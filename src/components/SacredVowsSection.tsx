import React, { useState } from 'react';
import { Heart, Sparkles, Shield, Smile, Moon, Gift, Sun, CheckCircle, Star } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

interface Vow {
  id: number;
  icon: typeof Heart;
  title: string;
  urdu: string;
  english: string;
  color: string;
}

export const SacredVowsSection: React.FC = () => {
  const [unlockedVows, setUnlockedVows] = useState<number[]>([1]);

  const vows: Vow[] = [
    {
      id: 1,
      icon: Shield,
      title: 'To Be Your Unbreakable Shield',
      urdu: 'ہر مشکل اور پریشانی کے سامنے تمہاری ڈھال بنوں گا۔ تم کبھی خود کو اکیلا نہیں پاؤ گی۔',
      english: 'I will stand as your shield against every storm. In this life, you will never walk alone.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 2,
      icon: Smile,
      title: 'To Make You Laugh Everyday',
      urdu: 'تمہاری مسکراہٹ میرے لیے دنیا کی سب سے قیمتی چیز ہے۔ ہر دن تمہیں ہنسانے کی کوشش کروں گا۔',
      english: 'Your laughter is the sweetest melody on earth. I will spend every day keeping joy in your heart.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 3,
      icon: Moon,
      title: 'Never Let The Sun Set On Our Anger',
      urdu: 'کبھی بھی کسی ناراضگی کو کل پر نہیں چھوڑوں گا۔ ہمیشہ پہلے معافی مانگ کر تمہیں گلے لگاؤں گا۔',
      english: 'I will never let a misunderstanding steal our night. I will always hold you and make peace first.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: 4,
      icon: Sun,
      title: 'To Respect & Elevate Your Dreams',
      urdu: 'تمہارے خواب میرے خواب ہیں۔ تمہاری کامیابی اور خوشی کے سفر میں تمہارا سب سے بڑا فین بنوں گا۔',
      english: 'Your dreams are my own. I will be your greatest supporter, celebrating every triumph of yours.',
      color: 'from-amber-400 to-rose-500',
    },
    {
      id: 5,
      icon: Gift,
      title: 'To Sweeten Your Days With Surprises',
      urdu: 'تمہیں ہمیشہ یہ یاد دلاتا رہوں گا کہ تم میری شہزادی ہو، چاہے پھولوں سے ہو یا دل کی باتوں سے۔',
      english: 'I promise to surprise you with love, flowers, and gentle reminders that you are my royal queen.',
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 6,
      icon: Star,
      title: 'To Love You Through Every Season of Life',
      urdu: 'جوانی سے لے کر بڑھاپے تک، سفید بالوں تک، میرا پیار تمہارے لیے اسی طرح تروتازہ رہے گا۔',
      english: 'From our youth to our golden years and graying hair, my love for you will remain eternally young.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 7,
      icon: Heart,
      title: 'To Love You In Every Lifetime',
      urdu: 'اگر اللہ مجھے ہزار زندگیاں بھی دے، تو میں ہر زندگی میں صرف اور صرف ہادیہ کو مانگوں گا۔',
      english: 'If Allah blessed me with a thousand lifetimes, I would search the universe to choose only Hadia.',
      color: 'from-rose-600 to-red-600',
    },
  ];

  const handleToggleVow = (id: number) => {
    romanticAudio.playSparkle();
    if (!unlockedVows.includes(id)) {
      setUnlockedVows((prev) => [...prev, id]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>Ali's 7 Sacred Promises</span>
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
        </div>
        <h2 className="font-cursive text-4xl sm:text-5xl text-rose-100">
          My Vows To You, Hadia
        </h2>
        <p className="font-serif-luxury text-sm text-rose-200/80 italic mt-1">
          "ہادیہ کے لیے علی کے وہ سات وعدے جو کبھی نہیں ٹوٹیں گے"
        </p>
      </div>

      {/* Grid of Vow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vows.map((vow) => {
          const isUnlocked = unlockedVows.includes(vow.id);
          const Icon = vow.icon;

          return (
            <div
              key={vow.id}
              onClick={() => handleToggleVow(vow.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isUnlocked
                  ? 'bg-rose-950/40 border-rose-500/40 shadow-lg'
                  : 'bg-black/30 border-rose-500/10 hover:border-rose-500/30 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${vow.color} flex items-center justify-center text-white shadow-md shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                      Promise #{vow.id}
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3 h-3" /> Sealed
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-luxury text-base font-bold text-rose-100 mt-0.5">
                    {vow.title}
                  </h3>
                  <p className="font-serif-luxury text-xs sm:text-sm text-rose-200/90 mt-2 leading-relaxed text-right" dir="rtl">
                    {vow.urdu}
                  </p>
                  <p className="text-xs text-rose-300/70 italic mt-1.5">
                    "{vow.english}"
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => {
            romanticAudio.playSparkle();
            setUnlockedVows(vows.map((v) => v.id));
          }}
          className="px-6 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 text-xs font-semibold border border-rose-500/30 transition"
        >
          ✨ Seal All 7 Promises For Hadia ✨
        </button>
      </div>
    </div>
  );
};
