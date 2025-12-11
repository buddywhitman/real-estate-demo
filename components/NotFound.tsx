/*
  ===========================================================================================
  404 / NOT FOUND / ERROR COMPONENT
  ===========================================================================================
*/

import React from 'react';
import { Search, ArrowLeft, Ghost, Map, Home } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface NotFoundProps {
  onGoHome: () => void;
  isError?: boolean;
  errorDetails?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome, isError, errorDetails }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8 animate-fade-in">
       {/* Animated Illustration */}
       <div className="relative mb-8 group cursor-pointer" onClick={onGoHome}>
           <div className={`absolute inset-0 ${isError ? 'bg-red-500/20' : 'bg-brand-500/20'} blur-3xl rounded-full animate-pulse`}></div>
           <GlassCard className="relative p-10 rounded-full border-2 border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-black/40">
              {isError ? (
                  <Ghost size={80} className="text-red-400 animate-bounce" />
              ) : (
                  <div className="relative">
                      <Home size={80} className="text-brand-400 opacity-50" />
                      <div className="absolute -bottom-2 -right-4 bg-black p-2 rounded-full border border-gray-700 animate-pulse">
                         <Search size={32} className="text-white" />
                      </div>
                  </div>
              )}
           </GlassCard>
       </div>

       <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
           {isError ? "System Meltdown" : "404: Property Off Market"}
       </h1>
       
       <p className="text-lg text-gray-400 max-w-md mb-8 leading-relaxed">
           {isError 
             ? "Our AI tried to divide by zero while calculating a mortgage. The engineers have been notified."
             : "We checked the MLS, the archives, and the dark web. This page has officially ghosted us."
           }
       </p>

       {errorDetails && (
           <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-8 max-w-lg text-left overflow-auto max-h-32 w-full custom-scrollbar">
               <p className="font-mono text-xs text-red-300">Error: {errorDetails}</p>
           </div>
       )}

       <button 
         onClick={onGoHome}
         className="group relative px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-3 overflow-hidden"
       >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
       </button>
    </div>
  );
};