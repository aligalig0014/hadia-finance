import React, { useEffect } from 'react';
import { Trade } from '../types/trade';
import { Trophy, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface WinModalProps {
  trade: Trade | null;
  onClose: () => void;
  lang: 'en' | 'ur';
}

export const WinModal: React.FC<WinModalProps> = ({ trade, onClose, lang }) => {
  useEffect(() => {
    if (trade) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [trade, onClose]);

  if (!trade) return null;

  const isWin = trade.status === 'WON';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div className="pointer-events-auto relative max-w-sm w-full bg-[#111728]/95 backdrop-blur-xl border border-emerald-500/50 rounded-3xl p-6 text-center shadow-2xl shadow-emerald-950/80 animate-in fade-in zoom-in duration-300">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial from-emerald-500/20 via-transparent to-transparent rounded-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto mb-3 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-slate-950">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ur' ? 'کامیاب ٹریڈ!' : 'TRADE RESULT'}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <h3 className="text-2xl font-black text-white mb-1">
          {isWin
            ? lang === 'ur'
              ? 'مبارک ہو! آپ جیت گئے!'
              : 'PROFIT SECURED! 🎉'
            : lang === 'ur'
            ? 'ٹریڈ بند ہو گئی'
            : 'Trade Closed'}
        </h3>

        <div className="my-4 p-3.5 rounded-2xl bg-black/40 border border-slate-800 font-mono-numbers">
          <span className="text-xs text-slate-400 block mb-0.5">
            {lang === 'ur' ? 'خالص منافع' : 'Net Profit Added'}
          </span>
          <span className="text-3xl font-black text-emerald-400 tracking-tight">
            +PKR {trade.profit.toLocaleString()}
          </span>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-2">
            <span>{trade.assetName}</span>
            <span className="flex items-center gap-0.5 font-bold text-white">
              {trade.direction === 'UP' ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
              {trade.direction}
            </span>
            <span>Strike: ${trade.strikePrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/60 transition-transform active:scale-95"
        >
          {lang === 'ur' ? 'جاری رکھیں' : 'Continue Trading'}
        </button>
      </div>
    </div>
  );
};
