import React from 'react';
import { BotVisualizer } from './BotVisualizer';
import { useStore } from '../../store/useStore';

const languages = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' }
];

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [fadeOut, setFadeOut] = React.useState(false);
  const { language, setLanguage } = useStore();

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
          
          {/* Language Selection */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Choose your language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-base font-medium text-gray-700 hover:border-intl-orange focus:outline-none focus:ring-2 focus:ring-intl-orange focus:border-transparent transition-all cursor-pointer shadow-sm"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
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
