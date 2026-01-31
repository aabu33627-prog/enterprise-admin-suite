import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themes: { id: ThemeType; name: string; color: string }[];
}

const themes: { id: ThemeType; name: string; color: string }[] = [
  { id: 'red', name: 'Red', color: '#dc2626' },
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'green', name: 'Green', color: '#22c55e' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'orange', name: 'Orange', color: '#f97316' },
  { id: 'dark', name: 'Dark', color: '#1f2937' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('dashboard-theme');
    return (saved as ThemeType) || 'red';
  });

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
