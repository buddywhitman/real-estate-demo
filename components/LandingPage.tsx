import React from 'react';
import { 
  Building2, 
  MessageSquare, 
  BarChart2, 
  Key, 
  Video, 
  ShieldCheck, 
  ArrowRight, 
  Home, 
  Globe 
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onViewDocs?: () => void;
  branding?: {
    appName: string;
    logoUrl?: string;
  };
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onViewDocs, branding }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Building2 className="text-white" size={24} />
                )}
              </div>
              <span className="font-bold text-xl text-white tracking-tight">{branding?.appName || 'GuaqAI Real Estate'}</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://guaqai.me" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">
                Platform
              </a>
              <a href="https://guaqai.me" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">
                Solutions
              </a>
              <button 
                onClick={onLoginClick}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all hover:border-white/20"
              >
                Log In
              </button>
              <a 
                href="https://guaqai.me"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Demo Environment
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            The Operating System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Modern Real Estate</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Automate 80% of lead qualification, generate listing content instantly, and manage your entire agency pipeline with Hybrid AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Enter Agency Dashboard <ArrowRight size={20} />
            </button>
            <button 
              onClick={onViewDocs}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supercharge Your Agency</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Replace your fragmented CRM, marketing tools, and spreadsheets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Key}
              title="Lead Gatekeeper"
              description="AI agents qualify leads via WhatsApp 24/7, booking viewings automatically."
              color="text-blue-400"
              bg="bg-blue-500/10"
            />
            <FeatureCard 
              icon={Home}
              title="Inventory Command"
              description="Centralized property database with AI-powered search and matching."
              color="text-purple-400"
              bg="bg-purple-500/10"
            />
            <FeatureCard 
              icon={Video}
              title="Media Studio"
              description="Generate listing descriptions and visual staging concepts instantly."
              color="text-pink-400"
              bg="bg-pink-500/10"
            />
            <FeatureCard 
              icon={BarChart2}
              title="Market Intel"
              description="Real-time price analysis and ROI projections for investors."
              color="text-emerald-400"
              bg="bg-emerald-500/10"
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Compliance Sentinel"
              description="Automated KYC checks and contract clause extraction."
              color="text-orange-400"
              bg="bg-orange-500/10"
            />
            <FeatureCard 
              icon={Globe}
              title="Seller Intel"
              description="Scrape listings and identify motivated sellers before competitors."
              color="text-cyan-400"
              bg="bg-cyan-500/10"
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10s" label="Response Time" />
            <StatCard number="80%" label="Leads Auto-Qualified" />
            <StatCard number="3x" label="Deal Velocity" />
            <StatCard number="24/7" label="Agent Availability" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to scale your brokerage?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join elite agencies using Guaq AI to dominate their market.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://guaqai.me"
              className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Get Started for Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Guaq AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color, bg }: any) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 group">
    <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ number, label }: any) => (
  <div className="p-6">
    <div className="text-4xl font-bold text-white mb-2">{number}</div>
    <div className="text-gray-500 uppercase tracking-wider text-sm font-medium">{label}</div>
  </div>
);

export default LandingPage;
