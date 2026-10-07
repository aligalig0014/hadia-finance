import React from 'react';
import { TrendingUp, ArrowDownCircle, ArrowUpCircle, Crown, History } from 'lucide-react';
import { UserAccount } from '../types/trade';

interface BottomMobileNavProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  user: UserAccount | null;
  lang: 'en' | 'ur';
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenProfile,
  onOpenAuth,
  user,
  lang,
}) => {
  const scrollToTrades = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full z-40 bg-[#0c101c]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {/* Trade / Market */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex flex-col items-center gap-0.5 py-1 px-2 text-slate-300 hover:text-white transition-colors active:scale-95"
      >
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <span className="text-[10px] font-bold">{lang === 'ur' ? 'مارکیٹ' : 'Trade'}</span>
      </button>

      {/* Deposit */}
      <button
        onClick={onOpenDeposit}
        className="flex flex-col items-center gap-0.5 py-1 px-2 text-emerald-400 hover:text-emerald-300 transition-colors active:scale-95"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 shadow-sm">
          <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-[10px] font-extrabold">{lang === 'ur' ? 'ڈپازٹ' : 'Deposit'}</span>
      </button>

      {/* Withdraw */}
      <button
        onClick={onOpenWithdraw}
        className="flex flex-col items-center gap-0.5 py-1 px-2 text-blue-400 hover:text-blue-300 transition-colors active:scale-95"
      >
        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 shadow-sm">
          <ArrowUpCircle className="w-4 h-4 text-blue-400" />
        </div>
        <span className="text-[10px] font-extrabold">{lang === 'ur' ? 'نکلوائیں' : 'Withdraw'}</span>
      </button>

      {/* Trades History */}
      <button
        onClick={scrollToTrades}
        className="flex flex-col items-center gap-0.5 py-1 px-2 text-slate-300 hover:text-white transition-colors active:scale-95"
      >
        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-sm">
          <History className="w-4 h-4 text-slate-300" />
        </div>
        <span className="text-[10px] font-bold">{lang === 'ur' ? 'ٹریڈز' : 'Trades'}</span>
      </button>

      {/* VIP Profile or Login */}
      <button
        onClick={user ? onOpenProfile : onOpenAuth}
        className="flex flex-col items-center gap-0.5 py-1 px-2 text-amber-400 hover:text-amber-300 transition-colors active:scale-95"
      >
        <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-sm">
          <Crown className="w-4 h-4 text-amber-400" />
        </div>
        <span className="text-[10px] font-extrabold">HADIYA VIP</span>
      </button>
    </div>
  );
};
