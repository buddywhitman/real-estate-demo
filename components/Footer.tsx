/*
  ===========================================================================================
  GLOBAL FOOTER
  ===========================================================================================
  
  Used in Login page and Main App layout.
*/

import React from 'react';
import { Globe, Mail, Phone, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050505]/80 border-t border-white/5 py-4 mt-auto shrink-0 z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 bg-brand-600 rounded flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-brand-500/20">G</div>
           <span className="font-bold text-gray-300 tracking-tight">GuaqAI</span>
        </div>

        {/* Center: Copyright */}
        <div className="text-gray-600 uppercase tracking-widest text-[10px] text-center order-last md:order-none">
           &copy; {new Date().getFullYear()} GuaqAI Technologies Pvt Ltd.
        </div>

        {/* Right: Contact */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-gray-500 font-medium">
             <a href="tel:+919945117488" className="hover:text-white transition flex items-center gap-1.5"><Phone size={12}/> +91 99451 17488</a>
             <a href="mailto:guaqai@gmail.com" className="hover:text-white transition flex items-center gap-1.5"><Mail size={12}/> guaqai@gmail.com</a>
             <a href="https://guaq.framer.ai" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition flex items-center gap-1.5 text-brand-500/80"><Globe size={12}/> guaq.framer.ai</a>
             <div className="hidden md:block h-3 w-[1px] bg-white/10"></div>
             <div className="flex gap-3">
                <a href="https://twitter.com/guaq_ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><Twitter size={12}/></a>
                <a href="https://linkedin.com/company/guaq-ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition"><Linkedin size={12}/></a>
                <a href="https://instagram.com/guaq.ai" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition"><Instagram size={12}/></a>
             </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;