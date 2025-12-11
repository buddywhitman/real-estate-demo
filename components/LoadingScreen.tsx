/*
  ===========================================================================================
  LOADING SCREEN
  ===========================================================================================
  
  A fun, animated loading state to entertain users during code splitting / lazy loading.
*/

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, BrainCircuit, Loader2, Zap } from 'lucide-react';

export const LoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Waking up the AI hamsters...",
    "Polishing the glassmorphism...",
    "Calculating the meaning of real estate...",
    "Asking Gemini for investment advice...",
    "Compressing luxury pixels...",
    "Feeding the neural network...",
    "Staging the virtual furniture...",
    "Negotiating with the server...",
    "Finding the perfect lighting...",
    "Brewing digital coffee..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 animate-pulse">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-500/30 blur-2xl rounded-full animate-pulse"></div>
        <div className="relative bg-[#151515] p-6 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center transform transition-transform hover:scale-105 duration-500">
           <div className="relative">
             <Bot size={56} className="text-white relative z-10" />
             <BrainCircuit size={24} className="text-brand-400 absolute -top-2 -right-2 animate-spin-slow" />
           </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-brand-600 rounded-full p-1.5 border-2 border-[#050505]">
           <Sparkles size={16} className="text-white animate-spin" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-bold text-white tracking-widest uppercase">Loading System</h3>
        <div className="h-6 overflow-hidden relative w-64 text-center">
           <p key={messageIndex} className="text-brand-300 text-sm animate-bounce">
              {messages[messageIndex]}
           </p>
        </div>
      </div>
      
      <div className="mt-8 flex gap-2">
         <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></div>
         <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce delay-75"></div>
         <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce delay-150"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;