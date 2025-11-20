import React from 'react';
import { BotVisualizer } from './BotVisualizer';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [fadeOut, setFadeOut] = React.useState(false);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      onStart();
    }, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-orange-50 transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Bot on left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2">
        <BotVisualizer />
      </div>
      
      {/* Content on right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
        <div className="text-center space-y-6 px-8">
          <h1 className="text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
            Intelligent Voice Bot
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Your AI companion
          </p>
          
          <button
            onClick={handleStart}
            className="mt-8 px-8 py-4 bg-intl-orange text-white rounded-full font-semibold text-lg
                     hover:bg-deep-charcoal transition-all duration-300 transform hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};
