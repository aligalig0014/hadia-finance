import React, { useState } from 'react';
import { MessageCircle, X, ChevronUp, ShieldCheck } from 'lucide-react';

interface WhatsAppFloatProps {
  adminPhone: string;
  lang: 'en' | 'ur';
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ adminPhone, lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cleanPhone = adminPhone.replace(/^0/, '92').replace(/[^0-9]/g, '');

  const openWhatsAppWithMessage = (text: string) => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-16 right-3 sm:right-[max(0.75rem,calc(50vw-230px+0.75rem))] z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-72 bg-[#111728] border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
              <span className="font-extrabold text-xs text-white">
                {lang === 'ur' ? 'ایڈمن واٹس ایپ ہیلپ لائن' : 'Admin WhatsApp Hotline'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-300 mb-3 font-mono-numbers">
            {lang === 'ur' ? 'نمبر:' : 'Hotline:'} <b className="text-emerald-400 font-bold">{adminPhone}</b>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ur'
                ? 'ایزی پیسہ / جاز کیش ڈپازٹ سکرین شاٹ بھیجیں اور 2 منٹ میں اپروول حاصل کریں!'
                : 'Send your payment screenshot for 2-min instant deposit verification!'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <button
              onClick={() =>
                openWhatsAppWithMessage('Assalam-o-Alaikum Admin! I want to submit my payment screenshot for deposit approval.')
              }
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left font-medium text-slate-200 transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ur' ? '📸 سکرین شاٹ بھیجیں' : '📸 Send Payment Screenshot'}</span>
              <ChevronUp className="w-3.5 h-3.5 rotate-90 text-slate-500" />
            </button>

            <button
              onClick={() =>
                openWhatsAppWithMessage('Assalam-o-Alaikum! Please check my pending deposit approval.')
              }
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left font-medium text-slate-200 transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ur' ? '⚡ ڈپازٹ کنفرمیشن' : '⚡ Check Deposit Status'}</span>
              <ChevronUp className="w-3.5 h-3.5 rotate-90 text-slate-500" />
            </button>

            <button
              onClick={() =>
                openWhatsAppWithMessage('Assalam-o-Alaikum! Help me with EasyPaisa / JazzCash withdrawal.')
              }
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left font-medium text-slate-200 transition-colors flex items-center justify-between"
            >
              <span>{lang === 'ur' ? '💰 رقم واپسی (Withdraw)' : '💰 Withdrawal Assistance'}</span>
              <ChevronUp className="w-3.5 h-3.5 rotate-90 text-slate-500" />
            </button>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'ur' ? 'براہ راست چیٹ شروع کریں' : 'Chat Directly on WhatsApp'}</span>
          </a>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-2xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        title="Admin WhatsApp: 03220751456"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#111728] animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#111728] flex items-center justify-center text-[9px] font-black">
          1
        </span>
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden sm:inline font-bold text-xs pr-1">
          {adminPhone}
        </span>
      </button>
    </div>
  );
};
