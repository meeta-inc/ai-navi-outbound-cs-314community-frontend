/**
 * JWE 테스트 전용 페이지
 * 단계별로 테스트하면서 JWE 구현을 진행합니다.
 */

import React from 'react';
import { CognitoTestPage } from './CognitoTestPage';

export const JWETestPage: React.FC = () => {

  return (
    <div className="w-full bg-gray-50 py-8 pb-96">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            JWE 구현 테스트
          </h1>
        </div>
        
        <CognitoTestPage />
        
        {/* 스크롤을 위한 여백 */}
        <div className="h-96"></div>
      </div>
    </div>
  );
};

