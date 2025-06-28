import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocaleProvider } from './contexts/LocaleContext';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </LocaleProvider>
    </BrowserRouter>
  );
}

export default App;