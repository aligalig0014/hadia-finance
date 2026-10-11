import React from 'react';
import { X, Coins, TrendingUp, Gamepad2, Award, ShieldAlert, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const WalletModal: React.FC = () => {
  const {
    user,
    isWalletModalOpen,
    setIsWalletModalOpen,
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    gameSessions,
    setActiveTab
  } = useGame();

  if (!isWalletModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0c1020] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-base gold-gradient-text">Virtual Demo Wallet</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                No Real Cash Value
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Balance Card */}
        <div className="p-4 rounded-2xl glass-panel-gold gold-glow relative overflow-hidden">
          <div className="flex flex-col">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              Current Virtual Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl">🪙</span>
              <span className="font-display font-black text-4xl text-amber-400">
                {user.virtualCoins.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-200">Coins</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Today Earned</span>
              <span className="font-bold text-xs text-emerald-400">+{user.todayEarned}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Games</span>
              <span className="font-bold text-xs text-purple-300">{user.totalGames}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Winnings</span>
              <span className="font-bold text-xs text-amber-300">+{user.totalWinnings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Deposit & Withdraw Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              setIsWalletModalOpen(false);
              setIsDepositModalOpen(true);
            }}
            className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <span>+</span>
            <span>Deposit (Recharge)</span>
          </button>

          <button
            onClick={() => {
              setIsWalletModalOpen(false);
              setIsWithdrawModalOpen(true);
            }}
            className="py-3 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400 text-purple-200 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <span>Withdraw (Nikalna)</span>
          </button>
        </div>

        {/* Policy Notice */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Virtual Currency Notice:</strong> All coins, deposits, and withdrawals on ALI KING GAME are
            strictly virtual demo entertainment transactions. There are no real cash payouts.
          </p>
        </div>

        {/* Quick Earn CTA */}
        <button
          onClick={() => {
            setIsWalletModalOpen(false);
            setActiveTab('rewards');
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Claim More Free Daily Coins in Rewards</span>
          <span>⚡</span>
        </button>

        {/* Transaction & Session History */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Recent Virtual Transactions</span>
            </span>
            <span className="text-slate-500">{gameSessions.length} records</span>
          </div>

          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {gameSessions.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-4">No game rounds played yet.</p>
            ) : (
              gameSessions.map(sess => (
                <div
                  key={sess.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        sess.coinsEarned > 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sess.coinsEarned > 0 ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <Gamepad2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{sess.gameName}</p>
                      <p className="text-[10px] text-slate-400">{sess.details || sess.timestamp}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        sess.coinsEarned > 0 ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {sess.coinsEarned > 0 ? `+${sess.coinsEarned}` : '0'} Coins
                    </span>
                    <span className="block text-[9px] text-slate-500">{sess.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
