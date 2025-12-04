import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`backdrop-blur-xl bg-glass-100 border border-glass-border rounded-xl shadow-lg ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};