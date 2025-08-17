import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useClientConfig } from '../contexts/ClientConfigContext';
import { ChatLayout } from '../components/templates/ChatLayout';
import { NavigationHeader } from '../components/organisms/NavigationHeader';
import { ChatMessage } from '../components/organisms/ChatMessage';
import { ChatInput } from '../components/organisms/ChatInput';
import { QuickReply } from '../components/organisms/QuickReply';
import { FAQCategory } from '../components/organisms/FAQCategory';
import { TopQuestions } from '../components/organisms/TopQuestions';
import { MenuModal } from '../components/organisms/MenuModal';
import { MenuService } from '../services/menuService';
import { isIOS } from '../utils/device';
import { TypingIndicator } from '../components/molecules/TypingIndicator';
import { IOSViewportDebug } from '../components/molecules/IOSViewportDebug';
import { useChat } from '../hooks/useChat';
import { useActiveComponents } from '../hooks/useActiveComponents';
import { getAccentColor, getShowNavigationHeader, getShowGradeSelection } from '../shared/config/app.config';
import { getColorClasses } from '../shared/config/theme.config';
import { GradeSelection } from '../components/organisms/GradeSelection';
import { GradeQuickReply } from '../components/organisms/GradeQuickReply';
import { GRADE_LABELS, GRADE_NAMES, type GradeType } from '../shared/constants/grade.constants';

