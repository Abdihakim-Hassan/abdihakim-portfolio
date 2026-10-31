import React, { useState } from 'react';
import {
  Lock,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  ArrowRight,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Language } from '../types';

interface OwnerSignInModalProps {
  lang: Language;
}

export const OwnerSignInModal: React.FC<OwnerSignInModalProps> = ({ lang }) => {
  const { isSignInModalOpen, setIsSignInModalOpen, login, owner } = usePortfolioData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isSignInModalOpen) return null;

  const handleExecuteLogin = (u: string, p: string) => {
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(u, p);
      if (!success) {
        setIsLoading(false);
        setError(
          lang === 'so'
            ? 'Xogta galitaanka ma saxna. Fadlan hubi magaca iyo furaha sirta ah.'
            : 'Invalid credentials. Please check your username and password.'
        );
      }
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteLogin(username, password);
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
                  ? 'Geli xogtaada si aad u maamusho portfolio-ga.'
                  : 'Enter your credentials to access your dashboard.'}
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
                {lang === 'so' ? 'Magaca Isticmaalaha' : 'Username'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={lang === 'so' ? 'Geli magacaaga' : 'Enter username'}
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
                  placeholder={lang === 'so' ? 'Geli furahaaga sirta ah' : 'Enter password'}
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
                <span>{lang === 'so' ? 'Waa la hubinayaa...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{lang === 'so' ? 'Gal Dashboard-ka' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
