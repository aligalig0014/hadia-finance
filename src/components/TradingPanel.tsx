import React, { useState } from 'react';
import { Asset, TradeDirection } from '../types/trade';
import { ArrowUpRight, ArrowDownRight, Clock, Plus, Minus } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TradingPanelProps {
  asset: Asset;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  balance: number;
  accountType: 'REAL' | 'DEMO';
  onPlaceTrade: (direction: TradeDirection, amount: number, duration: number) => void;
  onOpenDeposit: () => void;
  lang: 'en' | 'ur';
}

const DURATIONS = [
  { label: '15s', seconds: 15, tag: 'Turbo' },
  { label: '30s', seconds: 30, tag: 'Fast' },
  { label: '60s', seconds: 60, tag: '1 Min' },
  { label: '2m', seconds: 120, tag: '2 Min' },
  { label: '5m', seconds: 300, tag: '5 Min' },
];

const PRESET_AMOUNTS = [200, 500, 1000, 2500, 5000];

export const TradingPanel: React.FC<TradingPanelProps> = ({
  asset,
  assets,
  onSelectAsset,
  balance,
  accountType,
  onPlaceTrade,
  onOpenDeposit,
  lang,
}) => {
  const [amount, setAmount] = useState<number>(500);
  const [duration, setDuration] = useState<number>(30);

  const profitAmount = Math.round(amount * asset.payoutRate);
  const totalReturn = amount + profitAmount;
  const isInsufficient = balance < amount;

  const handleAdjustAmount = (delta: number) => {
    setAmount((prev) => Math.max(100, prev + delta));
  };

  const handleMultiply = (factor: number) => {
    setAmount((prev) => Math.max(100, Math.round(prev * factor)));
  };

  const handleTrade = (direction: TradeDirection) => {
    if (isInsufficient) {
      if (accountType === 'REAL') {
        onOpenDeposit();
      }
      return;
    }
    soundManager.playTradePlaced();
    onPlaceTrade(direction, amount, duration);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 bg-[#111624] border border-slate-800/80 rounded-2xl p-3 shadow-xl select-none">
      {/* 1. TOP: BET BUTTONS (CALL UP & PUT DOWN IN ONE LINE) - Requested at top */}
      <div className="grid grid-cols-2 gap-2 mt-0.5">
        {/* CALL / BUY BUTTON */}
        <button
          onClick={() => handleTrade('UP')}
          className="group relative w-full py-3 px-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-950/60 transition-all flex flex-col sm:flex-row items-center justify-between gap-1 overflow-hidden"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-700/60 flex items-center justify-center text-white shrink-0">
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-left">
              <span className="text-sm font-black tracking-wide block leading-tight">
                {lang === 'ur' ? 'اوپر (CALL)' : 'CALL (UP)'}
              </span>
              <span className="text-[9px] font-medium text-emerald-100 hidden sm:block">
                {lang === 'ur' ? 'اوپر جائے گا' : 'Higher'}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-black font-mono-numbers px-1.5 py-0.5 rounded bg-emerald-700/80">
            +{Math.round(asset.payoutRate * 100)}%
          </span>
        </button>

        {/* PUT / SELL BUTTON */}
        <button
          onClick={() => handleTrade('DOWN')}
          className="group relative w-full py-3 px-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] shadow-lg shadow-rose-950/60 transition-all flex flex-col sm:flex-row items-center justify-between gap-1 overflow-hidden"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-rose-700/60 flex items-center justify-center text-white shrink-0">
              <ArrowDownRight className="w-4 h-4 group-hover:translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-left">
              <span className="text-sm font-black tracking-wide block leading-tight">
                {lang === 'ur' ? 'نیچے (PUT)' : 'PUT (DOWN)'}
              </span>
              <span className="text-[9px] font-medium text-rose-100 hidden sm:block">
                {lang === 'ur' ? 'نیچے جائے گا' : 'Lower'}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-black font-mono-numbers px-1.5 py-0.5 rounded bg-rose-700/80">
            +{Math.round(asset.payoutRate * 100)}%
          </span>
        </button>
      </div>

      {/* Payout & Return Calculation Box */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-slate-900/90 to-blue-950/30 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 text-[11px] block">{lang === 'ur' ? 'منافع شرح' : 'Profit Payout'}</span>
          <span className="text-sm font-extrabold text-emerald-400">+{Math.round(asset.payoutRate * 100)}%</span>
        </div>
        <div className="text-right font-mono-numbers">
          <span className="text-slate-400 text-[11px] block">{lang === 'ur' ? 'متوقع جیت رقم' : 'Potential Return'}</span>
          <span className="text-sm font-black text-white tracking-wide">
            PKR {totalReturn.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Insufficient balance warning / quick deposit */}
      {isInsufficient && (
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
          <p className="text-[11px] text-amber-300 font-medium mb-1">
            {lang === 'ur'
              ? 'بیلنس کم ہے۔ ٹریڈنگ کیلئے ڈپازٹ کریں!'
              : 'Insufficient balance for this trade!'}
          </p>
          <button
            onClick={onOpenDeposit}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow transition-colors"
          >
            {lang === 'ur' ? '⚡ ایزی پیسہ / جاز کیش ڈپازٹ کریں' : '⚡ Deposit with EasyPaisa / JazzCash'}
          </button>
        </div>
      )}

      {/* 2. MIDDLE: INVESTMENT AMOUNT */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <span>{lang === 'ur' ? 'سرمایہ کاری رقم (روپے)' : 'Investment (PKR)'}</span>
          <span className="text-[11px] text-slate-400">Min: Rs 100</span>
        </div>

        {/* Input box with +/- controls */}
        <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
          <button
            onClick={() => handleAdjustAmount(-100)}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center justify-center font-mono-numbers">
            <span className="text-xs font-bold text-slate-400 mr-1">PKR</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(10, Number(e.target.value) || 0))}
              step="50"
              min="100"
              className="w-20 text-center text-base font-bold text-white bg-transparent outline-none"
            />
          </div>

          <button
            onClick={() => handleAdjustAmount(100)}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Amount presets */}
        <div className="grid grid-cols-5 gap-1 mt-1.5">
          {PRESET_AMOUNTS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${
                amount === p
                  ? 'bg-slate-800 border-blue-500 text-blue-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              +{p >= 1000 ? `${p / 1000}k` : p}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() => handleMultiply(0.5)}
            className="flex-1 py-1 text-[11px] font-bold rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            ½ Half
          </button>
          <button
            onClick={() => handleMultiply(2)}
            className="flex-1 py-1 text-[11px] font-bold rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            2× Double
          </button>
          <button
            onClick={() => setAmount(Math.min(balance, 10000))}
            className="flex-1 py-1 text-[11px] font-bold rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            Max
          </button>
        </div>
      </div>

      {/* Trade Duration */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'ur' ? 'ٹریڈ کا وقت (سیکنڈ)' : 'Expiry Time'}
          </span>
          <span className="text-blue-400 font-bold font-mono-numbers">{duration}s</span>
        </div>
        <div className="grid grid-cols-5 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {DURATIONS.map((d) => (
            <button
              key={d.seconds}
              onClick={() => setDuration(d.seconds)}
              className={`py-1 text-xs font-bold rounded-lg transition-all ${
                duration === d.seconds
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. BOTTOM: SELECT MARKET - Moved to the bottom as requested */}
      <div className="pt-1 border-t border-slate-800/60">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
          {lang === 'ur' ? 'مارکیٹ کا انتخاب (Select Market)' : 'Select Market'}
        </label>
        <div className="grid grid-cols-5 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {assets.map((item) => {
            const isSelected = item.id === asset.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAsset(item)}
                className={`px-1 py-1 text-[11px] font-extrabold rounded-lg transition-all text-center truncate ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {item.symbol.split('/')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
