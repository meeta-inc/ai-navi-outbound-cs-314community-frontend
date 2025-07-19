/**
 * 개발 환경 전용 네비게이션 컴포넌트
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const DevNavigation: React.FC = () => {
  const location = useLocation();
  
  // 개발 환경이 아니거나 메인 페이지이면 렌더링하지 않음
  if (import.meta.env.PROD || location.pathname === '/') {
    return null;
  }

  const devRoutes = [
    { path: '/', label: '메인' },
    { path: '/dev/jwe-test', label: 'JWE 테스트' },
    { path: '/dev/cognito-test', label: 'Cognito 테스트' }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-sm py-2 px-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-1">
          <span className="font-bold">🛠️ DEV</span>
          <span className="hidden sm:inline">모드</span>
        </div>
        <nav className="flex items-center gap-4">
          {devRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                location.pathname === route.path
                  ? 'bg-white text-red-600 font-medium'
                  : 'hover:bg-red-500'
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};