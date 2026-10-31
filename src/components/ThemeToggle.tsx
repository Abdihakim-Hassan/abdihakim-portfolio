import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 rounded-xl border border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.03] dark:bg-white/[0.03] hover:bg-zinc-900/[0.08] dark:hover:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 flex items-center justify-center transition-all cursor-pointer"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-zinc-200 transition-transform duration-200" />
      ) : (
        <Sun className="w-4 h-4 text-zinc-800 transition-transform duration-200" />
      )}
    </button>
  );
}
