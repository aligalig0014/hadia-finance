import React from 'react';
import { UserWallet, AdminSettings, UserAccount } from '../types/trade';
import {
  Wallet,
  Shield,
  ArrowDownCircle,
  ArrowUpCircle,
  Volume2,
  VolumeX,
  Languages,
  Crown,
  LogIn,
} from 'lucide-react';

interface HeaderProps {
  wallet: UserWallet;
  user: UserAccount | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onToggleAccountType: (type: 'REAL' | 'DEMO') => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenAdmin: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  lang: 'en' | 'ur';
  onToggleLang: () => void;
  adminSettings: AdminSettings;
  pendingDepositsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  user,
  onOpenAuth,
  onOpenProfile,
  onToggleAccountType,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenAdmin,
  soundEnabled,
  onToggleSound,
  lang,
  onToggleLang,
  adminSettings,
  pendingDepositsCount,
}) => {
  const isReal = wallet.accountType === 'REAL';
  const balance = isReal ? wallet.realBalance : wallet.demoBalance;

  // Secret 3-tap gesture to access admin panel without showing it to normal users
  const tapCountRef = React.useRef(0);
  const tapTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onOpenAdmin();
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 1200);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0e17]/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex flex-col gap-2 shadow-xl">
      {/* Top Mobile Bar: Brand, Real/Demo switch, Profile & Lang */}
      <div className="flex items-center justify-between gap-2">
        {/* Brand logo - Discreet secret 3-tap for admin only */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleSecretTap}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-400 p-0.5 shadow-md shadow-amber-500/20 active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#0a0e17] rounded-[9px] flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-white text-sm tracking-tight leading-none">
                HADIYA <span className="text-amber-400">VIP</span>
              </span>
              <span className="px-1 py-0.2 rounded text-[8px] font-black uppercase bg-amber-500 text-slate-950">
                PRO
              </span>
            </div>
            <span className="text-[9px] text-amber-300/80 font-semibold block leading-tight">
              {lang === 'ur' ? 'ٹریڈنگ پورٹل' : 'Live Trading'}
            </span>
          </div>
        </div>

        {/* Demo / Real Switcher Pill */}
        <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
          <button
            onClick={() => onToggleAccountType('DEMO')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              !isReal
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'ur' ? 'ڈیمو' : 'Demo'}
          </button>
          <button
            onClick={() => onToggleAccountType('REAL')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              isReal
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'ur' ? 'ریئل' : 'Real'}
          </button>
        </div>

        {/* Right side controls: Sound, Lang, User */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleLang}
            className="px-1.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold"
          >
            {lang === 'en' ? 'اردو' : 'EN'}
          </button>

          {user ? (
            <button
              onClick={onOpenProfile}
              className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 text-xs font-black flex items-center justify-center shadow"
              title="Profile"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-black shadow"
            >
              <LogIn className="w-3 h-3" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Mobile Wallet Balance + Deposit & Withdraw Buttons */}
      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/60">
        {/* Wallet Balance Display */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-800 font-mono-numbers">
          <Wallet className={`w-3.5 h-3.5 ${isReal ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <div className="text-[9px] text-slate-400 leading-none">
              {isReal ? (lang === 'ur' ? 'اصلی رقم' : 'Real PKR') : (lang === 'ur' ? 'ڈیمو رقم' : 'Demo PKR')}
            </div>
            <div className="text-xs sm:text-sm font-black text-white leading-tight">
              PKR {balance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons: Deposit, Withdraw, Admin */}
        <div className="flex items-center gap-1">
          {/* Deposit */}
          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-950/40 active:scale-95 transition-transform"
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-100" />
            <span>{lang === 'ur' ? 'ڈپازٹ' : 'Deposit'}</span>
          </button>

          {/* Withdraw */}
          <button
            onClick={onOpenWithdraw}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/40 active:scale-95 transition-transform"
          >
            <ArrowUpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'ur' ? 'نکلوائیں' : 'Withdraw'}</span>
          </button>

          {/* Admin Approval Panel Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/40 active:scale-95 transition-transform"
            title="Admin Approval Panel"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ur' ? 'ایڈمن' : 'Admin'}</span>
            {pendingDepositsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center animate-pulse">
                {pendingDepositsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
