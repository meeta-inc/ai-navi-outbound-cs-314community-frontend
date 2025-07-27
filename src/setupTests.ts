import '@testing-library/jest-dom';

// Mock scrollIntoView and scrollTo for JSDOM
Element.prototype.scrollIntoView = jest.fn();
Element.prototype.scrollTo = jest.fn();

// Mock import.meta.env for Jest tests
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'https://test-api.example.com',
        VITE_CHAT_API_URL: 'https://test-chat-api.example.com',
        VITE_COGNITO_USER_POOL_ID: 'test-pool-id',
        VITE_COGNITO_USER_POOL_CLIENT_ID: 'test-client-id',
        VITE_COGNITO_IDENTITY_POOL_ID: 'test-identity-pool',
        VITE_KMS_KEY_ID: 'test-kms-key',
        VITE_APP_ID: 'test-app-id',
        VITE_CLIENT_ID: 'test-client-id',
        VITE_FAQ_CATEGORIES_CONFIG: '{"category1":{"id":"category1","iconKey":"category1","textKey":"chat.faq.category1.title","enabled":true},"category2":{"id":"category2","iconKey":"category2","textKey":"chat.faq.category2.title","enabled":true},"category3":{"id":"category3","iconKey":"category3","textKey":"chat.faq.category3.title","enabled":true},"category4":{"id":"category4","iconKey":"category4","textKey":"chat.faq.category4.title","enabled":true}}',
        VITE_FAQ_ICONS: '{"category1":{"type":"lucide","value":"BookOpen"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}',
        VITE_ACCENT_COLOR: 'green',
        VITE_SHOW_NAVIGATION_HEADER: 'true',
        VITE_SHOW_GRADE_SELECTION: 'true',
      },
    },
  },
});

// Mock modules that use import.meta.env
jest.mock('./shared/config/app.config', () => ({
  getApiUrl: () => 'https://test-api.example.com',
  getChatApiUrl: () => 'https://test-chat-api.example.com',
  getAccentColor: () => 'green',
  getShowNavigationHeader: () => true,
  getShowGradeSelection: () => true,
  getShowTimestamp: () => true,
}));

jest.mock('./shared/config/theme.config', () => ({
  getColorClasses: () => ({
    primary: 'text-green-600',
    secondary: 'text-green-500',
  }),
}));