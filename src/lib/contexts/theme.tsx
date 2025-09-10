'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('trendit-theme') as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    // Apply theme to document
    const root = window.document.documentElement;
    const body = window.document.body;
    
    console.log('🎨 Applying theme classes:', theme);
    console.log('🎨 Root classes before:', Array.from(root.classList));
    
    // Remove both theme classes first
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    body.classList.add(theme);
    
    console.log('🎨 Root classes after:', Array.from(root.classList));
    
    // Force update CSS custom properties
    if (theme === 'dark') {
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('trendit-theme', theme);
    } catch (e) {
      // Ignore localStorage errors
      console.warn('Failed to save theme preference:', e);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('🎨 Theme toggle:', theme, '→', newTheme);
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  // Show content immediately but apply theme when mounted
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}