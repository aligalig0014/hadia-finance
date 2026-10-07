import React from 'react';
import { UserAccount, UserWallet } from '../types/trade';
import { X, Crown, ShieldCheck, Mail, Phone, LogOut, Wallet, Award, CheckCircle } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  wallet: UserWallet;
  onLogout: () => void;
  onOpenDeposit: () => void;
  lang: 'en' | 'ur';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  wallet,
  onLogout,
  onOpenDeposit,
  lang,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0f1424] border border-amber-500/40 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">HADIYA VIP Profile</h3>
              <p className="text-[11px] text-amber-400/90 font-bold">{user.vipTier}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141b30] border border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm truncate">{user.name}</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <div className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{user.email}</span>
            </div>
            <div className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5 font-mono-numbers">
              <Phone className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Balance Stats */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">{lang === 'ur' ? 'اصلی والٹ رقم' : 'Real Balance'}</span>
            <span className="text-lg font-black text-emerald-400 font-mono-numbers">
              PKR {wallet.realBalance.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">{lang === 'ur' ? 'ڈیمو پریکٹس رقم' : 'Practice Balance'}</span>
            <span className="text-lg font-black text-amber-400 font-mono-numbers">
              PKR {wallet.demoBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Benefits badge */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>HADIYA VIP Priority Trade Execution & Fast EasyPaisa Verification Enabled</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenDeposit();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>{lang === 'ur' ? 'رقم جمع کریں (EasyPaisa / JazzCash)' : 'Deposit via EasyPaisa / JazzCash'}</span>
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'ur' ? 'اکاؤنٹ سے لاگ آؤٹ کریں' : 'Log Out Account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
