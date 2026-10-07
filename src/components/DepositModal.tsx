import React, { useState } from 'react';
import { AdminSettings, DepositRequest, PaymentMethod } from '../types/trade';
import {
  X,
  Copy,
  Check,
  Upload,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminSettings: AdminSettings;
  onSubmitDeposit: (deposit: Omit<DepositRequest, 'id' | 'status' | 'createdAt'>) => void;
  userPhone: string;
  userName: string;
  lang: 'en' | 'ur';
  onOpenAdminPanel?: () => void;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  adminSettings,
  onSubmitDeposit,
  userPhone: initialPhone,
  userName: initialName,
  lang,
  onOpenAdminPanel,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('EASYPAISA');
  const [amount, setAmount] = useState<number>(1000);
  const [senderPhone, setSenderPhone] = useState<string>(initialPhone || '03001234567');
  const [senderName, setSenderName] = useState<string>(initialName || 'Trader Pakistan');
  const [tid, setTid] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentNumber =
    method === 'EASYPAISA'
      ? adminSettings.easypaisaNumber
      : method === 'JAZZCASH'
      ? adminSettings.jazzcashNumber
      : adminSettings.bankAccountNumber;

  const currentTitle =
    method === 'EASYPAISA'
      ? adminSettings.easypaisaTitle
      : method === 'JAZZCASH'
      ? adminSettings.jazzcashTitle
      : `${adminSettings.bankName} - ${adminSettings.bankAccountTitle}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Prepares the WhatsApp message to Admin 03220751456
  const getWhatsAppUrl = () => {
    const cleanAdminPhone = adminSettings.adminPhone.replace(/^0/, '92').replace(/[^0-9]/g, '');
    const methodName =
      method === 'EASYPAISA' ? 'EasyPaisa' : method === 'JAZZCASH' ? 'JazzCash' : 'Bank Transfer';
    const message = `Assalam-o-Alaikum Admin!%0A%0A👑 *HADIA TRADE VIP - NEW DEPOSIT RECEIPT* 👑%0A%0A👤 *User Name:* ${encodeURIComponent(
      senderName || 'HADIA VIP User'
    )}%0A📱 *Sender Phone:* ${senderPhone}%0A💳 *Method:* ${methodName}%0A💰 *Amount Sent:* PKR ${amount.toLocaleString()}%0A🔢 *Transaction ID (TID):* ${
      tid || 'Pending Verification'
    }%0A%0A📎 *Payment Screenshot is attached in this chat! Kindly verify and approve my deposit.*`;

    return `https://wa.me/${cleanAdminPhone}?text=${message}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tid) {
      alert(lang === 'ur' ? 'برائے مہربانی ٹرانزیکشن آئی ڈی (TID) درج کریں!' : 'Please enter the Transaction ID (TID)!');
      return;
    }

    soundManager.playTradePlaced();
    onSubmitDeposit({
      userId: 'user_' + Math.floor(100000 + Math.random() * 900000),
      userName: senderName,
      userPhone: senderPhone,
      amount,
      paymentMethod: method,
      transactionId: tid,
      screenshotUrl: screenshotPreview || undefined,
    });

    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#111624] border border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-1.5">
                HADIA <span className="text-amber-400">VIP</span>
                <span className="text-slate-300 font-extrabold text-sm sm:text-base">
                  {lang === 'ur' ? 'ڈپازٹ پورٹل' : 'Deposit Portal'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ur'
                ? 'ایزی پیسہ / جاز کیش سے رقم بھیجیں، رسید واٹس ایپ 03220751456 پر بھیجیں اور فوری منظوری لیں!'
                : 'Send funds, submit TID & send screenshot to Admin on WhatsApp for instant approval!'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ur' ? 'ڈپازٹ کی درخواست جمع ہو گئی!' : 'Deposit Submitted Successfully!'}
            </h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              {lang === 'ur'
                ? `آپ کا ڈپازٹ (PKR ${amount.toLocaleString()}) ایڈمن پینل کو بھیج دیا گیا ہے۔ ایڈمن (03220751456) تصدیق کر کے فوراً بیلنس ایڈ کرے گا۔`
                : `Your deposit request for PKR ${amount.toLocaleString()} has been queued for Admin verification. Admin (${adminSettings.adminPhone}) will review and approve it shortly.`}
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-md">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ur' ? 'واٹس ایپ پر رسید بھیجیں' : 'Send Screenshot on WhatsApp'}</span>
              </a>

              {onOpenAdminPanel && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ur' ? 'ایڈمن پینل سے پیمنٹ منظوری دیں' : 'Open Admin Panel to Approve'}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSubmittedSuccess(false);
                onClose();
              }}
              className="mt-4 text-xs text-slate-400 hover:text-slate-200"
            >
              {lang === 'ur' ? 'بند کریں' : 'Close window'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                {lang === 'ur' ? 'پیمنٹ کا طریقہ منتخب کریں' : 'Choose Payment Method'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* EasyPaisa */}
                <button
                  type="button"
                  onClick={() => setMethod('EASYPAISA')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'EASYPAISA'
                      ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-extrabold text-sm text-emerald-400">EasyPaisa</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ایزی پیسہ</div>
                </button>

                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setMethod('JAZZCASH')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'JAZZCASH'
                      ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-extrabold text-sm text-amber-400">JazzCash</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">جاز کیش</div>
                </button>

                {/* Bank */}
                <button
                  type="button"
                  onClick={() => setMethod('BANK_TRANSFER')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'BANK_TRANSFER'
                      ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-extrabold text-sm text-blue-400">Bank Transfer</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">بینک اکاؤنٹ</div>
                </button>
              </div>
            </div>

            {/* Admin Account Details Box with One-Click Copy */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-750 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'ur' ? 'ایڈمن کا اکاؤنٹ نمبر:' : 'Admin Account Details:'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Official Admin
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <div className="text-[11px] text-slate-400">Title: <span className="text-white font-bold">{currentTitle}</span></div>
                  <div className="text-lg font-extrabold font-mono-numbers text-emerald-400 tracking-wider">
                    {currentNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'ur'
                    ? `رقم بھیجنے کے بعد سکرین شاٹ ایڈمن کے واٹس ایپ (${adminSettings.adminPhone}) پر بھیجیں!`
                    : `After payment, send screenshot to Admin WhatsApp (${adminSettings.adminPhone})!`}
                </span>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                {lang === 'ur' ? 'ڈپازٹ کی رقم منتخب کریں (PKR)' : 'Select Amount (PKR)'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2">
                {PRESET_AMOUNTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      amount === p
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Rs {p >= 1000 ? `${p / 1000}k` : p}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-500">
                <span className="text-sm font-bold text-slate-400 mr-2">PKR</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(adminSettings.minDeposit, Number(e.target.value) || 0))}
                  min={adminSettings.minDeposit}
                  step="100"
                  className="w-full bg-transparent text-white font-bold outline-none font-mono-numbers"
                  placeholder="Custom Amount"
                  required
                />
              </div>
            </div>

            {/* Sender Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {lang === 'ur' ? 'آپ کا موبائل نمبر' : 'Your Phone Number'}
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {lang === 'ur' ? 'آپ کا اکاؤنٹ کا نام' : 'Your Account Name'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Transaction ID (TID) */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'ٹرانزیکشن آئی ڈی (TID / Trx ID)' : 'Transaction ID (TID)'} *
              </label>
              <input
                type="text"
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                placeholder="e.g. 8472910482 (SMS سے حاصل کردہ)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono-numbers"
                required
              />
            </div>

            {/* Screenshot Upload with Preview */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'پیمنٹ کا سکرین شاٹ لگائیں (رسید)' : 'Upload Payment Screenshot'}
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer transition-colors text-slate-300 text-xs">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>{screenshotPreview ? 'Change Screenshot' : 'Choose Receipt Image / Screenshot'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {screenshotPreview && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-750 shrink-0">
                    <img src={screenshotPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons: WhatsApp to Admin + Submit for Admin Approval */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ur' ? 'واٹس ایپ ایڈمن (03220751456)' : 'Send to Admin WhatsApp'}</span>
              </a>

              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ur' ? 'منظوری کیلئے بھیجیں' : 'Submit for Approval'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
