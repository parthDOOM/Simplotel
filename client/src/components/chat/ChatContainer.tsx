import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ChatBubble } from './ChatBubble';

export const ChatContainer: React.FC = () => {
  const messages = useStore(state => state.messages);
  const currentTranscript = useStore(state => state.currentTranscript);
  const audioState = useStore(state => state.audioState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscript]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-grey/20 p-3 lg:p-4">
      <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4 scrollbar-thin scrollbar-thumb-slate-grey/30 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-grey text-sm">
            <p>Start a conversation by clicking the microphone button</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatBubble key={message._id || index} message={message} />
        ))}
        
        {currentTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[60%] rounded-2xl px-3 py-2 lg:px-4 lg:py-3 bg-intl-orange/30 text-deep-charcoal border border-intl-orange/50 rounded-br-sm">
              <p className="text-sm md:text-base leading-relaxed italic">
                {currentTranscript}
              </p>
            </div>
          </div>
        )}

        {audioState === 'processing' && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[60%] rounded-2xl px-3 py-2 lg:px-4 lg:py-3 bg-white border border-slate-grey/20 rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-grey rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-grey rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-grey rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
