import { useState, useCallback } from 'react';
import { AccentColor, getColorClasses, isValidAccentColor } from '../shared/config/theme.config';

interface UseThemeOptions {
  defaultColor?: AccentColor;
  persistToStorage?: boolean;
  storageKey?: string;
}

export function useTheme(options: UseThemeOptions = {}) {
  const {
    defaultColor = 'orange',
    persistToStorage = true,
    storageKey = 'app-accent-color'
  } = options;

  // localStorage에서 저장된 색상 가져오기
  const getStoredColor = (): AccentColor => {
    if (!persistToStorage) return defaultColor;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && isValidAccentColor(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to load accent color from storage:', error);
    }
    return defaultColor;
  };

  const [accentColor, setAccentColorState] = useState<AccentColor>(getStoredColor);

  // 액센트 컬러 변경 함수
  const setAccentColor = useCallback((color: AccentColor) => {
    setAccentColorState(color);
    
    if (persistToStorage) {
      try {
        localStorage.setItem(storageKey, color);
      } catch (error) {
        console.warn('Failed to save accent color to storage:', error);
      }
    }
  }, [persistToStorage, storageKey]);

  // 현재 색상의 CSS 클래스들
  const colors = getColorClasses(accentColor);

  // 다음 색상으로 순환
  const cycleColor = useCallback(() => {
    const availableColors: AccentColor[] = ['orange', 'blue', 'green', 'purple'];
    const currentIndex = availableColors.indexOf(accentColor);
    const nextIndex = (currentIndex + 1) % availableColors.length;
    setAccentColor(availableColors[nextIndex]);
  }, [accentColor, setAccentColor]);

  return {
    accentColor,
    setAccentColor,
    colors,
    cycleColor
  };
}