function MainPage() {
  const { t, isLoading } = useLocale();
  const { clientId, appId, clientName, schoolName } = useClientConfig(); // Context에서 설정값 가져오기
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  const showNavigationHeader = getShowNavigationHeader();
  const showGradeSelection = getShowGradeSelection();
  const isInitialized = useRef(false);
  const [showFigmaQuickReply, setShowFigmaQuickReply] = useState(false);
  const [showFAQCategories, setShowFAQCategories] = useState(false);
  const [waitingForFAQCategories, setWaitingForFAQCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // 온보딩 관련 상태
  const [showGradeSelectionComponent, setShowGradeSelectionComponent] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeType | null>(null);
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(false);
  
  // CTA 관련 상태
  const [latestCTAMessageId, setLatestCTAMessageId] = useState<string | null>(null);
  const [hideAllCTA, setHideAllCTA] = useState(false);
  
  // 메시지 ID 기반 컴포넌트 활성화 관리
  const {
    activeComponents,
    activateComponent,
    deactivateComponent,
    isComponentActive
  } = useActiveComponents();

  const {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    currentlyTyping,
    messagesEndRef,
    chatContainerRef,
    handleSendMessage,
    completeTyping,
    addWelcomeMessage,
    addTypingBotMessage,
    addUserMessage
  } = useChat({
    userId: 'Hyunse0001', // 실제 사용자 ID
    gradeId: selectedGrade || 'high', // 선택된 학년 또는 기본값
    clientId, // 쿼리 파라미터에서 받은 clientId
    appId, // 쿼리 파라미터에서 받은 appId
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onTypingComplete: () => {
      // 첫 번째 메시지 타이핑 완료 후 처리
      setTimeout(() => {
        if (messages.length <= 1) {
          if (showGradeSelection) {
            // 학년 선택이 활성화된 경우: 온보딩 메시지 표시
            setShowOnboardingMessage(true);
          } else {
            // 학년 선택이 비활성화된 경우: 기본 QuickReply 표시
            setShowFigmaQuickReply(true);
          }
          // 스크롤
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }, 500);
      
      // FAQ 카테고리 대기 중이면 표시
      if (waitingForFAQCategories) {
        setTimeout(() => {
          setShowFAQCategories(true);
          setWaitingForFAQCategories(false);
          // FAQ 카테고리가 표시된 후 스크롤
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 500);
      }
      
    }
  });

  useEffect(() => {
    // 번역이 로드되고 초기화가 아직 되지 않았을 때만 welcome 메시지 추가
    if (!isLoading && !isInitialized.current) {
      // 동적 school_name 사용
      const welcomeMessage = t('chat.greeting').replace('{school_name}', schoolName);
      addWelcomeMessage(welcomeMessage);
      isInitialized.current = true;
    }
  }, [t, addWelcomeMessage, isLoading, schoolName]);

  // 최신 LLM 응답 메시지 ID 업데이트
  useEffect(() => {
    const llmMessages = messages.filter(m => m.type === 'bot' && m.llmResponse);
    if (llmMessages.length > 0) {
      const latestLLMMessage = llmMessages[llmMessages.length - 1];
      // 새로운 LLM 메시지가 추가된 경우에만 상태 업데이트
      if (latestLLMMessage.id !== latestCTAMessageId) {
        setLatestCTAMessageId(latestLLMMessage.id);
        // 새로운 LLM 메시지가 추가되면 CTA 표시 재활성화
        setHideAllCTA(false);
      }
    }
  }, [messages, latestCTAMessageId]);

  const handleQuickReplyClick = async (text: string) => {
    setNewMessage(text);
    setShowFigmaQuickReply(false);
    
    await handleSendMessage(text);
  };


  // 온보딩 메시지가 표시된 후 GradeSelection 표시
  useEffect(() => {
    if (showOnboardingMessage) {
      // 온보딩 메시지를 ChatMessage로 추가
      const onboardingMessage = t('onboarding.gradeSelectionMessage');
      addTypingBotMessage(onboardingMessage);
      
      setTimeout(() => {
        setShowGradeSelectionComponent(true);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 1000);
    }
  }, [showOnboardingMessage, addTypingBotMessage, t]);

  // 학년 선택 핸들러
  const handleGradeSelect = (grade: GradeType) => {
    setSelectedGrade(grade);
    setShowGradeSelectionComponent(false);
    
    // 선택한 학년을 사용자 메시지로 표시
    addUserMessage(GRADE_LABELS[grade], false);
    
    // 학년 확인 봇 메시지 추가
    setTimeout(() => {
      const confirmationMessage = `${GRADE_NAMES[grade]}ですね！どのようなことを知りたいですか？`;
      addTypingBotMessage(confirmationMessage);
      
      // 학년별 퀵 리플라이 표시
      setTimeout(() => {
        setShowFigmaQuickReply(true);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 1000);
    }, 500);
  };

  // もどる 버튼 핸들러
  const handleBackToGradeSelection = () => {
    setShowFigmaQuickReply(false);
    setSelectedGrade(null);
    
    // "もどる" 사용자 메시지 표시
    addUserMessage('もどる', false);
    
    // GradeSelection 다시 표시
    setTimeout(() => {
      setShowGradeSelectionComponent(true);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 500);
  };

  const handleShowFAQCategories = () => {
    const otherText = t('chat.quickReplies.other');
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    // 이전 FAQ 카테고리 비활성화
    deactivateComponent('faqCategories');
    
    // 유저 메시지 추가
    addUserMessage(otherText, false);
    setShowFigmaQuickReply(false);
    
    // 타이핑 봇 메시지 추가하고 메시지 ID로 FAQ 카테고리 활성화
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
      // 메시지 ID를 사용하여 FAQ 카테고리 활성화
      activateComponent('faqCategories', messageId);
    }, 100);
  };

  const handleFAQCategorySelect = (category: any) => {
    const categoryTitle = t(category.textKey);
    const categorySelectedMessage = t('chat.faq.categorySelected', { category: categoryTitle });
    
    // 이전 컴포넌트들 비활성화
    deactivateComponent('faqCategories');
    deactivateComponent('topQuestions');
    
    // 1. 유저 메시지로 선택한 카테고리 표시
    addUserMessage(categoryTitle, false);
    setShowFAQCategories(false);
    setSelectedCategory(category);
    
    // 2. 봇 메시지 타이핑 애니메이션으로 표시하고 메시지 ID로 TopQuestions 활성화
    setTimeout(() => {
      const messageId = addTypingBotMessage(categorySelectedMessage);
      // 메시지 ID를 사용하여 TopQuestions 활성화
      activateComponent('topQuestions', messageId);
    }, 100);
  };

  const handleTopQuestionSelect = async (question: string) => {
    // 4. 각 top 질문을 클릭하면 유저 메시지로 표시 후 LLM 송신
    deactivateComponent('topQuestions');
    setSelectedCategory(null);
    await handleSendMessage(question);
  };

  const handleBackToCategories = () => {
    // 5. 카테고리 선택으로 돌아가기 클릭하면 유저 메시지로 표시 후 카테고리 재표시
    const backText = t('chat.faq.backToCategories');
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    // 이전 컴포넌트들 비활성화
    deactivateComponent('topQuestions');
    deactivateComponent('faqCategories');
    
    addUserMessage(backText, false);
    setSelectedCategory(null);
    
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
      // 새로운 메시지 ID로 FAQ 카테고리 활성화
      activateComponent('faqCategories', messageId);
    }, 100);
  };

  const handleTopQuestionsDataLoaded = () => {
    // TopQuestions 데이터가 로드되고 렌더링이 완료된 후 스크롤
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleSendClick = async () => {
    await handleSendMessage();
  };

  // CTA 버튼 클릭 핸들러
  const handleMainCTAClick = () => {
    console.log('Main CTA clicked: 資料請求する');
    // 메인 CTA는 이미 CTAButtons 컴포넌트에서 외부 링크로 처리됨
  };

  const handleSubCTAClick = () => {
    // 즉시 모든 CTA 숨기기
    setHideAllCTA(true);
    
    // 이전 FAQ 카테고리 비활성화
    deactivateComponent('faqCategories');
    
    // CTA 서브 버튼용 FAQ 카테고리 표시 (유저 메시지는 "もう少し質問する"로)
    const subCTAText = 'もう少し質問する';
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    // 유저 메시지 추가
    addUserMessage(subCTAText, false);
    
    // 타이핑 봇 메시지 추가하고 메시지 ID로 FAQ 카테고리 활성화
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
      activateComponent('faqCategories', messageId);
    }, 100);
  };

  // CTA 표시 완료 후 스크롤 핸들러
  const handleCTADisplayed = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
    
    // 외부 링크 처리
    if (item.action === 'external-link' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // FAQ 메뉴 클릭 시 처리
    if (item.id === 'ai-faq') {
      // 이전 FAQ 카테고리 비활성화
      deactivateComponent('faqCategories');
      
      // 1. 유저 메시지로 라벨 표시
      addUserMessage(item.label, false);
      
      // 2. FAQ 카테고리를 위한 봇 메시지 타이핑
      setTimeout(() => {
        const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
        setWaitingForFAQCategories(true);
        const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
        activateComponent('faqCategories', messageId);
      }, 100);
    }
    // 다른 메뉴 아이템들 처리
    else if (item.action === 'navigate' && item.url) {
      // 네비게이션 액션 처리 (추후 구현)
      console.log('Navigate to:', item.url);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-navi-orange-main" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* iOS Viewport Debug - 개발용 (배포 시 제거) */}
      <IOSViewportDebug enabled={process.env.NODE_ENV === 'development'} />
      
      <ChatLayout
        showNavigationHeader={showNavigationHeader}
        header={
          <NavigationHeader 
            title={`${clientName}CS AI Navi`} 
            accentColor={accentColor}
            showDynamicHeader={true}
            clientId={clientId}
            clientName={clientName}
            schoolName={schoolName}
            onHeaderAction={(action: any) => {
              if (action.type === 'close') {
                console.log('Header close action triggered');
              }
            }}
          />
        }
        input={
          <ChatInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendClick}
            disabled={isTyping || (showGradeSelection && !selectedGrade)}
            clientId={clientId}
            placeholder={
              showGradeSelection && !selectedGrade 
                ? 'まずは学年を選択してください'
                : undefined
            }
            onMenuItemClick={handleMenuItemClick}
          />
        }
      >
      <div 
        ref={chatContainerRef}
        className="h-full overflow-y-auto pb-4"
        data-testid="chat-container"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4" data-testid="messages-container">
          {messages.map((message, index) => {
            // 첫 번째 봇 메시지인지 확인
            const firstBotMessageIndex = messages.findIndex(m => m.type === 'bot');
            const isFirstBotMessage = message.type === 'bot' && index === firstBotMessageIndex;
            
            
            return (
              <div key={message.id}>
                <ChatMessage 
                  message={message} 
                  hideAvatar={message.type === 'bot' && !isFirstBotMessage}
                  llmResponse={message.llmResponse}
                  clientId={clientId}
                  // 최신 LLM 응답에서만 CTA 버튼 표시
                  {...(message.llmResponse ? {
                    showCTAAfterComplete: message.id === latestCTAMessageId && !hideAllCTA,
                    onMainCTAClick: handleMainCTAClick,
                    onSubCTAClick: handleSubCTAClick,
                    onCTADisplayed: handleCTADisplayed
                  } : {})}
                />
              
              {/* 온보딩 메시지 다음에 GradeSelection 표시 (최초) */}
              {index === 1 && message.type === 'bot' && showGradeSelectionComponent && showGradeSelection && 
               !messages.some(msg => msg.content === 'もどる') && (
                <div className="mt-4">
                  <GradeSelection 
                    onGradeSelect={handleGradeSelect} 
                    clientId={clientId}
                  />
                </div>
              )}
              
              {/* もどる 버튼 클릭 후 GradeSelection 표시 (가장 마지막 もどる 메시지에만) */}
              {message.type === 'user' && message.content === 'もどる' && showGradeSelectionComponent && 
               index === messages.length - 1 && (
                <div className="mt-4">
                  <GradeSelection 
                    onGradeSelect={handleGradeSelect}
                    clientId={clientId}
                  />
                </div>
              )}
              
              {/* 온보딩이 비활성화된 경우 기본 QuickReply 표시 */}
              {index === 0 && message.type === 'bot' && showFigmaQuickReply && !showGradeSelection && (
                <div className="mt-4">
                  <QuickReply 
                    onReplyClick={handleQuickReplyClick}
                    onShowFAQCategories={handleShowFAQCategories}
                    show={true}
                    userId="Hyunse0001"
                  />
                </div>
              )}
              
              {/* 학년 확인 메시지 후 학년별 QuickReply 표시 (가장 마지막 확인 메시지에서만) */}
              {message.type === 'bot' && showFigmaQuickReply && selectedGrade && 
               message.content && typeof message.content === 'string' && (message.content.includes('ですね！どのようなことを知りたいですか？')) && 
               (() => {
                 // 학년 확인 메시지들을 찾아서 현재 메시지가 가장 마지막인지 확인
                 const confirmationMessages = messages.filter(msg => 
                   msg.type === 'bot' && msg.content && typeof msg.content === 'string' && 
                   msg.content.includes('ですね！どのようなことを知りたいですか？')
                 );
                 const lastConfirmationIndex = messages.lastIndexOf(confirmationMessages[confirmationMessages.length - 1]);
                 return index === lastConfirmationIndex;
               })() && (
                <div className="mt-4">
                  <GradeQuickReply
                    grade={selectedGrade}
                    onReplyClick={handleQuickReplyClick}
                    onShowFAQCategories={handleShowFAQCategories}
                    onBackClick={handleBackToGradeSelection}
                  />
                </div>
              )}
              {/* FAQ 카테고리를 해당 메시지 ID에서만 표시 */}
              {isComponentActive('faqCategories', message.id) && showFAQCategories && (
                <div className="mt-4">
                  <FAQCategory 
                    onCategorySelect={handleFAQCategorySelect}
                  />
                </div>
              )}
              {/* Top 질문을 메시지 ID 기반으로 표시 */}
              {selectedCategory && isComponentActive('topQuestions', message.id) && (
                <div className="mt-4">
                  <TopQuestions
                    categoryId={selectedCategory.id}
                    categoryTitle={t(selectedCategory.textKey)}
                    grade={selectedGrade || 'high'}
                    onQuestionSelect={handleTopQuestionSelect}
                    onBackToCategories={handleBackToCategories}
                    userId="Hyunse0001"
                    onDataLoaded={handleTopQuestionsDataLoaded}
                  />
                </div>
              )}
              </div>
            );
          })}
          
          {currentlyTyping && (
            <ChatMessage
              message={{
                id: 'typing',
                type: 'bot',
                content: currentlyTyping.message,
                timestamp: new Date()
              }}
              isTyping={true}
              onTypingComplete={completeTyping}
              hideAvatar={messages.some(m => m.type === 'bot')}
              llmResponse={currentlyTyping.llmResponse}
              enableLLMTyping={true}
              clientId={clientId}
            />
          )}
          
          {isTyping && !currentlyTyping && (
            <TypingIndicator accentColor={accentColor} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      </ChatLayout>
    </>
  );
}

export default MainPage;