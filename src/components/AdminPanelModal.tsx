import React, { useState } from 'react';
import { AdminSettings, DepositRequest, WithdrawalRequest, UserAccount } from '../types/trade';
import { getStoredUsers } from '../utils/storage';
import {
  X,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  MessageCircle,
  TrendingUp,
  CreditCard,
  Lock,
  Unlock,
  Save,
  Clock,
  Phone,
  Users,
  Mail,
  Crown,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  adminSettings: AdminSettings;
  onApproveDeposit: (depositId: string) => void;
  onRejectDeposit: (depositId: string) => void;
  onApproveWithdrawal: (withdrawalId: string) => void;
  onRejectWithdrawal: (withdrawalId: string) => void;
  onSaveSettings: (settings: AdminSettings) => void;
  lang: 'en' | 'ur';
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  deposits,
  withdrawals,
  adminSettings,
  onApproveDeposit,
  onRejectDeposit,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onSaveSettings,
  lang,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'users' | 'settings'>('deposits');
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [userList, setUserList] = useState<UserAccount[]>(getStoredUsers);

  // Editable settings state
  const [editableSettings, setEditableSettings] = useState<AdminSettings>(adminSettings);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // User requirement: Whenever admin panel is closed or backed out of, must require login again!
  React.useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setPinInput('');
      setPinError('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setPinError('');
    onClose();
  };

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalizedInput = pinInput.trim().toLowerCase();
    const validCodes = [
      adminSettings.adminPin.toLowerCase(),
      'alig0014',
    ];
    if (validCodes.includes(normalizedInput)) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError(lang === 'ur' ? 'غلط سیکیورٹی کوڈ! رسائی مسترد۔' : 'Incorrect Security Passcode. Access denied.');
    }
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(editableSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const pendingDeposits = deposits.filter((d) => d.status === 'PENDING');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING');

  const totalApprovedDeposits = deposits
    .filter((d) => d.status === 'APPROVED')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f1422] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#141b2e] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 text-xs font-bold transition-colors"
              title={lang === 'ur' ? 'واپس جائیں اور لاگ آؤٹ کریں' : 'Back & Lock'}
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ur' ? 'واپس' : 'Back'}</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white">
                  {lang === 'ur' ? 'ایڈمن کنٹرول اور منظوری پینل' : 'Admin Approval Portal'}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {adminSettings.adminPhone}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                {lang === 'ur'
                  ? 'ایزی پیسہ، جاز کیش رسیدوں کی تصدیق اور فوری بیلنس منظوری'
                  : 'Verify EasyPaisa & JazzCash receipts & payouts'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPinInput('');
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                title="Lock Admin"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'لاک کریں' : 'Lock'}</span>
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'ur' ? 'خفیہ ایڈمن رسائی' : 'Security Passcode Required'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {lang === 'ur'
                ? 'ایڈمن کنٹرول روم تک رسائی کیلئے خفیہ پاس کوڈ درج کریں'
                : 'Enter secret security passcode to access portal'}
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-3 text-center text-lg font-mono-numbers text-white tracking-widest outline-none focus:border-blue-500"
                  autoFocus
                />
                {pinError && <p className="text-xs text-rose-400 mt-1">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-950/40 transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{lang === 'ur' ? 'تصدیق کریں اور داخل ہوں' : 'Verify & Unlock'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#111728] border-b border-slate-800 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ur' ? 'زیر التوا ڈپازٹس' : 'Pending Deposits'}</span>
                <span className="text-lg font-bold text-amber-400 font-mono-numbers">
                  {pendingDeposits.length} reqs
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ur' ? 'منظور شدہ ڈپازٹس' : 'Approved Deposits'}</span>
                <span className="text-lg font-bold text-emerald-400 font-mono-numbers">
                  PKR {totalApprovedDeposits.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ur' ? 'زیر التوا رقم واپسی' : 'Pending Payouts'}</span>
                <span className="text-lg font-bold text-blue-400 font-mono-numbers">
                  {pendingWithdrawals.length} reqs
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ur' ? 'ایڈمن واٹس ایپ' : 'Admin WhatsApp'}</span>
                <span className="text-sm font-bold text-white font-mono-numbers flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {adminSettings.adminPhone}
                </span>
              </div>
            </div>

            {/* Navigation Tabs - Horizontally scrollable on mobile */}
            <div className="flex border-b border-slate-800 bg-[#0d1220] px-3 sm:px-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('deposits')}
                className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                  activeTab === 'deposits'
                    ? 'border-blue-500 text-blue-400 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{lang === 'ur' ? 'ڈپازٹ منظوری' : 'Deposits'}</span>
                {pendingDeposits.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
                    {pendingDeposits.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'border-blue-500 text-blue-400 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{lang === 'ur' ? 'رقم واپسی' : 'Withdrawals'}</span>
                {pendingWithdrawals.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {pendingWithdrawals.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setUserList(getStoredUsers());
                  setActiveTab('users');
                }}
                className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                  activeTab === 'users'
                    ? 'border-amber-500 text-amber-400 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ur' ? 'صارفین کی تفصیلات' : 'User Details'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono-numbers">
                  {userList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-400 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{lang === 'ur' ? 'سیٹنگز' : 'Settings'}</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {/* DEPOSITS TAB */}
              {activeTab === 'deposits' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span>
                      {lang === 'ur'
                        ? 'تمام ڈپازٹ درخواستیں (EasyPaisa & JazzCash TID تصدیق کریں)'
                        : 'Review submitted deposit receipts & credit user wallets'}
                    </span>
                    <span>Total: {deposits.length} requests</span>
                  </div>

                  {deposits.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      {lang === 'ur' ? 'کوئی ڈپازٹ درخواست موجود نہیں ہے' : 'No deposit requests logged.'}
                    </div>
                  ) : (
                    deposits.map((dep) => {
                      const isPending = dep.status === 'PENDING';
                      const isApproved = dep.status === 'APPROVED';

                      return (
                        <div
                          key={dep.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            isPending
                              ? 'bg-slate-900/95 border-amber-500/40 shadow-lg'
                              : isApproved
                              ? 'bg-slate-900/60 border-emerald-500/20 opacity-85'
                              : 'bg-slate-900/40 border-slate-800 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* User & Transaction Info */}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-white text-sm">
                                  {dep.userName}
                                </span>
                                <span className="font-mono-numbers text-xs text-slate-400">
                                  ({dep.userPhone})
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    dep.paymentMethod === 'EASYPAISA'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : dep.paymentMethod === 'JAZZCASH'
                                      ? 'bg-amber-500/20 text-amber-400'
                                      : 'bg-blue-500/20 text-blue-400'
                                  }`}
                                >
                                  {dep.paymentMethod}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                    isPending
                                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                                      : isApproved
                                      ? 'bg-emerald-500/30 text-emerald-300'
                                      : 'bg-rose-500/30 text-rose-300'
                                  }`}
                                >
                                  {dep.status}
                                </span>
                              </div>

                              <div className="mt-1.5 flex items-center gap-4 text-xs font-mono-numbers">
                                <div>
                                  <span className="text-slate-400">TID: </span>
                                  <span className="font-bold text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">
                                    {dep.transactionId}
                                  </span>
                                </div>
                                <div className="text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>

                            {/* Amount & Screenshot & Actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <div className="text-right">
                                <span className="text-xs text-slate-400 block">{lang === 'ur' ? 'رقم' : 'Amount'}</span>
                                <span className="text-lg font-extrabold text-emerald-400 font-mono-numbers">
                                  PKR {dep.amount.toLocaleString()}
                                </span>
                              </div>

                              {/* Screenshot Preview Button */}
                              {dep.screenshotUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewScreenshot(dep.screenshotUrl || null)}
                                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 flex items-center gap-1 text-xs"
                                  title="View Payment Screenshot"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="hidden sm:inline">Receipt</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">No image</span>
                              )}

                              {/* WhatsApp Contact User */}
                              <a
                                href={`https://wa.me/${dep.userPhone.replace(/^0/, '92')}?text=Assalam-o-Alaikum! Regarding your deposit of PKR ${dep.amount} on PakTrade Pro (TID: ${dep.transactionId})`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Approve / Reject Buttons */}
                              {isPending && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      soundManager.playApproval();
                                      onApproveDeposit(dep.id);
                                    }}
                                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{lang === 'ur' ? 'منظور کریں' : 'Approve'}</span>
                                  </button>

                                  <button
                                    onClick={() => onRejectDeposit(dep.id)}
                                    className="px-2.5 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold text-xs transition-all flex items-center gap-1"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>{lang === 'ur' ? 'مسترد' : 'Reject'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* WITHDRAWALS TAB */}
              {activeTab === 'withdrawals' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span>
                      {lang === 'ur'
                        ? 'صارفین کی رقم نکلوانے کی درخواستیں'
                        : 'Review and approve customer withdrawal requests'}
                    </span>
                    <span>Total: {withdrawals.length}</span>
                  </div>

                  {withdrawals.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      {lang === 'ur' ? 'کوئی رقم واپسی کی درخواست نہیں ہے' : 'No withdrawal requests.'}
                    </div>
                  ) : (
                    withdrawals.map((wth) => {
                      const isPending = wth.status === 'PENDING';
                      return (
                        <div
                          key={wth.id}
                          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{wth.accountTitle}</span>
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                                {wth.paymentMethod}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isPending ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                }`}
                              >
                                {wth.status}
                              </span>
                            </div>
                            <div className="mt-1 font-mono-numbers text-slate-300">
                              Send to: <b className="text-white">{wth.accountNumber}</b> ({wth.accountTitle})
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <div className="text-right font-mono-numbers">
                              <span className="text-xs text-slate-400 block">Amount</span>
                              <span className="text-lg font-extrabold text-blue-400">
                                PKR {wth.amount.toLocaleString()}
                              </span>
                            </div>

                            {isPending && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onApproveWithdrawal(wth.id)}
                                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                                >
                                  {lang === 'ur' ? 'پیمنٹ بھیج دی (منظور)' : 'Mark Paid & Approve'}
                                </button>
                                <button
                                  onClick={() => onRejectWithdrawal(wth.id)}
                                  className="px-2.5 py-2 rounded-xl bg-rose-600/30 text-rose-300 font-bold text-xs"
                                >
                                  {lang === 'ur' ? 'مسترد' : 'Reject'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* USERS TAB - Complete User Details for Admin */}
              {activeTab === 'users' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span>
                      {lang === 'ur'
                        ? 'رجسٹرڈ صارفین کی تمام تفصیلات (نام، ای میل، موبائل نمبر، VIP اسٹیٹس)'
                        : 'Registered User Directory (Name, Email, Phone, VIP Tier, Registration Time)'}
                    </span>
                    <span className="font-bold text-amber-400 font-mono-numbers">
                      Total: {userList.length} Users
                    </span>
                  </div>

                  {userList.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      {lang === 'ur' ? 'کوئی رجسٹرڈ صارف موجود نہیں ہے' : 'No registered users found.'}
                    </div>
                  ) : (
                    userList.map((usr) => {
                      const regDate = new Date(usr.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      const cleanPhone = usr.phone.replace(/^0/, '92');

                      return (
                        <div
                          key={usr.id}
                          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 transition-all shadow-md"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* User Header */}
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-md">
                                {usr.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-white text-sm">
                                    {usr.name}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                    <Crown className="w-3 h-3 text-amber-400" />
                                    <span>{usr.vipTier}</span>
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                                    Verified ✓
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono-numbers mt-0.5">
                                  User ID: <b className="text-slate-300">{usr.id}</b>
                                </div>
                              </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-300 font-mono-numbers bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
                                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{usr.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800 truncate">
                                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <span className="truncate">{usr.email}</span>
                              </div>
                            </div>

                            {/* Actions & Reg Date */}
                            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                              <div className="text-left sm:text-right text-[11px] text-slate-400">
                                <span className="block text-[10px] uppercase">Registered</span>
                                <span className="font-mono-numbers text-slate-300">{regDate}</span>
                              </div>

                              <a
                                href={`https://wa.me/${cleanPhone}?text=Assalam-o-Alaikum ${encodeURIComponent(usr.name)}! Contacting you from HADIYA Trade Pro Admin.`}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold transition-colors flex items-center gap-1.5"
                                title="Chat with User on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 max-w-xl">
                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                      ✓ {lang === 'ur' ? 'سیٹنگز کامیابی سے محفوظ ہو گئیں!' : 'Settings saved successfully!'}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      {lang === 'ur' ? 'ایڈمن کا واٹس ایپ نمبر (03220751456)' : 'Admin Contact / WhatsApp Number'}
                    </label>
                    <input
                      type="text"
                      value={editableSettings.adminPhone}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, adminPhone: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers text-sm outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        EasyPaisa Number (ایزی پیسہ نمبر)
                      </label>
                      <input
                        type="text"
                        value={editableSettings.easypaisaNumber}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, easypaisaNumber: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        EasyPaisa Account Title
                      </label>
                      <input
                        type="text"
                        value={editableSettings.easypaisaTitle}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, easypaisaTitle: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        JazzCash Number (جاز کیش نمبر)
                      </label>
                      <input
                        type="text"
                        value={editableSettings.jazzcashNumber}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, jazzcashNumber: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        JazzCash Account Title
                      </label>
                      <input
                        type="text"
                        value={editableSettings.jazzcashTitle}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, jazzcashTitle: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Min Deposit (PKR)
                      </label>
                      <input
                        type="number"
                        value={editableSettings.minDeposit}
                        onChange={(e) =>
                          setEditableSettings({
                            ...editableSettings,
                            minDeposit: Number(e.target.value) || 100,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500 font-mono-numbers"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Admin Security PIN
                      </label>
                      <input
                        type="password"
                        value={editableSettings.adminPin}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, adminPin: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500 font-mono-numbers"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-950/40"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'ur' ? 'سیٹنگز محفوظ کریں' : 'Save Admin Settings'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Screenshot Viewer Modal Overlay */}
        {previewScreenshot && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-sm font-bold text-white">Payment Receipt Screenshot</span>
                <button
                  onClick={() => setPreviewScreenshot(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={previewScreenshot}
                alt="Payment Receipt"
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
