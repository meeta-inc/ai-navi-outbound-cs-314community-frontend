import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'ko' | 'ja' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// JSON 파일들을 동적으로 import
const loadTranslations = async () => {
  try {
    const [ko, ja, en] = await Promise.all([
      import('../locales/ko/common.json'),
      import('../locales/ja/common.json'),
      import('../locales/en/common.json')
    ]);
    
    return {
      ko: ko.default || ko,
      ja: ja.default || ja,
      en: en.default || en
    };
  } catch (error) {
    console.error('Failed to load translation files:', error);
    return {
      ko: {},
      ja: {},
      en: {}
    };
  }
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ja');
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<Locale, Record<string, any>>>({
    ko: {},
    ja: {},
    en: {}
  });

  useEffect(() => {
    // 번역 파일 로드
    const loadData = async () => {
      const loadedTranslations = await loadTranslations();
      setTranslations(loadedTranslations);
      
      // 저장된 locale 불러오기 (기본값: 일본어)
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && (savedLocale === 'ko' || savedLocale === 'ja' || savedLocale === 'en')) {
        setLocale(savedLocale);
      } else {
        // 기본값을 일본어로 설정
        setLocale('ja');
        localStorage.setItem('locale', 'ja');
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    // 중첩된 키 탐색
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 키를 찾을 수 없으면 영어로 대체 시도
        if (locale !== 'en') {
          value = translations.en;
          for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
              value = value[k];
            } else {
              return key; // 영어에도 없으면 키 자체 반환
            }
          }
        } else {
          return key; // 키를 찾을 수 없으면 키 자체 반환
        }
      }
    }

    // 문자열이 아닌 경우 키 반환
    if (typeof value !== 'string') {
      return key;
    }

    // 파라미터 치환 ({{param}} 형식)
    if (params) {
      return Object.entries(params).reduce((text, [param, replacement]) => {
        return text.replace(new RegExp(`{{${param}}}`, 'g'), replacement);
      }, value);
    }

    return value;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};