import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Key, 
  Home, 
  Video, 
  BarChart2, 
  ShieldCheck, 
  Globe,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

interface DocsProps {
  onBack: () => void;
}

const Docs: React.FC<DocsProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const SECTIONS = [
    { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'gatekeeper', label: 'Lead Gatekeeper', icon: Key },
    { id: 'inventory', label: 'Inventory Command', icon: Home },
    { id: 'media', label: 'Media Studio', icon: Video },
    { id: 'market', label: 'Market Intel', icon: BarChart2 },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 h-16 bg-[#050505]/80 backdrop-blur border-b border-white/5 flex items-center px-6 gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-white">Documentation & User Guide</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#050505]/50 border-r border-white/5 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  activeSection === section.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <section.icon size={18} />
                {section.label}
                {activeSection === section.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto space-y-12 pb-24">
            
            {activeSection === 'overview' && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-bold text-white mb-6">Welcome to GuaqAI Real Estate</h2>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  The ultimate operating system for real estate agencies. Automate your pipeline, 
                  generate marketing assets instantly, and close deals faster.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Key className="text-blue-400" size={20} /> For Agents
                    </h3>
                    <p className="text-sm text-gray-400">
                      Manage leads in the <strong>CRM</strong>. 
                      Use <strong>Media Studio</strong> to create listing descriptions.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-400" size={20} /> For Brokers
                    </h3>
                    <p className="text-sm text-gray-400">
                      Monitor <strong>Market Intel</strong> for pricing trends. 
                      Ensure <strong>Compliance</strong> with automated checks.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'gatekeeper' && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-bold text-white mb-6">Lead Gatekeeper</h2>
                <div className="bg-[#151515] rounded-xl border border-white/10 overflow-hidden mb-8">
                  <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">Preview: WhatsApp Integration</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">L</div>
                      <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                        <p>I'm interested in the 3BHK in Downtown.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AI</div>
                      <div className="bg-blue-600/20 border border-blue-600/30 p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                        <p>Great choice! That unit has a stunning sea view. Are you looking to move in immediately or within a month?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400">
                  The Gatekeeper qualifies leads 24/7, booking viewings directly into your calendar 
                  only when they meet your criteria.
                </p>
              </section>
            )}

            {/* Add more sections as needed */}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
