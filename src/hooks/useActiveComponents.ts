import { useState, useCallback } from 'react';

// 활성 컴포넌트 상태 인터페이스
export interface ActiveComponentState {
  faqCategories: string | null;  // FAQ 카테고리를 표시할 메시지 ID
  topQuestions: string | null;   // Top 질문을 표시할 메시지 ID
  gradeSelection: string | null; // 학년 선택을 표시할 메시지 ID
  quickReply: string | null;     // 퀵 리플라이를 표시할 메시지 ID
  cta: string | null;           // CTA 버튼을 표시할 메시지 ID
}

/**
 * 메시지 ID 기반 컴포넌트 활성화 상태 관리 훅
 * ADR-006에 따른 메시지 ID 기반 컴포넌트 제어 구현
 */
export const useActiveComponents = () => {
  const [activeComponents, setActiveComponents] = useState<ActiveComponentState>({
    faqCategories: null,
    topQuestions: null,
    gradeSelection: null,
    quickReply: null,
    cta: null
  });

  /**
   * 특정 컴포넌트를 특정 메시지 ID에서 활성화
   */
  const activateComponent = useCallback((
    componentType: keyof ActiveComponentState,
    messageId: string
  ) => {
    setActiveComponents(prev => ({
      ...prev,
      [componentType]: messageId
    }));
  }, []);

  /**
   * 특정 컴포넌트 비활성화
   */
  const deactivateComponent = useCallback((
    componentType: keyof ActiveComponentState
  ) => {
    setActiveComponents(prev => ({
      ...prev,
      [componentType]: null
    }));
  }, []);

  /**
   * 특정 메시지 ID에서 컴포넌트가 활성화되어 있는지 확인
   */
  const isComponentActive = useCallback((
    componentType: keyof ActiveComponentState,
    messageId: string
  ) => {
    return activeComponents[componentType] === messageId;
  }, [activeComponents]);

  /**
   * 모든 컴포넌트 비활성화 (특정 상황에서 사용)
   */
  const deactivateAllComponents = useCallback(() => {
    setActiveComponents({
      faqCategories: null,
      topQuestions: null,
      gradeSelection: null,
      quickReply: null,
      cta: null
    });
  }, []);

  /**
   * 특정 컴포넌트 타입의 현재 활성 메시지 ID 반환
   */
  const getActiveMessageId = useCallback((
    componentType: keyof ActiveComponentState
  ) => {
    return activeComponents[componentType];
  }, [activeComponents]);

  return {
    activeComponents,
    activateComponent,
    deactivateComponent,
    isComponentActive,
    deactivateAllComponents,
    getActiveMessageId
  };
};