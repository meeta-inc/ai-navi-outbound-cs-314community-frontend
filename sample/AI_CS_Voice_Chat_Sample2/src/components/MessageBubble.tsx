'use client';

import { Avatar } from './ui/avatar';
import { MessageSquare, Download, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

type Theme = {
  primary: string;
  primaryHover: string;
  gradient: string;
  light: string;
  border: string;
  text: string;
};

interface MessageBubbleProps {
  message: Message;
  theme: Theme;
}

export function MessageBubble({ message, theme }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
      {message.sender === 'ai' && (
        <Avatar className="w-8 h-8 mt-1">
          <div className={`w-full h-full ${theme.primary} flex items-center justify-center text-white rounded-full`}>
            <MessageSquare className="w-4 h-4" />
          </div>
        </Avatar>
      )}
      
      <div className="max-w-[80%] space-y-2">
        {message.sender === 'user' && (
          <div className="flex justify-end items-center gap-2">
            <span className="text-xs text-gray-500">👤小学生</span>
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl ${
            message.sender === 'user'
              ? `${theme.primary} text-white ml-auto`
              : 'bg-blue-50 text-gray-800'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="space-y-2">
                  {attachment.type === 'image' ? (
                    <div className="relative rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => window.open(attachment.url, '_blank')}
                          className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-white bg-opacity-50 rounded-lg border border-white border-opacity-30">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Download className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">ファイル</p>
                      </div>
                      <button
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-400 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {message.sender === 'user' && (
        <Avatar className="w-8 h-8 mt-1">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white rounded-full">
            👤
          </div>
        </Avatar>
      )}
    </div>
  );
}