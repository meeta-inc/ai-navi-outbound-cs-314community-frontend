import { useState, useEffect } from 'react';
import { ChatBubble } from '../../molecules/ChatBubble';
import { CTAButtons } from '../../molecules/CTAButtons';
import { LLMResponse } from '../../../types';
import { AccentColor } from '../../../shared/config/theme.config';

interface LLMResponseGroupProps {
  response: LLMResponse;
  accentColor?: AccentColor;
  enableTyping?: boolean;
  onComplete?: () => void;
  onMainCTAClick?: () => void;
  onSubCTAClick?: () => void;
  showCTAAfterComplete?: boolean; // 모든 버블 완료 후 CTA 표시 여부
}

export function LLMResponseGroup({ 
  response, 
  accentColor = 'orange',
  enableTyping = true,
  onComplete,
  onMainCTAClick,
  onSubCTAClick,
  showCTAAfterComplete = false
}: LLMResponseGroupProps) {
  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(0);
  const [completedBubbles, setCompletedBubbles] = useState<number[]>([]);
  const [showCTA, setShowCTA] = useState(false);
  
  // 각 버블의 타이핑 완료 처리
  const handleBubbleComplete = (index: number) => {
    setCompletedBubbles(prev => [...prev, index]);
    
    // 다음 버블로 이동
    if (index < response.response.length - 1) {
      setCurrentBubbleIndex(index + 1);
    } else {
      // 모든 버블 완료
      if (showCTAAfterComplete) {
        setShowCTA(true);
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
      // 타이핑 비활성화이고 CTA 표시 옵션이 true인 경우 즉시 CTA 표시
      if (showCTAAfterComplete) {
        setShowCTA(true);
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
      {showCTA && (
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