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
import { getAccentColor, getShowNavigationHeader } from '../shared/config/app.config';

function MainPage() {
  const { t, isLoading } = useLocale();
  const accentColor = getAccentColor();
  const showNavigationHeader = getShowNavigationHeader();
  const isInitialized = useRef(false);
  const [showFigmaQuickReply, setShowFigmaQuickReply] = useState(false);
  const [showFAQCategories, setShowFAQCategories] = useState(false);
  const [waitingForFAQCategories, setWaitingForFAQCategories] = useState(false);
  const [showTopQuestions, setShowTopQuestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [waitingForTopQuestions, setWaitingForTopQuestions] = useState(false);

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
      // 첫 번째 메시지 타이핑 완료 후 Figma QuickReply 표시
      setTimeout(() => {
        if (messages.length <= 1) {
          setShowFigmaQuickReply(true);
          // QuickReply가 표시된 후 스크롤
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
              <ChatMessage message={message} />
              {/* 첫 번째 메시지 (봇의 인사) 다음에 QuickReply 표시 */}
              {index === 0 && message.type === 'bot' && showFigmaQuickReply && (
                <div className="mt-4">
                  <QuickReply 
                    onReplyClick={handleQuickReplyClick}
                    onShowFAQCategories={handleShowFAQCategories}
                    show={true}
                    userId="Hyunse0001"
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