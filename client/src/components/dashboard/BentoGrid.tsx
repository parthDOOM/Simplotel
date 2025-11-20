import React from 'react';

interface BentoGridProps {
  children: React.ReactNode;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-4 auto-rows-fr">
      {children}
    </div>
  );
};
