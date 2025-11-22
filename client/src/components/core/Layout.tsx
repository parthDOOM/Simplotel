import React from 'react';
import { useStore } from '../../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const sentimentScore = useStore(state => state.sentimentScore);
  
  // Get background gradient based on sentiment
  const getBackgroundClass = () => {
    if (sentimentScore > 0.3) {
      return 'bg-gradient-to-br from-blue-50 to-soft-paper';
    } else if (sentimentScore < -0.3) {
      return 'bg-gradient-to-br from-amber-50 to-soft-paper';
    }
    return 'bg-soft-paper';
  };
  
  return (
    <div className={`min-h-screen flex flex-col transition-[background-color] duration-1000 ease-in-out ${getBackgroundClass()}`}>
      <header className="bg-white border-b border-slate-grey/20 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/swiss-bot-logic-core.svg" alt="Bot Logo" className="w-8 h-8 lg:w-10 lg:h-10" />
            <h1 className="text-xl lg:text-2xl font-semibold text-deep-charcoal">
              Intelligent Voice Bot
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-1 p-3 lg:p-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
