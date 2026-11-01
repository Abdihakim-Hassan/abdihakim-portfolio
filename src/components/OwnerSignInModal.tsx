import React, { useState } from 'react';
import {
  Lock,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Language } from '../types';

interface OwnerSignInModalProps {
  lang: Language;
}

export const OwnerSignInModal: React.FC<OwnerSignInModalProps> = ({ lang }) => {
  const { isSignInModalOpen, setIsSignInModalOpen, login, loginWithGoogle, owner } = usePortfolioData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isSignInModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || (lang === 'so' ? 'Galitaanka waa lagu guuldarreystay.' : 'Authentication failed.'));
      } else {
        // Successful login, clear credentials from component memory
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err?.message || (lang === 'so' ? 'Qalad aan la filayn ayaa dhacay.' : 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError(result.error || (lang === 'so' ? 'Galitaanka waa lagu guuldarreystay.' : 'Authentication failed.'));
      }
    } catch (err: any) {
      setError(err?.message || (lang === 'so' ? 'Qalad aan la filayn ayaa dhacay.' : 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsSignInModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-[#13151b] border border-zinc-900/15 dark:border-white/15 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsSignInModalOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border border-zinc-900/10 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 sm:p-9 space-y-6 sm:space-y-7">
          {/* Header */}
          <div className="flex items-center gap-3.5 pr-8">
            <span className="w-11 h-11 rounded-xl sm:rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif italic font-bold text-lg shadow-sm shrink-0">
              {owner.monogram}
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {lang === 'so' ? 'Galitaanka Maamulka' : 'Sign In'}
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
                {lang === 'so'
                  ? 'Geli emailkaaga iyo furahaaga si aad u maamusho portfolio-ga.'
                  : 'Enter your verified email and password to access your dashboard.'}
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {lang === 'so' ? 'Email-ka Maamulaha' : 'Administrator Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'so' ? 'tusaale@domain.com' : 'admin@domain.com'}
                  className="h-12 w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.03] border border-zinc-900/15 dark:border-white/15 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {lang === 'so' ? 'Furaha Sirta ah' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lang === 'so' ? 'Geli furahaaga sirta ah' : 'Enter your password'}
                  className="h-12 w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/[0.02] dark:bg-white/[0.03] border border-zinc-900/15 dark:border-white/15 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full mt-2 py-3 px-5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              {isLoading ? (
                <span>{lang === 'so' ? 'Waa la hubinayaa...' : 'Verifying credentials...'}</span>
              ) : (
                <>
                  <span>{lang === 'so' ? 'Gal Dashboard-ka' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign-In (identity only; admin rights come from the server-assigned custom claim) */}
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-zinc-400">
            <span className="h-px flex-1 bg-zinc-900/10 dark:bg-white/10" />
            <span>{lang === 'so' ? 'ama' : 'or'}</span>
            <span className="h-px flex-1 bg-zinc-900/10 dark:bg-white/10" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="h-12 w-full py-3 px-5 rounded-xl border border-zinc-900/15 dark:border-white/15 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900/5 dark:hover:bg-white/5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z" />
              <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
            </svg>
            <span>{lang === 'so' ? 'Ku gal Google' : 'Sign in with Google'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
