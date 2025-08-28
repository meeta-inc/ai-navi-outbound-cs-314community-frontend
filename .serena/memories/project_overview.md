# CS 교육 지원 챗봇 프론트엔드 프로젝트 개요

## 프로젝트 목적
연성회 외부생을 위한 CS(Customer Support) 챗봇 웹 애플리케이션으로, 학습 관련 질문과 기술적 문의를 지원합니다.

## 주요 기능
- **다국어 지원**: 일본어(기본), 한국어, 영어
- **AI 챗봇 상담**: 학습 관련 질문과 기술적 문의 지원
- **타이핑 애니메이션**: 자연스러운 대화 UI
- **반응형 디자인**: 모바일/데스크톱 지원
- **보안 통신**: JWE 암호화를 통한 안전한 API 통신
- **AWS 통합**: Cognito Identity Pool, KMS 활용한 보안 강화
- **학년별 맞춤 대응**: 학년 선택 기능을 통한 맞춤형 응답

## 기술 스택
- **Frontend Framework**: React 18 + TypeScript 5.5
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Cookie Management**: js-cookie
- **AWS SDK**: Cognito Identity, KMS, STS
- **Security**: JWE (JSON Web Encryption) with jose library
- **Testing**: Jest + React Testing Library
- **Component Development**: Storybook
- **Code Quality**: ESLint + TypeScript ESLint

## 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 개발 환경
- Node.js 18 이상 필수
- macOS (Darwin) 개발 환경
- Git으로 버전 관리
- GitHub Actions CI/CD 파이프라인