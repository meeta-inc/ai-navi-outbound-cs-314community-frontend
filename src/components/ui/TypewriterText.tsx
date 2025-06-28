import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypewriterText({ text, speed = 50, onComplete }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => {
          const newText = prev + text[currentIndex];
          
          // 새 글자가 추가될 때마다 스크롤
          const messageContainer = document.querySelector('.overflow-y-auto');
          if (messageContainer) {
            const scrollHeight = messageContainer.scrollHeight;
            const height = messageContainer.clientHeight;
            const maxScrollTop = scrollHeight - height;
            
            messageContainer.scrollTo({
              top: maxScrollTop,
              behavior: 'smooth'
            });
          }
          
          return newText;
        });
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // 텍스트가 변경될 때 상태 초기화
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayText}</span>;
}