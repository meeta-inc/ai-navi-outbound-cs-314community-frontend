import { useState, useEffect } from 'react';
import { UserCircle, Loader2 } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import NavigationHeader from '../components/common/NavigationHeader';
import ChatMessage from '../components/ui/ChatMessage';
import ChatInput from '../components/ui/ChatInput';
import QuickReply, { QuickReplyOption } from '../components/ui/QuickReply';
import { useChat } from '../hooks/useChat';

function MainPage() {
  const { t } = useLocale();
  const [showQuickReplies, setShowQuickReplies] = useState(true);

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
    userId: 'guest-' + Date.now(), // 게스트 사용자 ID
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  useEffect(() => {
    const welcomeMessage = t('chat.greeting');
    addWelcomeMessage(welcomeMessage);
  }, [t, addWelcomeMessage]);

  const handleQuickReplyClick = async (reply: QuickReplyOption) => {
    const translatedValue = t(reply.valueKey);
    setNewMessage(translatedValue);
    setShowQuickReplies(false);
    await handleSendMessage(translatedValue);
  };

  const handleSendClick = async () => {
    if (showQuickReplies) {
      setShowQuickReplies(false);
    }
    await handleSendMessage();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationHeader title={t('common.home')} />

      <div className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm border border-blue-100">
              <UserCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {t('chat.greeting')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('chat.welcomeMessage')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-hidden">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
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
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0">
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

        <QuickReply 
          onReplyClick={handleQuickReplyClick}
          show={showQuickReplies}
        />

        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendClick}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

export default MainPage;