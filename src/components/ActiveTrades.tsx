import React from 'react';
import { Trade } from '../types/trade';
import { Clock, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

interface ActiveTradesProps {
  activeTrades: Trade[];
  tradeHistory: Trade[];
  currentPrice: number;
  lang: 'en' | 'ur';
}

export const ActiveTrades: React.FC<ActiveTradesProps> = ({
  activeTrades,
  tradeHistory,
  currentPrice,
  lang,
}) => {
  const [tab, setTab] = React.useState<'active' | 'history'>('active');

  return (
    <div className="w-full bg-[#111624] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Tab Header */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            tab === 'active'
              ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'ur' ? 'جاری ٹریڈز' : 'Active Trades'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600/30 text-blue-300 font-mono-numbers">
            {activeTrades.length}
          </span>
        </button>

        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            tab === 'history'
              ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>{lang === 'ur' ? 'پچھلی ہسٹری' : 'History'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono-numbers">
            {tradeHistory.length}
          </span>
        </button>
      </div>

      <div className="p-3 max-h-56 overflow-y-auto">
        {tab === 'active' && (
          <div className="flex flex-col gap-2">
            {activeTrades.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                {lang === 'ur' ? 'فی الحال کوئی ایکٹو ٹریڈ نہیں ہے۔ اوپر یا نیچے کا بٹن دبائیں!' : 'No active trades right now. Click CALL or PUT to trade!'}
              </div>
            ) : (
              activeTrades.map((trade) => {
                const isUp = trade.direction === 'UP';
                const isWinning = isUp ? currentPrice > trade.strikePrice : currentPrice < trade.strikePrice;
                const timeLeft = Math.max(0, Math.ceil((trade.closeTime - Date.now()) / 1000));
                const potentialProfit = Math.round(trade.amount * trade.payoutRate);

                return (
                  <div
                    key={trade.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span>{trade.assetName}</span>
                          <span className={`text-[10px] px-1 rounded ${isUp ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'}`}>
                            {trade.direction}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono-numbers">
                          Strike: ${trade.strikePrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Timer</div>
                      <span className="font-mono-numbers font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {timeLeft}s
                      </span>
                    </div>

                    <div className="text-right font-mono-numbers">
                      <div className="font-bold text-white">PKR {trade.amount.toLocaleString()}</div>
                      <div className={`text-[11px] font-bold ${isWinning ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isWinning ? `+PKR ${potentialProfit.toLocaleString()}` : `-PKR ${trade.amount.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="flex flex-col gap-2">
            {tradeHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                {lang === 'ur' ? 'ابھی تک کوئی مکمل ٹریڈ نہیں ہے' : 'No trade history yet.'}
              </div>
            ) : (
              tradeHistory.slice(0, 15).map((trade) => {
                const won = trade.status === 'WON';
                const isUp = trade.direction === 'UP';

                return (
                  <div
                    key={trade.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          won ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {won ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{trade.assetName}</span>
                          <span className={`text-[10px] px-1 rounded ${isUp ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                            {trade.direction}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono-numbers">
                          ${trade.strikePrice.toFixed(2)} → ${(trade.closePrice || trade.strikePrice).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono-numbers">
                      <div className="font-bold text-white">PKR {trade.amount.toLocaleString()}</div>
                      <div className={`text-xs font-bold ${won ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {won ? `+PKR ${trade.profit.toLocaleString()}` : `-PKR ${trade.amount.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
