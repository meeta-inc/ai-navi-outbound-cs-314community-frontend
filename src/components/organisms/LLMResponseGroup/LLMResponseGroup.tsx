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
  streamingBubbles?: any[]; // 스트리밍 모드에서 실시간으로 받은 버블들
  isStreaming?: boolean; // 스트리밍 모드 여부
  setIsTyping?: (isTyping: boolean) => void; // 스트리밍 모드에서 타이핑 상태 제어
}

export function LLMResponseGroup({ 
  response, 
  accentColor = 'orange',
  enableTyping = true,
  onComplete,
  onMainCTAClick,
  onSubCTAClick,
  showCTAAfterComplete = false,
  onCTADisplayed,
  streamingBubbles = [],
  isStreaming = false,
  setIsTyping
}: LLMResponseGroupProps) {
  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(0);
  const [completedBubbles, setCompletedBubbles] = useState<number[]>([]);
  const [allBubblesCompleted, setAllBubblesCompleted] = useState(false);
  
  // 스트리밍 모드일 때는 streamingBubbles 사용, 아니면 response.response 사용
  const bubblesData = isStreaming ? streamingBubbles : response.response;
  
  // 각 버블의 타이핑 완료 처리
  const handleBubbleComplete = (index: number) => {
    setCompletedBubbles(prev => [...prev, index]);
    
    // 스트리밍 모드에서는 버블이 대기 중인 경우에만 다음으로 진행
    if (isStreaming) {
      // 현재 버블이 완료되고, 대기 중인 다음 버블이 있으면 진행
      if (index < bubblesData.length - 1) {
        // 다음 버블의 타이핑 시작
        setTimeout(() => {
          setCurrentBubbleIndex(index + 1);
        }, 100); // 약간의 지연으로 자연스러운 전환
      } else {
        // 모든 버블 완료
        setAllBubblesCompleted(true);
        
        // 스트리밍 모드에서 타이핑 완료 처리
        if (isStreaming) {
          // 최종 메시지 생성을 위해 onComplete 호출
          if (onComplete) {
            onComplete();
          }
          
          // setIsTyping을 false로 설정
          if (setIsTyping) {
            setIsTyping(false);
          }
        } else if (onComplete) {
          onComplete();
        }
        
        if (showCTAAfterComplete) {
          setTimeout(() => {
            if (onCTADisplayed) {
              onCTADisplayed();
            }
          }, 100);
        }
      }
    } else {
      // 기존 모드: 다음 버블로 이동
      if (index < bubblesData.length - 1) {
        setTimeout(() => {
          setCurrentBubbleIndex(index + 1);
        }, 100);
      } else {
        // 모든 버블 완료
        setAllBubblesCompleted(true);
        if (showCTAAfterComplete) {
          setTimeout(() => {
            if (onCTADisplayed) {
              onCTADisplayed();
            }
          }, 100);
        }
        if (onComplete) {
          onComplete();
        }
      }
    }
  };
  
  // 타이핑 비활성화시 모든 버블 즉시 표시
  useEffect(() => {
    if (!enableTyping) {
      setCurrentBubbleIndex(bubblesData.length - 1);
      setCompletedBubbles(bubblesData.map((_, i) => i));
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
  }, [enableTyping, bubblesData.length, showCTAAfterComplete]);

  // 스트리밍 모드에서 새 버블이 추가될 때 대기열에 추가만 하고, 타이핑 완료 시에만 다음으로 진행

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
  // status가 undefined인 경우는 정상으로 처리 (기본값 200)
  const status = response.status ?? 200;
  const isError = (status !== 200) || (!isStreaming && (!response.response || response.response.length === 0));
  
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
      {bubblesData.map((bubble, index) => {
        // 현재 인덱스까지의 버블만 표시
        if (index > currentBubbleIndex && enableTyping) {
          return null;
        }
        
        // 타이핑 조건 간소화: 현재 버블이고 아직 완료되지 않았으면 타이핑
        const isCurrentBubble = index === currentBubbleIndex;
        const isCompleted = completedBubbles.includes(index);
        const shouldType = enableTyping && isCurrentBubble && !isCompleted;
        
        return (
          <ChatBubble
            key={`${isStreaming ? 'streaming' : 'static'}-${index}`}
            content={bubble.text}
            isBot={true}
            accentColor={accentColor}
            bubbleType={bubble.type}
            attachment={bubble.attachment}
            isTyping={shouldType}
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