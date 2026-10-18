import { useState, useEffect } from 'react';

/**
 * useTheme hook — Manages Light / Dark mode state.
 * Defaults to 'light' mode as preferred for exhibitions,
 * but allows instant toggle and persists choice in localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('flappyAI_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // Default light mode
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('flappyAI_theme', theme);
    } catch {
      // Safe
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
