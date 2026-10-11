import React, { useState } from 'react';
import { X, ArrowDownCircle, CheckCircle2, Copy, Shield, Sparkles, AlertCircle, History, Smartphone, Building2, Coins } from 'lucide-react';
import { useGame } from '../context/GameContext';

type PaymentMethod = 'easypaisa' | 'jazzcash' | 'bank' | 'crypto';

interface MethodConfig {
  id: PaymentMethod;
  name: string;
  accountNumber: string;
  accountTitle: string;
  badge: string;
  badgeColor: string;
}

const METHODS: MethodConfig[] = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    accountNumber: '032207514560',
    accountTitle: 'ALI KING OFFICIAL EASYPAISA',
    badge: 'VERIFIED',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    accountNumber: '0300-1122334',
    accountTitle: 'ALI KING RECHARGE DEMO',
    badge: 'POPULAR',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    accountNumber: 'PK82 MEZN 0001 2345 6789 01',
    accountTitle: 'ALI KING ENTERTAINMENT',
    badge: 'DIRECT',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  {
    id: 'crypto',
    name: 'USDT / Crypto',
    accountNumber: 'TRX7xAliKingDemoWalletUSDT892',
    accountTitle: 'TRC-20 Virtual Network',
    badge: 'GLOBAL',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  }
];

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

export const DepositModal: React.FC = () => {
  const { isDepositModalOpen, setIsDepositModalOpen, simulateDeposit, deposits, user } = useGame();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('easypaisa');
  const [amount, setAmount] = useState<number>(1000);
  const [senderAccount, setSenderAccount] = useState<string>('');
  const [senderName, setSenderName] = useState<string>(user.name || '');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  if (!isDepositModalOpen) return null;

  const currentMethod = METHODS.find(m => m.id === selectedMethod)!;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const generatedTrx = trxId.trim() || `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;
    simulateDeposit(
      selectedMethod,
      currentMethod.name,
      senderAccount || '0300-XXXXXXX',
      senderName || user.name,
      amount,
      generatedTrx
    );

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsDepositModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0c1020] border-t sm:border border-amber-500/40 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-brand font-black text-base gold-gradient-text">
                  DEMO DEPOSIT / RECHARGE
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SIMULATOR
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Paisa Jama Karein • Virtual Coins Recharge</p>
            </div>
          </div>

          <button
            onClick={() => setIsDepositModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Aapka Mojuda Balance:</span>
          <span className="font-display font-black text-base text-amber-400">
            🪙 {user.virtualCoins.toLocaleString()} Coins
          </span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            1. Select Payment Method (Payment Option Chunein):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {METHODS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedMethod === m.id
                    ? 'bg-amber-500/20 border-amber-400 text-white gold-glow'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white">{m.name}</span>
                  <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 truncate">Demo Account</span>
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Instruction Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#18132e] to-[#0d0f20] border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{currentMethod.name} Demo Number:</span>
            <button
              onClick={() => handleCopy(currentMethod.accountNumber)}
              className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="font-mono font-black text-base text-amber-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>{currentMethod.accountNumber}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Account Title:</span>
            <span className="font-semibold text-slate-200">{currentMethod.accountTitle}</span>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              2. Deposit Amount (Paisa / Coins):
            </label>
            <span className="font-mono text-xs font-bold text-amber-400">
              Selected: {amount.toLocaleString()} Coins
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_AMOUNTS.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`py-2 rounded-xl font-mono text-xs font-bold border transition ${
                  amount === amt
                    ? 'bg-amber-500 border-yellow-300 text-slate-950 gold-glow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                +{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleSubmitDeposit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Aapka Mobile / Sender Number:
              </label>
              <input
                type="text"
                placeholder="e.g. 03001234567"
                value={senderAccount}
                onChange={e => setSenderAccount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Transaction ID (TID optional):
              </label>
              <input
                type="text"
                placeholder="Auto-generated if empty"
                value={trxId}
                onChange={e => setTrxId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Success Overlay */}
          {showSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs text-center font-bold animate-bounce flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Deposit Kamyab! +{amount.toLocaleString()} virtual coins add ho gaye!</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:opacity-95 text-slate-950 font-display font-black text-sm tracking-wider shadow-lg gold-glow active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5 text-slate-950" />
            <span>CONFIRM RECHARGE (+{amount.toLocaleString()} COINS)</span>
          </button>
        </form>

        {/* Safety Disclaimer */}
        <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-2 text-[10px] text-purple-200">
          <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            <strong>Demo Simulator:</strong> This is an authentic educational simulation. No actual bank transfers or real money transactions occur. All recharges credit virtual play coins only.
          </span>
        </div>

        {/* Deposit History */}
        {deposits.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Pichli Recharge History:</span>
            </span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {deposits.slice(0, 4).map(d => (
                <div
                  key={d.id}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200">{d.methodName}</span>
                    <span className="block text-[9px] text-slate-500 font-mono">TID: {d.trxId}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">+{d.amount.toLocaleString()}</span>
                    <span className="block text-[9px] text-slate-500">{d.timestamp}</span>
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
