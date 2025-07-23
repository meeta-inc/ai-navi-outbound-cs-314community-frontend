import '@testing-library/jest-dom';

// Mock import.meta.env for Jest tests
Object.defineProperty(window, 'import', {
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
      },
    },
  },
});

// Mock modules that use import.meta.env
jest.mock('./shared/config/app.config', () => ({
  getApiUrl: () => 'https://test-api.example.com',
  getChatApiUrl: () => 'https://test-chat-api.example.com',
}));