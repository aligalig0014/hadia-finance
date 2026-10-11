import React, { useState } from 'react';
import { X, ArrowUpRight, CheckCircle2, AlertCircle, History, Shield, Wallet, Smartphone, Building2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

type WithdrawMethod = 'easypaisa' | 'jazzcash' | 'bank';

export const WithdrawModal: React.FC = () => {
  const { isWithdrawModalOpen, setIsWithdrawModalOpen, simulateWithdraw, withdrawals, user } = useGame();

  const [method, setMethod] = useState<WithdrawMethod>('easypaisa');
  const [accountTitle, setAccountTitle] = useState<string>(user.name || '');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<number>(500);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isWithdrawModalOpen) return null;

  const handlePercentage = (pct: number) => {
    const calculated = Math.floor((user.virtualCoins * pct) / 100);
    setAmount(Math.max(200, calculated));
    setErrorMsg('');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!accountTitle.trim() || !accountNumber.trim()) {
      setErrorMsg('Meharbani karke account title aur number darj karein.');
      return;
    }

    const methodName = method === 'easypaisa' ? 'EasyPaisa' : method === 'jazzcash' ? 'JazzCash' : 'Bank Transfer';
    const res = simulateWithdraw(method, methodName, accountTitle.trim(), accountNumber.trim(), amount);

    if (res.success) {
      setSuccessMsg(`Withdrawal Request Kamyab! ${amount.toLocaleString()} virtual coins dispatched.`);
      setTimeout(() => {
        setSuccessMsg('');
        setIsWithdrawModalOpen(false);
      }, 1800);
    } else {
      setErrorMsg(res.error || 'Withdrawal failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0c1020] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-brand font-black text-base purple-gradient-text">
                  DEMO WITHDRAW / NIKALWANA
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SIMULATOR
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Paisa Nikalwayen • Virtual Payout Simulator</p>
            </div>
          </div>

          <button
            onClick={() => setIsWithdrawModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Available Withdrawable Balance:</span>
            <span className="font-display font-black text-xl text-amber-300">
              🪙 {user.virtualCoins.toLocaleString()} Coins
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Min Withdraw:</span>
            <span className="font-mono text-xs font-bold text-slate-200">200 Coins</span>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Method Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            1. Payout Method (Kahan Paise Bhejne Hain?):
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setMethod('easypaisa')}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition flex flex-col items-center gap-1 ${
                method === 'easypaisa'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>EasyPaisa</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('jazzcash')}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition flex flex-col items-center gap-1 ${
                method === 'jazzcash'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>JazzCash</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('bank')}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition flex flex-col items-center gap-1 ${
                method === 'bank'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bank Transfer</span>
            </button>
          </div>
        </div>

        {/* Amount Input & Percentage Buttons */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              2. Amount (Kitna Withdraw Krna Hai?):
            </label>
            <span className="font-mono text-xs font-bold text-amber-400">
              {amount.toLocaleString()} Coins
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min={200}
              max={user.virtualCoins}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              Coins
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-1">
            <button
              type="button"
              onClick={() => handlePercentage(25)}
              className="py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => handlePercentage(50)}
              className="py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => handlePercentage(75)}
              className="py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => handlePercentage(100)}
              className="py-1.5 rounded-lg bg-purple-600/30 border border-purple-500 text-xs font-bold text-purple-300 hover:bg-purple-600/50"
            >
              MAX 100%
            </button>
          </div>
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleWithdraw} className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Account Title (Name on Account):
            </label>
            <input
              type="text"
              placeholder="e.g. Ali Khan"
              value={accountTitle}
              onChange={e => setAccountTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Account Number / IBAN:
            </label>
            <input
              type="text"
              placeholder="e.g. 03451234567 or Bank IBAN"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={user.virtualCoins < 200 || amount > user.virtualCoins}
            className={`w-full py-3.5 rounded-xl font-display font-black text-sm tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
              user.virtualCoins < 200 || amount > user.virtualCoins
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 text-white purple-glow active:scale-95'
            }`}
          >
            <ArrowUpRight className="w-5 h-5" />
            <span>SUBMIT WITHDRAW REQUEST ({amount.toLocaleString()} COINS)</span>
          </button>
        </form>

        {/* Safety Disclaimer */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2 text-[10px] text-slate-400">
          <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            <strong>Simulation Note:</strong> Withdrawals are demo simulation entries demonstrating game mechanics with virtual entertainment credits.
          </span>
        </div>

        {/* Withdrawal History */}
        {withdrawals.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>Recent Payout Requests:</span>
            </span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {withdrawals.slice(0, 4).map(w => (
                <div
                  key={w.id}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200">{w.accountTitle} ({w.methodName})</span>
                    <span className="block text-[9px] text-slate-500">{w.accountNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-300">-{w.amount.toLocaleString()}</span>
                    <span className="block text-[9px] text-emerald-400 font-semibold">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
