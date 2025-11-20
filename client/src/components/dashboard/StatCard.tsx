import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-grey/20 p-3 lg:p-4 flex flex-col min-h-[90px]">
      <div className="flex items-start justify-between mb-1 lg:mb-2">
        <h3 className="text-xs lg:text-sm font-medium text-slate-grey">{title}</h3>
        {icon && <div className="text-intl-orange text-sm lg:text-base">{icon}</div>}
      </div>
      <div className="flex-1 flex items-center">
        <p className="text-xl lg:text-3xl font-semibold text-deep-charcoal break-all">{value}</p>
      </div>
      {subtitle && (
        <p className="text-xs text-slate-grey mt-1 lg:mt-2">{subtitle}</p>
      )}
    </div>
  );
};
