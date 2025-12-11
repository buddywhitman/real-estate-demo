/*
  ===========================================================================================
  HELP CENTER / KNOWLEDGE BASE
  ===========================================================================================
  
  FUNCTIONALITY:
  - Static markdown article rendering.
  - AI-powered "Ask Support" search.
  
  RAG IMPLEMENTATION NOTES:
  - To make the AI search robust in production:
    1. Chunk the markdown articles into smaller text segments.
    2. Generate embeddings for each chunk using `gemini-embedding-001`.
    3. Store in a Vector DB (Pinecone, Weaviate, or pgvector).
    4. When user asks a question, embed question -> query Vector DB -> pass context to Gemini Flash.
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { HelpCircle, Search, ChevronRight, MessageCircle, BarChart2, Layout, CheckCircle, X, Sparkles, ExternalLink, ArrowRight, Rocket } from 'lucide-react';
import { REAL_ESTATE_ARTICLES } from '../constants';
import { askSupportBot } from '../services/geminiService';

export const SupportView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleSearch = async (e?: React.KeyboardEvent) => {
      if (e && e.key !== 'Enter') return;
      if (!searchTerm.trim()) {
          setAiAnswer(null);
          return;
      }

      setIsAiSearching(true);
      setAiAnswer(null); // Clear previous
      
      try {
          // If query is very specific, check if article exists directly (simple match)
          const exactMatch = Object.keys(REAL_ESTATE_ARTICLES).find(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
          
          const answer = await askSupportBot(searchTerm);
          setAiAnswer(answer);
      } catch (err) {
          setAiAnswer("Support system currently unavailable.");
      } finally {
          setIsAiSearching(false);
      }
  };

  const guides = [
    {
      category: 'Getting Started',
      icon: Rocket,
      articles: [
        { title: 'Platform Overview & Navigation', readTime: '2 min' },
        { title: 'Setting up Agency Branding', readTime: '1 min' },
        { title: 'Understanding Lead Qualification', readTime: '3 min' },
      ]
    },
    {
      category: 'AI Agents',
      icon: MessageCircle,
      articles: [
        { title: 'Managing Inventory & AI Context', readTime: '5 min' },
        { title: 'Using Virtual Staging', readTime: '2 min' },
        { title: 'Magic Drafts & Campaigns', readTime: '2 min' },
      ]
    },
    {
      category: 'Growth Tools',
      icon: BarChart2,
      articles: [
        { title: 'Seller Intel & Acquisition', readTime: '3 min' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-24 min-w-0 relative animate-fade-in">
          
          <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center p-3 bg-brand-600/20 rounded-2xl mb-4 text-brand-400">
                <HelpCircle size={32} />
             </div>
             <h1 className="text-3xl font-bold text-white mb-3">How can we help you?</h1>
             <p className="text-gray-400 mb-6">Search our knowledge base or browse guides below.</p>
             
             <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-3.5 text-gray-500" size={20}/>
                <input 
                  type="text" 
                  placeholder="Ask AI (e.g., 'How do I add a new listing?')"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full bg-[#0a0a0a] border border-glass-border rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition shadow-lg"
                />
                <button 
                    onClick={() => handleSearch()}
                    disabled={isAiSearching}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-white transition"
                >
                    {isAiSearching ? <Sparkles size={18} className="animate-spin text-purple-400"/> : <ArrowRight size={18}/>}
                </button>
             </div>

             {/* AI Answer Card */}
             {aiAnswer && (
                 <div className="mt-6 max-w-lg mx-auto text-left animate-fade-in-up">
                     <GlassCard className="border-purple-500/30 bg-purple-900/10">
                         <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-3">
                             <Sparkles size={16}/> AI Answer
                         </h3>
                         <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                             {aiAnswer}
                         </div>
                     </GlassCard>
                 </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
             {guides.map((guide, idx) => (
               <GlassCard key={idx} className="hover:border-white/10 transition group cursor-default">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-white/5 rounded-lg text-gray-300 group-hover:bg-brand-600 group-hover:text-white transition">
                        <guide.icon size={20} />
                     </div>
                     <h3 className="font-semibold text-white">{guide.category}</h3>
                  </div>
                  <div className="space-y-3">
                     {guide.articles.map((article, i) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedArticle(article.title)}
                            className="flex items-center justify-between text-sm group/item cursor-pointer p-2 rounded hover:bg-white/5 transition"
                        >
                           <span className="text-gray-400 group-hover/item:text-brand-400 transition">{article.title}</span>
                           <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition">
                              <span className="text-[10px] text-gray-600">{article.readTime}</span>
                              <ChevronRight size={12} className="text-gray-500"/>
                           </div>
                        </div>
                     ))}
                  </div>
               </GlassCard>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* System Status */}
              <GlassCard>
                 <h4 className="font-medium text-white mb-4">System Status</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">Gemini API</span>
                       <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">WhatsApp Gateway</span>
                       <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">MLS Sync (BridgeAPI)</span>
                       <span className="text-yellow-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Slow</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">Email Server</span>
                       <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
                    </div>
                 </div>
              </GlassCard>

              {/* FAQ */}
              <GlassCard className="bg-[#0a0a0a]">
                  <h3 className="text-lg font-bold text-white mb-6">FAQ</h3>
                  <div className="space-y-4">
                     {[
                        { q: "How do I add a new property?", a: "Go to Inventory > Add Entity. Don't forget to click 'Auto-Generate' for the description." },
                        { q: "Is the video generation real-time?", a: "Veo takes about 1-2 minutes to render a full trailer." },
                        { q: "Can I export leads to Excel?", a: "Yes, go to Settings > Data Management > Export Leads." },
                     ].map((faq, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5 border border-glass-border">
                           <h4 className="font-semibold text-white mb-1 flex items-start gap-2 text-xs">
                              <span className="text-brand-500 mt-0.5"><CheckCircle size={12}/></span> {faq.q}
                           </h4>
                           <p className="text-xs text-gray-400 pl-5 leading-relaxed">{faq.a}</p>
                        </div>
                     ))}
                  </div>
              </GlassCard>
          </div>

          <div className="mt-12 text-center border-t border-glass-border pt-8">
             <p className="text-gray-400 text-sm mb-4">Still need support?</p>
             <div className="flex justify-center gap-4">
                <a 
                    href="https://guaq.framer.ai/contact-us"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                    Contact Support <ExternalLink size={14}/>
                </a>
                <a 
                    href="https://discord.gg/invite/nZQTDeqSmm" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                    Join Community <ExternalLink size={14}/>
                </a>
             </div>
          </div>

       {/* Article Reader Modal */}
       {selectedArticle && (
           <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedArticle(null)}>
               <GlassCard className="w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden relative" onClick={(e: any) => e.stopPropagation()}>
                   <div className="p-4 border-b border-glass-border flex justify-between items-center shrink-0">
                       <h3 className="font-bold text-white text-lg truncate pr-4">{selectedArticle}</h3>
                       <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
                           <X size={20}/>
                       </button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                       <div className="prose prose-invert prose-sm max-w-none">
                           <ArticleContent content={REAL_ESTATE_ARTICLES[selectedArticle] || "Content coming soon..."} />
                       </div>
                   </div>
               </GlassCard>
           </div>
       )}
    </div>
  );
};

// Simple Markdown-ish parser component
const ArticleContent = ({ content }: { content: string }) => {
    return (
        <div className="space-y-4 text-gray-300 leading-relaxed">
            {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mb-4 mt-2 pb-2 border-b border-white/10">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-brand-400 mb-3 mt-6">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-white mb-2 mt-4">{line.replace('### ', '')}</h3>;
                if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc marker:text-brand-500">{line.replace('* ', '')}</li>;
                if (line.startsWith('1. ')) return <div key={i} className="ml-4 flex gap-2"><span className="font-bold text-gray-500">{line.split('.')[0]}.</span> <span>{line.substring(3)}</span></div>;
                if (line.trim() === '') return <br key={i}/>;
                return <p key={i}>{line}</p>;
            })}
        </div>
    )
}