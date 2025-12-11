/*
  ===========================================================================================
  UI UTILITY: GLASS CARD
  ===========================================================================================
  
  Standard container component for the Glassmorphism design system.
*/

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false, onClick }) => {
  return (
    <div 
      className={`backdrop-blur-xl bg-glass-100 border border-glass-border rounded-xl shadow-lg ${noPadding ? '' : 'p-6'} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};