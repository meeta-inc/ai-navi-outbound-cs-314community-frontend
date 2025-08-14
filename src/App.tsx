import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocaleProvider } from './contexts/LocaleContext';
import { ClientConfigProvider } from './contexts/ClientConfigContext';
import MainPage from './pages/MainPage';
import { CognitoTestPage, JWETestPage } from './dev';

function App() {
  return (
    <BrowserRouter>
      <ClientConfigProvider>
        <LocaleProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 개발/테스트용 라우트 */}
            {!import.meta.env.PROD && (
              <>
                <Route path="/dev/jwe-test" element={<JWETestPage />} />
                <Route path="/dev/cognito-test" element={<CognitoTestPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LocaleProvider>
      </ClientConfigProvider>
    </BrowserRouter>
  );
}

export default App;