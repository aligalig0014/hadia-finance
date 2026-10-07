import React, { useState } from 'react';
import { PaymentMethod, WithdrawalRequest, AdminSettings } from '../types/trade';
import { X, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  adminSettings: AdminSettings;
  onSubmitWithdrawal: (req: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt'>) => void;
  lang: 'en' | 'ur';
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balance,
  adminSettings,
  onSubmitWithdrawal,
  lang,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('EASYPAISA');
  const [amount, setAmount] = useState<number>(1000);
  const [accountNumber, setAccountNumber] = useState<string>('03001234567');
  const [accountTitle, setAccountTitle] = useState<string>('Muhammad Ali');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > balance) {
      alert(lang === 'ur' ? 'آپ کا بیلنس ناکافی ہے!' : 'Insufficient wallet balance!');
      return;
    }
    if (amount < adminSettings.minWithdrawal) {
      alert(
        lang === 'ur'
          ? `کم سے کم رقم PKR ${adminSettings.minWithdrawal} ہے!`
          : `Minimum withdrawal is PKR ${adminSettings.minWithdrawal}!`
      );
      return;
    }

    soundManager.playTradePlaced();
    onSubmitWithdrawal({
      userId: 'user_current',
      userName: accountTitle,
      accountNumber,
      accountTitle,
      paymentMethod: method,
      amount,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#111624] border border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white">
                HADIYA <span className="text-amber-400">VIP</span>
              </span>
              <span className="text-xs font-bold text-slate-300">
                {lang === 'ur' ? 'رقم نکلوائیں (Withdraw)' : 'Payout Portal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ur'
                ? 'ایزی پیسہ یا جاز کیش اکاؤنٹ میں فوری کیش ٹرانسفر'
                : 'Fast EasyPaisa & JazzCash payout directly to your mobile wallet'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {lang === 'ur' ? 'درخواست ایڈمن کو موصول ہو گئی!' : 'Withdrawal Request Submitted!'}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mb-6">
              {lang === 'ur'
                ? `ایڈمن (${adminSettings.adminPhone}) آپ کی درخواست کا جائزہ لے کر PKR ${amount.toLocaleString()} منتقل کر دے گا۔`
                : `Admin (${adminSettings.adminPhone}) will process PKR ${amount.toLocaleString()} to ${accountNumber} shortly.`}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              {lang === 'ur' ? 'ٹھیک ہے' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">{lang === 'ur' ? 'قابل واپسی بیلنس:' : 'Available Balance:'}</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono-numbers">
                PKR {balance.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'طریقہ منتخب کریں' : 'Withdraw Method'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('EASYPAISA')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs ${
                    method === 'EASYPAISA'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  EasyPaisa (ایزی پیسہ)
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('JAZZCASH')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs ${
                    method === 'JAZZCASH'
                      ? 'border-amber-500 bg-amber-950/30 text-amber-400'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  JazzCash (جاز کیش)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'رقم درج کریں (PKR)' : 'Withdraw Amount (PKR)'}
              </label>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[500, 1000, 2500, 5000].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(Math.min(balance, p))}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      amount === p
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Rs {p >= 1000 ? `${p / 1000}k` : p}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                max={balance}
                min={adminSettings.minWithdrawal}
                step="100"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers font-bold outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'موبائل اکاؤنٹ نمبر (جس پر رقم چاہیے)' : 'Account Mobile Number'}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="03xxxxxxxxx"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500 font-mono-numbers"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'اکاؤنٹ کا نام (Account Title)' : 'Account Holder Title / Name'}
              </label>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={balance < adminSettings.minWithdrawal}
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-950/40 text-sm"
            >
              {lang === 'ur' ? 'درخواست بھیجیں' : 'Submit Withdrawal Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
