import { parseTextContent } from '../../../utils/textFormatUtils';

interface FormattedTextProps {
  content: string;
  className?: string;
}

/**
 * 텍스트 파싱 컴포넌트
 * - **텍스트** 패턴을 볼드로 변환
 * - URL을 링크로 변환
 */
export function FormattedText({ content, className }: FormattedTextProps) {
  return (
    <div className={`whitespace-pre-wrap ${className || ''}`}>
      {parseTextContent(content)}
    </div>
  );
}
