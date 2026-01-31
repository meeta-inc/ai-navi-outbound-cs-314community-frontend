import { AccentColor } from './theme.config';

export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn('API URL is not defined');
    return '/api';
  }

  return apiUrl;
};

export const getChatApiUrl = () => {
  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL;

  if (!chatApiUrl) {
    console.warn('Chat API URL is not defined, falling back to main API');
    return getApiUrl();
  }

  return chatApiUrl;
};

export const getFileUploadApiUrl = () => {
  const fileUploadApiUrl = import.meta.env.VITE_STUDENT_FRONT_API_URL;

  if (!fileUploadApiUrl) {
    console.warn('File Upload API URL is not defined, falling back to main API');
    return getApiUrl();
  }

  return fileUploadApiUrl;
};

export const getStudentFrontApiUrl = () => {
  const studentFrontApiUrl = import.meta.env.VITE_STUDENT_FRONT_API_URL;

  if (!studentFrontApiUrl) {
    console.warn('Student Front API URL is not defined, falling back to main API');
    return getApiUrl();
  }

  return studentFrontApiUrl;
};

export const getAccentColor = (): AccentColor => {
  const accentColor = import.meta.env.VITE_ACCENT_COLOR;
  
  if (!accentColor || !['orange', 'blue', 'green', 'red', 'purple'].includes(accentColor)) {
    console.warn('Invalid or undefined accent color, falling back to orange');
    return 'orange';
  }
  
  return accentColor as AccentColor;
};

export const getShowNavigationHeader = () => {
  const showHeader = import.meta.env.VITE_SHOW_NAVIGATION_HEADER;
  
  // 문자열 'true'를 boolean으로 변환, 기본값은 true
  if (showHeader === 'false') {
    return false;
  }
  
  return true;
};

export const getShowTimestamp = () => {
  const showTimestamp = import.meta.env.VITE_SHOW_TIMESTAMP;
  
  // 문자열 'false'를 boolean으로 변환, 기본값은 true
  if (showTimestamp === 'false') {
    return false;
  }
  
  return true;
};

export const getShowGradeSelection = () => {
  const showGradeSelection = import.meta.env.VITE_SHOW_GRADE_SELECTION;
  
  // 문자열 'false'를 boolean으로 변환, 기본값은 true
  if (showGradeSelection === 'false') {
    return false;
  }
  
  return true;
};

export interface CTAButtonConfig {
  title: string;
  action: {
    type: 'link' | 'FAQ' | 'pdfDownload';
    detail: string;
  };
}

export interface CTAButtonsConfig {
  main: CTAButtonConfig;
  sub: CTAButtonConfig;
}

export const getCTAButtonsConfig = (clientId?: string): CTAButtonsConfig => {
  // MM000002 (名門会) 전용 설정
  if (clientId === 'MM000002') {
    return {
      main: {
        title: "資料請求する",
        action: {
          type: "link",
          detail: "https://meimonkai.co.jp/request/"  // 名門会 자료청구 링크
        }
      },
      sub: {
        title: "もう少し質問する",
        action: {
          type: "FAQ",
          detail: ""
        }
      }
    };
  }
  
  const ctaButtonsConfig = import.meta.env.VITE_CTA_BUTTONS;
  
  try {
    if (ctaButtonsConfig) {
      return JSON.parse(ctaButtonsConfig);
    }
  } catch (error) {
    console.warn('Failed to parse VITE_CTA_BUTTONS, using default configuration');
  }
  
  // 기본값
  return {
    main: {
      title: "資料請求する",
      action: {
        type: "link",
        detail: "https://www.314community.com/inquiry/"
      }
    },
    sub: {
      title: "もう少し質問する",
      action: {
        type: "FAQ",
        detail: ""
      }
    }
  };
};

export const getAppConfig = () => {
  return {
    apiUrl: getApiUrl(),
    chatApiUrl: getChatApiUrl(),
    accentColor: getAccentColor(),
    showNavigationHeader: getShowNavigationHeader(),
    showTimestamp: getShowTimestamp(),
    showGradeSelection: getShowGradeSelection(),
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
};