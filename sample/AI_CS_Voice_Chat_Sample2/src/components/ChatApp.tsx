'use client';

import { useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { VoiceInput } from './VoiceInput';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Send, MessageSquare, FileText, Phone } from 'lucide-react';

type ColorTheme = 'blue' | 'green' | 'orange' | 'red' | 'purple';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
};

type MenuTab = 'faq' | 'documents' | 'voice';

const colorThemes = {
  blue: {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    gradient: 'bg-gradient-to-r from-blue-400 to-blue-600',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600'
  },
  green: {
    primary: 'bg-green-500',
    primaryHover: 'hover:bg-green-600',
    gradient: 'bg-gradient-to-r from-green-400 to-green-600',
    light: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600'
  },
  orange: {
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    gradient: 'bg-gradient-to-r from-orange-400 to-orange-600',
    light: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600'
  },
  red: {
    primary: 'bg-red-500',
    primaryHover: 'hover:bg-red-600',
    gradient: 'bg-gradient-to-r from-red-400 to-red-600',
    light: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600'
  },
  purple: {
    primary: 'bg-purple-500',
    primaryHover: 'hover:bg-purple-600',
    gradient: 'bg-gradient-to-r from-purple-400 to-purple-600',
    light: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600'
  }
};

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！3.14 communityについて何でもご質問してください！',
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'まずは、お子様の学年を教えてください👍',
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '3',
      text: '小学生ですね！どのようなことを知りたいですか？',
      sender: 'ai',
      timestamp: new Date(),
      attachments: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
          name: '学習資料.jpg'
        }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<MenuTab>('faq');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');

  const theme = colorThemes[colorTheme];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'ご質問ありがとうございます。詳しく調べてお答えします。',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceInput = (transcript: string) => {
    handleSendMessage(transcript);
  };

  const quickQuestions = [
    '小学生の授業料はいくらですか？',
    '塾や他の習い事と両立できますか？',
    '中学受験コースはありますか？'
  ];

  return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col relative">
      {/* Voice Mode Overlay */}
      {isVoiceMode && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          <div className="h-[10%] flex items-center justify-center border-b">
            <div className={`${theme.gradient} p-3 rounded-full`}>
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="h-[90%] p-6">
            <VoiceInput
              onTranscript={handleVoiceInput}
              onClose={() => setIsVoiceMode(false)}
              theme={theme}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${theme.gradient} p-4 text-white`}>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <div className={`w-full h-full ${theme.primary} flex items-center justify-center text-white rounded-full`}>
              <MessageSquare className="w-6 h-6" />
            </div>
          </Avatar>
          <div>
            <h1 className="font-medium">AI Navi</h1>
            <div className="flex gap-2 mt-1">
              {Object.keys(colorThemes).map((color) => (
                <button
                  key={color}
                  onClick={() => setColorTheme(color as ColorTheme)}
                  className={`w-3 h-3 rounded-full ${colorThemes[color as ColorTheme].primary} ${
                    colorTheme === color ? 'ring-2 ring-white' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            theme={theme}
          />
        ))}
        
        {/* Quick Questions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✨ よくある質問Top3（直近14日間の統計）</p>
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className={`w-full text-left p-3 rounded-2xl ${theme.primary} text-white hover:opacity-90 transition-opacity`}
            >
              {question}
            </button>
          ))}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
              その他
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
              もどる
            </button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      {!isVoiceMode && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="メッセージを入力してください..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              className={`${theme.primary} ${theme.primaryHover} text-white`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Menu */}
      {!isVoiceMode && (
        <div className="bg-white border-t p-4">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'faq' ? `${theme.light} ${theme.text}` : 'text-gray-500'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">AI FAQ</span>
            </button>
            
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'documents' ? `${theme.light} ${theme.text}` : 'text-gray-500'
              }`}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">資料請求</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('voice');
                setIsVoiceMode(true);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'voice' ? `${theme.light} ${theme.text}` : 'text-gray-500'
              }`}
            >
              <Phone className="w-6 h-6" />
              <span className="text-sm">AI電話相談</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}