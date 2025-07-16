import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { ChatLayout } from '../components/templates/ChatLayout';
import { NavigationHeader } from '../components/organisms/NavigationHeader';
import { ChatMessage } from '../components/organisms/ChatMessage';
import { ChatInput } from '../components/organisms/ChatInput';
import { QuickReply } from '../components/organisms/QuickReply';
import { FAQCategory } from '../components/organisms/FAQCategory';
import { TopQuestions } from '../components/organisms/TopQuestions';
import { TypingIndicator } from '../components/molecules/TypingIndicator';
import { useChat } from '../hooks/useChat';
import { getAccentColor, getShowNavigationHeader, getShowGradeSelection } from '../shared/config/app.config';
import { getColorClasses } from '../shared/config/theme.config';
import { GradeSelection } from '../components/organisms/GradeSelection';
import { GradeQuickReply } from '../components/organisms/GradeQuickReply';
import { GRADE_LABELS, GRADE_NAMES, type GradeType } from '../shared/constants/grade.constants';

function MainPage() {
  const { t, isLoading } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  const showNavigationHeader = getShowNavigationHeader();
  const showGradeSelection = getShowGradeSelection();
  const isInitialized = useRef(false);
  const [showFigmaQuickReply, setShowFigmaQuickReply] = useState(false);
  const [showFAQCategories, setShowFAQCategories] = useState(false);
  const [waitingForFAQCategories, setWaitingForFAQCategories] = useState(false);
  const [showTopQuestions, setShowTopQuestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [waitingForTopQuestions, setWaitingForTopQuestions] = useState(false);
  
  // 온보딩 관련 상태
  const [showGradeSelectionComponent, setShowGradeSelectionComponent] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeType | null>(null);
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(false);

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
      
      // Top 질문 대기 중이면 표시
      if (waitingForTopQuestions) {
        setTimeout(() => {
          setShowTopQuestions(true);
          setWaitingForTopQuestions(false);
        }, 500);
      }
    }
  });

  useEffect(() => {
    // 번역이 로드되고 초기화가 아직 되지 않았을 때만 welcome 메시지 추가
    if (!isLoading && !isInitialized.current) {
      const schoolName = t('chat.schoolName');
      const welcomeMessage = t('chat.greeting').replace('{school_name}', schoolName);
      addWelcomeMessage(welcomeMessage);
      isInitialized.current = true;
    }
  }, [t, addWelcomeMessage, isLoading]);

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
    
    // 유저 메시지 추가
    addUserMessage(otherText, false);
    setShowFigmaQuickReply(false);
    
    // 타이핑 봇 메시지 추가
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      addTypingBotMessage(whatWouldYouLikeToKnow);
    }, 100);
  };

  const handleFAQCategorySelect = (category: any) => {
    const categoryTitle = t(category.textKey);
    const categorySelectedMessage = t('chat.faq.categorySelected', { category: categoryTitle });
    
    // 1. 유저 메시지로 선택한 카테고리 표시
    addUserMessage(categoryTitle, false);
    setShowFAQCategories(false);
    setSelectedCategory(category);
    
    // 2. 봇 메시지 타이핑 애니메이션으로 표시
    setTimeout(() => {
      setWaitingForTopQuestions(true);
      addTypingBotMessage(categorySelectedMessage);
    }, 100);
  };

  const handleTopQuestionSelect = async (question: string) => {
    // 4. 각 top 질문을 클릭하면 유저 메시지로 표시 후 LLM 송신
    setShowTopQuestions(false);
    setSelectedCategory(null);
    await handleSendMessage(question);
  };

  const handleBackToCategories = () => {
    // 5. 카테고리 선택으로 돌아가기 클릭하면 유저 메시지로 표시 후 카테고리 재표시
    const backText = t('chat.faq.backToCategories');
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    addUserMessage(backText, false);
    setShowTopQuestions(false);
    setSelectedCategory(null);
    
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      addTypingBotMessage(whatWouldYouLikeToKnow);
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

  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
    
    // FAQ 메뉴 클릭 시 처리
    if (item.id === 'ai-faq') {
      // 1. 유저 메시지로 라벨 표시
      addUserMessage(item.label, false);
      
      // 2. FAQ 카테고리를 위한 봇 메시지 타이핑
      setTimeout(() => {
        const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
        setWaitingForFAQCategories(true);
        addTypingBotMessage(whatWouldYouLikeToKnow);
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
    <ChatLayout
      showNavigationHeader={showNavigationHeader}
      header={
        <NavigationHeader 
          title={t('common.home')} 
          accentColor={accentColor}
          showDynamicHeader={true}
          clientId="default"
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
          disabled={isTyping}
          onMenuItemClick={handleMenuItemClick}
        />
      }
    >
      <div 
        ref={chatContainerRef}
        className="h-full overflow-y-auto pb-4"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <div key={message.id}>
              <ChatMessage 
                message={message} 
                hideAvatar={index === 1 && message.type === 'bot' && showGradeSelection && message.content === t('onboarding.gradeSelectionMessage')}
              />
              
              {/* 온보딩 메시지 다음에 GradeSelection 표시 (최초) */}
              {index === 1 && message.type === 'bot' && showGradeSelectionComponent && showGradeSelection && 
               !messages.some(msg => msg.content === 'もどる') && (
                <div className="mt-4">
                  <GradeSelection onGradeSelect={handleGradeSelect} />
                </div>
              )}
              
              {/* もどる 버튼 클릭 후 GradeSelection 표시 (가장 마지막 もどる 메시지에만) */}
              {message.type === 'user' && message.content === 'もどる' && showGradeSelectionComponent && 
               index === messages.length - 1 && (
                <div className="mt-4">
                  <GradeSelection onGradeSelect={handleGradeSelect} />
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
              {/* FAQ 카테고리를 해당 메시지 바로 다음에 표시 */}
              {message.content === t('chat.faq.whatWouldYouLikeToKnow') && message.type === 'bot' && showFAQCategories && (
                <div className="mt-4">
                  <FAQCategory 
                    onCategorySelect={handleFAQCategorySelect}
                  />
                </div>
              )}
              {/* Top 질문을 해당 메시지 바로 다음에 표시 */}
              {selectedCategory && message.content === t('chat.faq.categorySelected', { category: t(selectedCategory.textKey) }) && message.type === 'bot' && showTopQuestions && (
                <div className="mt-4">
                  <TopQuestions
                    categoryId={selectedCategory.id}
                    categoryTitle={t(selectedCategory.textKey)}
                    onQuestionSelect={handleTopQuestionSelect}
                    onBackToCategories={handleBackToCategories}
                    userId="Hyunse0001"
                    onDataLoaded={handleTopQuestionsDataLoaded}
                  />
                </div>
              )}
            </div>
          ))}
          
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
            />
          )}
          
          {isTyping && !currentlyTyping && (
            <TypingIndicator accentColor={accentColor} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </ChatLayout>
  );
}

export default MainPage;