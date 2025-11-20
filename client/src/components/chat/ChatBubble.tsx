import React from 'react';
import { Message } from '../../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  // Use message's own sentiment score
  const sentimentScore = message.sentimentScore || 0;
  
  // Get dynamic color based on sentiment
  const getSentimentColor = () => {
    if (!isUser) return 'bg-white text-deep-charcoal border border-slate-grey/20';
    
    if (sentimentScore > 0.3) {
      // Positive - shades of blue
      if (sentimentScore > 0.7) return 'bg-blue-600 text-white shadow-blue-200 shadow-md';
      if (sentimentScore > 0.5) return 'bg-blue-500 text-white shadow-blue-200 shadow-md';
      return 'bg-blue-400 text-white shadow-blue-200 shadow-md';
    } else if (sentimentScore < -0.3) {
      // Negative - shades of amber/orange
      if (sentimentScore < -0.7) return 'bg-amber-700 text-white shadow-amber-200 shadow-md';
      if (sentimentScore < -0.5) return 'bg-amber-600 text-white shadow-amber-200 shadow-md';
      return 'bg-amber-500 text-white shadow-amber-200 shadow-md';
    } else {
      // Neutral - default orange
      return 'bg-intl-orange text-white shadow-orange-200 shadow-md';
    }
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] sm:max-w-[75%] md:max-w-[60%] rounded-2xl px-3 py-2 lg:px-4 lg:py-3
          ${getSentimentColor()}
          ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
        `}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span className={`text-xs mt-1 block ${isUser ? 'text-white/70' : 'text-slate-grey'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};
