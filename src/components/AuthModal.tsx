import React, { useState } from 'react';
import { UserAccount } from '../types/trade';
import { registerNewUser, authenticateUser } from '../utils/storage';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  lang: 'en' | 'ur';
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  lang,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError(lang === 'ur' ? 'برائے مہربانی اپنا نام درج کریں!' : 'Please enter your full name!');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError(
            lang === 'ur'
              ? 'پاس ورڈ کم از کم 6 ہندسوں کا ہونا ضروری ہے!'
              : 'Password must be at least 6 characters long!'
          );
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError(lang === 'ur' ? 'پاس ورڈز آپس میں نہیں ملتے!' : 'Passwords do not match!');
          setLoading(false);
          return;
        }

        const res = await registerNewUser(name, email, phone, password);
        if (res.success && res.user) {
          soundManager.playApproval();
          onAuthSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Failed to register account.');
        }
      } else {
        // Login
        const res = await authenticateUser(email, password);
        if (res.success && res.user) {
          soundManager.playApproval();
          onAuthSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    const res = await authenticateUser('hadiya@trade.pk', 'admin123');
    if (res.success && res.user) {
      soundManager.playApproval();
      onAuthSuccess(res.user);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0f1424] border border-amber-500/30 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 overflow-hidden">
        {/* Top Gold Glowing Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0f1424] rounded-[10px] flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  HADIYA <span className="text-amber-400">VIP</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Secure
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'ur'
                  ? 'محفوظ اکاؤنٹ بنائیں یا لاگ ان کریں'
                  : 'Encrypted & Secure Member Access'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 my-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'ur' ? 'لاگ ان کریں (Sign In)' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === 'register'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'ur' ? 'نیا اکاؤنٹ بنائیں (Register)' : 'Register'}
          </button>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="p-3 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {lang === 'ur' ? 'مکمل نام' : 'Full Name'}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-amber-500">
                  <User className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. HADIYA Khan"
                    className="w-full bg-transparent text-white text-xs sm:text-sm outline-none"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {lang === 'ur' ? 'موبائل نمبر (EasyPaisa / JazzCash)' : 'Mobile Phone (03xxxxxxxxx)'}
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-amber-500 font-mono-numbers">
                  <Phone className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03220751456"
                    className="w-full bg-transparent text-white text-xs sm:text-sm outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              {lang === 'ur' ? 'ای میل ایڈریس' : 'Email Address'}
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-amber-500">
              <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-white text-xs sm:text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              {lang === 'ur' ? 'پاس ورڈ' : 'Password'}
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-amber-500">
              <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-white text-xs sm:text-sm outline-none font-mono-numbers"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 ml-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {lang === 'ur' ? 'پاس ورڈ کی تصدیق کریں' : 'Confirm Password'}
              </label>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-amber-500">
                <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-white text-xs sm:text-sm outline-none font-mono-numbers"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <span>{mode === 'register' ? (lang === 'ur' ? 'رجسٹر کریں' : 'Create HADIYA Account') : (lang === 'ur' ? 'لاگ ان کریں' : 'Sign In Now')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ One-Click Login as <b className="text-white">HADIYA VIP Trader</b></span>
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure SHA-256 Client-Side Protected Vault</span>
          </div>
        </div>
      </div>
    </div>
  );
};
