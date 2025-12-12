import React from 'react';

/**
 * **텍스트** 패턴을 볼드로 변환하는 함수
 * - **가 열리면 바로 볼드 시작 (닫는 **가 없어도 끝까지 볼드 처리)
 */
export function parseBoldText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let boldStartIndex = -1;
  let keyCounter = 0;

  for (let i = 0; i < text.length; i++) {
    // **를 찾음 (2글자 연속)
    if (i < text.length - 1 && text[i] === '*' && text[i + 1] === '*') {
      if (boldStartIndex === -1) {
        // 열린 ** 발견: 이전 일반 텍스트 추가
        if (i > currentIndex) {
          parts.push(text.substring(currentIndex, i));
        }
        boldStartIndex = i + 2; // ** 다음부터 볼드 시작
        i++; // ** 두 글자를 건너뜀
        currentIndex = i + 1;
      } else {
        // 닫는 ** 발견: 볼드 텍스트 추가
        const boldText = text.substring(boldStartIndex, i);
        parts.push(
          <strong key={`bold-${keyCounter++}`} className="font-bold">
            {boldText}
          </strong>
        );
        boldStartIndex = -1;
        i++; // ** 두 글자를 건너뜀
        currentIndex = i + 1;
      }
    }
  }

  // 닫히지 않은 볼드가 있으면 끝까지 볼드로 처리
  if (boldStartIndex !== -1) {
    const boldText = text.substring(boldStartIndex);
    parts.push(
      <strong key={`bold-${keyCounter++}`} className="font-bold">
        {boldText}
      </strong>
    );
  } else if (currentIndex < text.length) {
    // 남은 일반 텍스트 추가
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * URL을 감지하고 링크로 변환하는 함수 (React 노드 배열 처리)
 */
export function convertUrlsToLinks(nodes: React.ReactNode[]): React.ReactNode[] {
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  const result: React.ReactNode[] = [];

  nodes.forEach((node, nodeIndex) => {
    // 문자열 노드만 URL 변환 처리
    if (typeof node === 'string') {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = urlPattern.exec(node)) !== null) {
        if (match.index > lastIndex) {
          parts.push(node.substring(lastIndex, match.index));
        }

        const url = match[0];
        const href = url.startsWith('http') ? url : `https://${url}`;

        parts.push(
          <a
            key={`url-${nodeIndex}-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
            onClick={(e) => e.stopPropagation()}
          >
            {url}
          </a>
        );

        lastIndex = match.index + url.length;
      }

      if (lastIndex < node.length) {
        parts.push(node.substring(lastIndex));
      }

      result.push(...(parts.length > 0 ? parts : [node]));
    } else {
      // 문자열이 아닌 노드(예: <strong> 태그)는 그대로 유지
      result.push(node);
    }
  });

  return result;
}

/**
 * 텍스트 파싱: 볼드 → URL 순서로 처리
 */
export function parseTextContent(text: string): React.ReactNode[] {
  const boldParsed = parseBoldText(text);
  return convertUrlsToLinks(boldParsed);
}
