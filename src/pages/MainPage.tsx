import { useEffect, useRef } from 'react';
import { UserCircle, Loader2 } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import NavigationHeader from '../components/common/NavigationHeader';
import ChatMessage from '../components/ui/ChatMessage';
import ChatInput from '../components/ui/ChatInput';
import QuickReply, { QuickReplyOption } from '../components/ui/QuickReply';
import { useChat } from '../hooks/useChat';
import { useTheme } from '../hooks/useTheme';

function MainPage() {
  const { t, isLoading } = useLocale();
  const { accentColor, colors } = useTheme();
  const isInitialized = useRef(false);

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
    addWelcomeMessage
  } = useChat({
    userId: 'Hyunse0001', // 실제 사용자 ID
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  useEffect(() => {
    // 번역이 로드되고 초기화가 아직 되지 않았을 때만 welcome 메시지 추가
    if (!isLoading && !isInitialized.current) {
      const welcomeMessage = t('chat.greeting');
      addWelcomeMessage(welcomeMessage);
      isInitialized.current = true;
    }
  }, [t, addWelcomeMessage, isLoading]);

  const handleQuickReplyClick = async (reply: QuickReplyOption) => {
    const translatedValue = t(reply.valueKey);
    setNewMessage(translatedValue);
    await handleSendMessage(translatedValue);
  };

  const handleSendClick = async () => {
    await handleSendMessage();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <NavigationHeader title={t('common.home')} accentColor={accentColor} />

      <div className={`bg-gradient-to-r ${colors.gradient.from} ${colors.gradient.to} flex-shrink-0`}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className={`bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm border ${colors.border}`}>
              <UserCircle className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {t('chat.welcomeGreeting')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('chat.welcomeMessage')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
        <div className="flex-1 overflow-hidden">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto pb-4"
          >
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <ChatMessage message={message} accentColor={accentColor} />
                  {/* 첫 번째 메시지 (봇의 인사) 다음에 QuickReply 표시 */}
                  {index === 0 && message.type === 'bot' && (
                    <div className="mt-4">
                      <QuickReply 
                        onReplyClick={handleQuickReplyClick}
                        show={true}
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
                  accentColor={accentColor}
                />
              )}
              
              {isTyping && !currentlyTyping && (
                <div className="flex items-start gap-3">
                  <div className={`bg-${accentColor}-500 text-white p-2 rounded-full flex-shrink-0`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ChatInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendClick}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;