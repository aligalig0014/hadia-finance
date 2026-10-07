/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ASSETS, generateInitialCandles } from './data/assets';
import {
  Asset,
  Candle,
  DepositRequest,
  Trade,
  TradeDirection,
  UserWallet,
  WithdrawalRequest,
  AdminSettings,
} from './types/trade';
import {
  getAdminSettings,
  saveAdminSettings,
  getWallet,
  saveWallet,
  getDeposits,
  saveDeposits,
  getWithdrawals,
  saveWithdrawals,
  getTrades,
  saveTrades,
  getActiveUser,
  setActiveUserSession,
} from './utils/storage';
import { UserAccount } from './types/trade';
import { Header } from './components/Header';
import { TradingChart } from './components/TradingChart';
import { TradingPanel } from './components/TradingPanel';
import { ActiveTrades } from './components/ActiveTrades';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { WinModal } from './components/WinModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { BottomMobileNav } from './components/BottomMobileNav';
import { soundManager } from './utils/audio';
import { Sparkles, CheckCircle2, Crown, ShieldCheck } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [candles, setCandles] = useState<Candle[]>(() =>
    generateInitialCandles(ASSETS[0].basePrice, 45)
  );
  const [currentPrice, setCurrentPrice] = useState<number>(ASSETS[0].basePrice);

  // User auth state
  const [activeUser, setActiveUser] = useState<UserAccount | null>(getActiveUser);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Storage states
  const [wallet, setWallet] = useState<UserWallet>(getWallet);
  const [adminSettings, setAdminSettingsState] = useState<AdminSettings>(getAdminSettings);
  const [deposits, setDeposits] = useState<DepositRequest[]>(getDeposits);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(getWithdrawals);
  const [trades, setTrades] = useState<Trade[]>(getTrades);

  // Modal controls
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [winningTrade, setWinningTrade] = useState<Trade | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live Toast for Admin Actions / Notices
  const [notification, setNotification] = useState<string | null>(null);

  const handleAuthSuccess = (user: UserAccount) => {
    setActiveUser(user);
    setNotification(`Welcome, ${user.name}! HADIYA VIP Access Activated.`);
  };

  const handleLogout = () => {
    setActiveUserSession(null);
    setActiveUser(null);
    setNotification('Logged out successfully.');
  };

  // Secret footer 3-tap for admin access (hidden from regular users)
  const footerTapCountRef = useRef(0);
  const footerTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFooterSecretTap = () => {
    footerTapCountRef.current += 1;
    if (footerTapTimerRef.current) clearTimeout(footerTapTimerRef.current);
    if (footerTapCountRef.current >= 3) {
      footerTapCountRef.current = 0;
      setIsAdminOpen(true);
    } else {
      footerTapTimerRef.current = setTimeout(() => {
        footerTapCountRef.current = 0;
      }, 1200);
    }
  };

  // Price ticking engine
  const candlesRef = useRef(candles);
  candlesRef.current = candles;

  const currentPriceRef = useRef(currentPrice);
  currentPriceRef.current = currentPrice;

  const selectedAssetRef = useRef(selectedAsset);
  selectedAssetRef.current = selectedAsset;

  // Whenever user switches asset, generate candles
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    const newCandles = generateInitialCandles(asset.basePrice, 45);
    setCandles(newCandles);
    setCurrentPrice(newCandles[newCandles.length - 1]?.close || asset.basePrice);
  };

  // Live Market Simulation Loop (Ticks every 1000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const asset = selectedAssetRef.current;
      const currentCandles = candlesRef.current;
      const prevPrice = currentPriceRef.current;

      // Realistic random-walk tick with micro trend
      const volatility = asset.basePrice * 0.0006;
      const noise = (Math.random() - 0.495) * volatility;
      const nextPrice = +(prevPrice + noise).toFixed(asset.decimals);
      setCurrentPrice(nextPrice);

      const now = Date.now();
      const lastCandle = currentCandles[currentCandles.length - 1];

      // Form a new candle every 3 seconds, else update current candle
      if (lastCandle && now - lastCandle.timestamp < 3000) {
        const updatedLast: Candle = {
          ...lastCandle,
          high: Math.max(lastCandle.high, nextPrice),
          low: Math.min(lastCandle.low, nextPrice),
          close: nextPrice,
          volume: lastCandle.volume + Math.floor(Math.random() * 2),
        };
        setCandles([...currentCandles.slice(0, -1), updatedLast]);
      } else {
        const newCandle: Candle = {
          timestamp: now,
          open: prevPrice,
          high: Math.max(prevPrice, nextPrice),
          low: Math.min(prevPrice, nextPrice),
          close: nextPrice,
          volume: Math.floor(Math.random() * 20) + 5,
        };
        // Keep maximum 50 candles in memory
        setCandles([...currentCandles.slice(-49), newCandle]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Trade Resolution Loop (Checks every 500ms)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const openTrades = trades.filter((t) => t.status === 'OPEN');
      if (openTrades.length === 0) return;

      let walletUpdated = false;
      let newWallet = { ...wallet };
      const updatedTrades = [...trades];

      openTrades.forEach((trade) => {
        if (trade.closeTime <= now) {
          const finalPrice = currentPriceRef.current;
          const isUp = trade.direction === 'UP';
          const isWin = isUp ? finalPrice > trade.strikePrice : finalPrice < trade.strikePrice;

          const tradeIndex = updatedTrades.findIndex((t) => t.id === trade.id);
          if (tradeIndex !== -1) {
            if (isWin) {
              const profit = Math.round(trade.amount * trade.payoutRate);
              const totalPayout = trade.amount + profit;

              updatedTrades[tradeIndex] = {
                ...trade,
                status: 'WON',
                closePrice: finalPrice,
                profit,
              };

              // Credit wallet
              if (trade.accountType === 'REAL') {
                newWallet.realBalance += totalPayout;
                newWallet.totalWon += profit;
              } else {
                newWallet.demoBalance += totalPayout;
                newWallet.totalWon += profit;
              }
              walletUpdated = true;

              soundManager.playWin();
              setWinningTrade(updatedTrades[tradeIndex]);
            } else {
              updatedTrades[tradeIndex] = {
                ...trade,
                status: 'LOST',
                closePrice: finalPrice,
                profit: -trade.amount,
              };
              soundManager.playLoss();
            }
          }
        }
      });

      if (walletUpdated) {
        setWallet(newWallet);
        saveWallet(newWallet);
      }
      setTrades(updatedTrades);
      saveTrades(updatedTrades);
    }, 500);

    return () => clearInterval(timer);
  }, [trades, wallet]);

  // Place a new trade
  const handlePlaceTrade = (direction: TradeDirection, amount: number, durationSeconds: number) => {
    const isReal = wallet.accountType === 'REAL';
    const balance = isReal ? wallet.realBalance : wallet.demoBalance;

    if (balance < amount) return;

    // Deduct investment upfront
    const newWallet: UserWallet = {
      ...wallet,
      realBalance: isReal ? wallet.realBalance - amount : wallet.realBalance,
      demoBalance: !isReal ? wallet.demoBalance - amount : wallet.demoBalance,
      totalTrades: wallet.totalTrades + 1,
    };
    setWallet(newWallet);
    saveWallet(newWallet);

    const now = Date.now();
    const newTrade: Trade = {
      id: 'TRD-' + Math.floor(100000 + Math.random() * 900000),
      assetId: selectedAsset.id,
      assetName: selectedAsset.symbol,
      direction,
      amount,
      payoutRate: selectedAsset.payoutRate,
      strikePrice: currentPrice,
      openTime: now,
      durationSeconds,
      closeTime: now + durationSeconds * 1000,
      status: 'OPEN',
      profit: 0,
      accountType: wallet.accountType,
    };

    const nextTrades = [newTrade, ...trades];
    setTrades(nextTrades);
    saveTrades(nextTrades);
  };

  // Submit new deposit from User
  const handleSubmitDeposit = (newDepData: Omit<DepositRequest, 'id' | 'status' | 'createdAt'>) => {
    const newDep: DepositRequest = {
      ...newDepData,
      id: 'DEP-' + Math.floor(10000 + Math.random() * 90000),
      status: 'PENDING',
      createdAt: Date.now(),
    };
    const updated = [newDep, ...deposits];
    setDeposits(updated);
    saveDeposits(updated);

    setNotification(
      lang === 'ur'
        ? `ڈپازٹ درخواست جمع ہو گئی۔ ایڈمن (${adminSettings.adminPhone}) واٹس ایپ پر چیک کرے گا!`
        : `Deposit request logged. Admin (${adminSettings.adminPhone}) will verify on WhatsApp!`
    );
  };

  // Submit new withdrawal from User
  const handleSubmitWithdrawal = (newWithData: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt'>) => {
    if (wallet.realBalance < newWithData.amount) return;

    // Deduct balance from Real wallet immediately
    const updatedWallet: UserWallet = {
      ...wallet,
      realBalance: wallet.realBalance - newWithData.amount,
    };
    setWallet(updatedWallet);
    saveWallet(updatedWallet);

    const newWith: WithdrawalRequest = {
      ...newWithData,
      id: 'WTH-' + Math.floor(10000 + Math.random() * 90000),
      status: 'PENDING',
      createdAt: Date.now(),
    };
    const updated = [newWith, ...withdrawals];
    setWithdrawals(updated);
    saveWithdrawals(updated);

    setNotification(
      lang === 'ur'
        ? `رقم واپسی کی درخواست جمع ہو گئی! ایڈمن منظور کرے گا۔`
        : `Withdrawal request submitted for Admin review!`
    );
  };

  // Admin approves deposit -> credits real balance immediately!
  const handleApproveDeposit = (depositId: string) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep || dep.status !== 'PENDING') return;

    const updated = deposits.map((d) =>
      d.id === depositId ? { ...d, status: 'APPROVED' as const, reviewedAt: Date.now() } : d
    );
    setDeposits(updated);
    saveDeposits(updated);

    // Credit real wallet
    const updatedWallet: UserWallet = {
      ...wallet,
      realBalance: wallet.realBalance + dep.amount,
    };
    setWallet(updatedWallet);
    saveWallet(updatedWallet);

    setNotification(`✓ Deposit Approved! PKR ${dep.amount.toLocaleString()} credited to Real Wallet.`);
  };

  // Admin rejects deposit
  const handleRejectDeposit = (depositId: string) => {
    const updated = deposits.map((d) =>
      d.id === depositId ? { ...d, status: 'REJECTED' as const, reviewedAt: Date.now() } : d
    );
    setDeposits(updated);
    saveDeposits(updated);
    setNotification('Deposit rejected by Admin.');
  };

  // Admin approves withdrawal
  const handleApproveWithdrawal = (withdrawalId: string) => {
    const updated = withdrawals.map((w) =>
      w.id === withdrawalId ? { ...w, status: 'APPROVED' as const, reviewedAt: Date.now() } : w
    );
    setWithdrawals(updated);
    saveWithdrawals(updated);
    setNotification('✓ Withdrawal marked approved and payment sent.');
  };

  // Admin rejects withdrawal -> refund user real balance
  const handleRejectWithdrawal = (withdrawalId: string) => {
    const item = withdrawals.find((w) => w.id === withdrawalId);
    if (!item) return;

    const updated = withdrawals.map((w) =>
      w.id === withdrawalId ? { ...w, status: 'REJECTED' as const, reviewedAt: Date.now() } : w
    );
    setWithdrawals(updated);
    saveWithdrawals(updated);

    // Refund wallet
    const updatedWallet: UserWallet = {
      ...wallet,
      realBalance: wallet.realBalance + item.amount,
    };
    setWallet(updatedWallet);
    saveWallet(updatedWallet);
    setNotification('Withdrawal rejected. Amount refunded to user wallet.');
  };

  // Admin settings update
  const handleSaveSettings = (settings: AdminSettings) => {
    setAdminSettingsState(settings);
    saveAdminSettings(settings);
  };

  const pendingDepositsCount = deposits.filter((d) => d.status === 'PENDING').length;
  const activeTradesList = trades.filter((t) => t.status === 'OPEN');
  const historyTradesList = trades.filter((t) => t.status !== 'OPEN');

  return (
    <div className="min-h-screen bg-[#07090e] flex justify-center text-slate-100 antialiased font-sans">
      {/* Mobile Screen Shell Container - Exact mobile proportions, centered on desktop */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[92vh] sm:my-3 sm:rounded-[32px] sm:border sm:border-slate-800/80 bg-[#0b0e14] shadow-2xl flex flex-col relative pb-20 overflow-hidden">
        {/* Top Mobile Bar Notice - Pure clean status with zero admin exposure */}
        <div className="bg-gradient-to-r from-amber-950/70 via-[#111728] to-emerald-950/70 border-b border-amber-500/30 px-3 py-1.5 text-[11px] flex items-center justify-between gap-1 text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-extrabold text-amber-300 truncate">HADIYA VIP:</span>
            <span className="font-bold text-emerald-400 truncate">
              {lang === 'ur' ? '100% اصلی ایزی پیسہ اور جاز کیش' : '100% Real EasyPaisa & JazzCash'}
            </span>
          </div>

          <span className="text-[10px] text-slate-400 font-mono-numbers shrink-0">
            24/7 Live
          </span>
        </div>

        {/* Main App Navigation Header */}
        <Header
          wallet={wallet}
          user={activeUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onToggleAccountType={(type) => {
            const updated = { ...wallet, accountType: type };
            setWallet(updated);
            saveWallet(updated);
          }}
          onOpenDeposit={() => setIsDepositOpen(true)}
          onOpenWithdraw={() => setIsWithdrawOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundManager.enabled = next;
          }}
          lang={lang}
          onToggleLang={() => setLang(lang === 'en' ? 'ur' : 'en')}
          adminSettings={adminSettings}
          pendingDepositsCount={pendingDepositsCount}
        />

        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-16 left-3 right-3 z-50 bg-[#141b2e] border border-blue-500/40 text-blue-200 px-3 py-2 rounded-xl shadow-2xl flex items-center justify-between gap-2 text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white text-xs font-bold shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Pure Mobile Trading Workspace */}
        <main className="flex-1 w-full p-2.5 flex flex-col gap-2.5">
          {/* Quick Deposit Banner for Real Accounts with 0 balance */}
          {wallet.accountType === 'REAL' && wallet.realBalance === 0 && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/40 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-white truncate">Fund Your Real Account</div>
                  <div className="text-[10px] text-slate-400 truncate">Via EasyPaisa & JazzCash</div>
                </div>
              </div>

              <button
                onClick={() => setIsDepositOpen(true)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-md transition-colors"
              >
                Deposit Now
              </button>
            </div>
          )}

          {/* Real-time Interactive Candlestick / Line Chart */}
          <TradingChart
            asset={selectedAsset}
            candles={candles}
            activeTrades={activeTradesList}
            currentPrice={currentPrice}
          />

          {/* Trade Execution Panel (Buttons in ONE Line) */}
          <TradingPanel
            asset={selectedAsset}
            assets={ASSETS}
            onSelectAsset={handleSelectAsset}
            balance={wallet.accountType === 'REAL' ? wallet.realBalance : wallet.demoBalance}
            accountType={wallet.accountType}
            onPlaceTrade={handlePlaceTrade}
            onOpenDeposit={() => setIsDepositOpen(true)}
            lang={lang}
          />

          {/* Active Trades & Trade History */}
          <div className="w-full">
            <ActiveTrades
              activeTrades={activeTradesList}
              tradeHistory={historyTradesList}
              currentPrice={currentPrice}
              lang={lang}
            />
          </div>
        </main>

        {/* Streamlined Mobile Footer with Secret Tap for Admin */}
        <footer className="mt-auto border-t border-slate-800/80 bg-[#0a0d14] px-3 py-3 text-[11px] text-slate-500 text-center flex items-center justify-between">
          <span
            onClick={handleFooterSecretTap}
            className="font-extrabold text-amber-400 cursor-pointer select-none active:opacity-75"
            title="HADIYA Trade Pro"
          >
            HADIYA Trade Pro
          </span>
          <span className="font-mono-numbers text-slate-400">
            {lang === 'ur' ? 'سپورٹ:' : 'Support:'} {adminSettings.adminPhone}
          </span>
        </footer>

        {/* Sticky Bottom Navigation Bar for Mobile */}
        <BottomMobileNav
          onOpenDeposit={() => setIsDepositOpen(true)}
          onOpenWithdraw={() => setIsWithdrawOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          user={activeUser}
          lang={lang}
        />

        {/* Floating WhatsApp Quick Contact Button */}
        <WhatsAppFloat
          adminPhone={adminSettings.adminPhone}
          lang={lang}
        />
      </div>

      {/* Deposit Modal (EasyPaisa / JazzCash / WhatsApp Screenshot) */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        adminSettings={adminSettings}
        onSubmitDeposit={handleSubmitDeposit}
        userPhone={activeUser?.phone || '03220751456'}
        userName={activeUser?.name || 'HADIYA VIP Trader'}
        lang={lang}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
      />

      {/* Withdrawal Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={wallet.realBalance}
        adminSettings={adminSettings}
        onSubmitWithdrawal={handleSubmitWithdrawal}
        lang={lang}
      />

      {/* Admin Approval Panel Modal (Passcode: alig0014) */}
      <AdminPanelModal
        key={isAdminOpen ? 'admin-open' : 'admin-closed'}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        deposits={deposits}
        withdrawals={withdrawals}
        adminSettings={adminSettings}
        onApproveDeposit={handleApproveDeposit}
        onRejectDeposit={handleRejectDeposit}
        onApproveWithdrawal={handleApproveWithdrawal}
        onRejectWithdrawal={handleRejectWithdrawal}
        onSaveSettings={handleSaveSettings}
        lang={lang}
      />

      {/* Secure User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        lang={lang}
      />

      {/* User Profile & VIP Status Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={activeUser}
        wallet={wallet}
        onLogout={handleLogout}
        onOpenDeposit={() => setIsDepositOpen(true)}
        lang={lang}
      />

      {/* Trade Win Celebratory Modal */}
      <WinModal
        trade={winningTrade}
        onClose={() => setWinningTrade(null)}
        lang={lang}
      />
    </div>
  );
}
