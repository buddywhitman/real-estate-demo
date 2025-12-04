import React from 'react';
import { GlassCard } from './GlassCard';
import { Mail, MessageCircle, Globe, Code } from 'lucide-react';

export const SupportView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
       <div className="mb-8">
         <h2 className="text-2xl font-semibold text-white">Support & Development</h2>
         <p className="text-gray-400">Contact the technical team for automation issues or feature requests.</p>
       </div>

       <GlassCard className="border-brand-500/30 bg-gradient-to-br from-brand-900/10 to-transparent">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="w-24 h-24 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Code size={40} />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Guaq AI Development</h3>
                <p className="text-gray-300 mb-6">
                   Built by the Guaq AI Team. We specialize in luxury real estate automation, 
                   LLM-driven gatekeepers, and high-performance dashboards.
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <a href="mailto:pulkit.talks@gmail.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-white">
                      <Mail size={18} /> pulkit.talks@gmail.com
                   </a>
                   <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-colors text-white shadow-lg">
                      <MessageCircle size={18} /> Contact Developer
                   </button>
                </div>
             </div>
          </div>
       </GlassCard>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
             <h4 className="font-medium text-white mb-4">Documentation</h4>
             <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2 hover:text-brand-400 cursor-pointer"><Globe size={14}/> Managing Property Inventory</li>
                <li className="flex items-center gap-2 hover:text-brand-400 cursor-pointer"><Globe size={14}/> Understanding Confidence Scores</li>
                <li className="flex items-center gap-2 hover:text-brand-400 cursor-pointer"><Globe size={14}/> Telegram Bot Configuration</li>
             </ul>
          </GlassCard>
          
          <GlassCard>
             <h4 className="font-medium text-white mb-4">System Status</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Gemini API</span>
                   <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Telegram Webhook</span>
                   <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Database Sync</span>
                   <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
                </div>
             </div>
          </GlassCard>
       </div>
    </div>
  );
};