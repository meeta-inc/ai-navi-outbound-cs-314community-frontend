import { useState, useEffect } from 'react';
import { ChatBubble } from '../../molecules/ChatBubble';
import { CTAButtons } from '../../molecules/CTAButtons';
import { LLMResponse } from '../../../types';
import { AccentColor } from '../../../shared/config/theme.config';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

interface LLMResponseGroupProps {
  response: LLMResponse;
  accentColor?: AccentColor;
  enableTyping?: boolean;
  onComplete?: () => void;
  onMainCTAClick?: () => void;
  onSubCTAClick?: () => void;
  showCTAAfterComplete?: boolean; // 모든 버블 완료 후 CTA 표시 여부
  onCTADisplayed?: () => void; // CTA 표시 완료 후 스크롤 콜백
}

export function LLMResponseGroup({ 
  response, 
  accentColor = 'orange',
  enableTyping = true,
  onComplete,
  onMainCTAClick,
  onSubCTAClick,
  showCTAAfterComplete = false,
  onCTADisplayed
}: LLMResponseGroupProps) {
  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(0);
  const [completedBubbles, setCompletedBubbles] = useState<number[]>([]);
  const [allBubblesCompleted, setAllBubblesCompleted] = useState(false);
  
  // 각 버블의 타이핑 완료 처리
  const handleBubbleComplete = (index: number) => {
    setCompletedBubbles(prev => [...prev, index]);
    
    // 다음 버블로 이동
    if (index < response.response.length - 1) {
      setCurrentBubbleIndex(index + 1);
    } else {
      // 모든 버블 완료
      setAllBubblesCompleted(true);
      // CTA가 표시될 예정이면 스크롤 콜백 호출
      if (showCTAAfterComplete) {
        setTimeout(() => {
          if (onCTADisplayed) {
            onCTADisplayed();
          }
        }, 100); // CTA 렌더링 후 스크롤
      }
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // 타이핑 비활성화시 모든 버블 즉시 표시
  useEffect(() => {
    if (!enableTyping) {
      setCurrentBubbleIndex(response.response.length - 1);
      setCompletedBubbles(response.response.map((_, i) => i));
      // 타이핑 비활성화인 경우 즉시 완료 상태로 설정
      setAllBubblesCompleted(true);
      // CTA가 표시될 예정이면 스크롤 콜백 호출
      if (showCTAAfterComplete) {
        setTimeout(() => {
          if (onCTADisplayed) {
            onCTADisplayed();
          }
        }, 100); // CTA 렌더링 후 스크롤
      }
    }
  }, [enableTyping, response.response.length, showCTAAfterComplete]);

  const handleMainCTA = () => {
    if (onMainCTAClick) {
      onMainCTAClick();
    }
  };

  const handleSubCTA = () => {
    if (onSubCTAClick) {
      onSubCTAClick();
    }
  };

  // 에러 조건 체크: HTTP 상태코드가 200이 아니거나 응답이 빈 배열인 경우
  const isError = (response.status !== undefined && response.status !== 200) || !response.response || response.response.length === 0;
  
  // 에러 상황일 때 에러 메시지 표시
  if (isError) {
    return (
      <div className="flex flex-col gap-1">
        <ChatBubble
          content={ERROR_MESSAGES.LLM_TEMPORARY_ERROR}
          isBot={true}
          accentColor={accentColor}
          bubbleType="main"
          isTyping={enableTyping}
          onTypingComplete={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {response.response.map((bubble, index) => {
        // 현재 인덱스까지의 버블만 표시
        if (index > currentBubbleIndex && enableTyping) {
          return null;
        }
        
        // 현재 버블이거나 이미 완료된 버블인지 확인
        const isCurrentBubble = index === currentBubbleIndex;
        const isCompleted = completedBubbles.includes(index);
        
        return (
          <ChatBubble
            key={index}
            content={bubble.text}
            isBot={true}
            accentColor={accentColor}
            bubbleType={bubble.type}
            attachment={bubble.attachment}
            isTyping={enableTyping && isCurrentBubble && !isCompleted}
            onTypingComplete={() => handleBubbleComplete(index)}
          />
        );
      })}
      
      {/* CTA Buttons */}
      {showCTAAfterComplete && allBubblesCompleted && (
        <CTAButtons
          show={true}
          onMainClick={handleMainCTA}
          onSubClick={handleSubCTA}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}