import React from 'react';

export interface IconConfig {
  type: 'lucide' | 'url' | 'svg' | 'component';
  value: string | React.ComponentType<any>;
  fallback?: React.ComponentType<any>;
}

// IconConfig는 이제 FAQ 카테고리 설정에서 직접 사용됩니다.
// 이 파일은 아이콘 타입 정의만 담당합니다.