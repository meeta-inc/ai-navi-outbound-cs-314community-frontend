import { createContext, useContext, ReactNode } from 'react';
import { AccentColor } from '../utils/theme';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  colors: {
    border: string;
    text: string;
    textHover: string;
    bgHover: string;
    accent: string;
    accentSecondary: string;
    gradient: {
      from: string;
      to: string;
    };
  };
  cycleColor: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultColor?: AccentColor;
}

export function ThemeProvider({ children, defaultColor = 'orange' }: ThemeProviderProps) {
  const theme = useTheme({ defaultColor });

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}