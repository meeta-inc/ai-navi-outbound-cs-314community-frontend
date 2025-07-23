// Mock import.meta for Jest testing environment
global.importMeta = {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3001',
    VITE_CHAT_API_URL: 'http://localhost:3001',
    VITE_CLIENT_ID: 'RS000001',
    VITE_APP_ID: 'test-app',
    VITE_ACCENT_COLOR: 'green',
    VITE_SHOW_NAVIGATION_HEADER: 'true',
    VITE_SHOW_TIMESTAMP: 'true',
    VITE_SHOW_GRADE_SELECTION: 'true',
    VITE_COGNITO_IDENTITY_POOL_ID: 'ap-northeast-1:test-identity-pool',
    VITE_KMS_KEY_ID: 'alias/test-key',
    VITE_KMS_KEY_ARN: 'arn:aws:kms:ap-northeast-1:123456789012:key/test-key',
    VITE_AWS_REGION: 'ap-northeast-1',
    VITE_NODE_ENV: 'test',
    VITE_FRONTEND_ROLE_ARN: 'arn:aws:iam::123456789012:role/test-role',
    VITE_FAQ_ICONS: '{"category1":{"type":"lucide","value":"BookOpen"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}',
  }
};

// Polyfill for import.meta in Jest
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: global.importMeta
  },
  writable: true
});