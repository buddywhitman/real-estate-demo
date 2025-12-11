/*
  ===========================================================================================
  AUTHENTICATION GATE
  ===========================================================================================
  
  FUNCTIONALITY:
  - Handles initial user entry via Email/Phone/SSO.
  - Includes a "Pricing/Landing" scroll-snap section below the login form.
  
  MIGRATION:
  - Integrate with NextAuth.js (Auth.js) or Clerk.
  - `handleAuthFlow` should call `signIn()` from NextAuth.
  - Use server-side session checks in `layout.tsx` to redirect if not authenticated.
*/

import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, ArrowRight, Building2, Phone, Mail, Chrome, Rocket, ExternalLink, ChevronDown, ChevronUp, Key, CheckCircle2 } from 'lucide-react';
import { BrandingConfig } from '../types';
import Footer from './Footer';

interface LoginProps {
  onLogin: (role: 'admin' | 'agent') => void;
  branding: BrandingConfig;
}

const Login: React.FC<LoginProps> = ({ onLogin, branding }) => {
  const [activeMethod, setActiveMethod] = useState<'email' | 'phone'>('email');
  const [orgId, setOrgId] = useState('guaq-realty');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // View State for Scroll Snap
  const [showPricing, setShowPricing] = useState(false);
  
  // Touch Handling State
  const touchStartY = useRef<number>(0);
  const startScrollTop = useRef<number>(0); // Track scroll position at start of touch
  const pricingScrollRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (showPricing) {
            // Pricing View: Scroll Up at top -> Go to Login
            if (pricingScrollRef.current && pricingScrollRef.current.scrollTop === 0) {
                if (e.deltaY < -30) {
                    setShowPricing(false);
                }
            }
        } else {
            // Login View: Scroll Down -> Go to Pricing
            // We use a threshold to prevent accidental triggers from tiny movements
            if (e.deltaY > 30) {
                setShowPricing(true);
            }
        }
    };

    const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
        // Record where the scroll was when the user started touching
        if (pricingScrollRef.current) {
            startScrollTop.current = pricingScrollRef.current.scrollTop;
        } else {
            startScrollTop.current = 0;
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const distance = touchStartY.current - touchEndY; // Positive = Swipe Up (Scroll Down), Negative = Swipe Down (Scroll Up)

        if (showPricing) {
            // Swipe Down to go back to Login
            // Only if we started at the top AND are currently at the top
            if (distance < -30) {
                 if (startScrollTop.current <= 5 && (pricingScrollRef.current?.scrollTop || 0) <= 5) {
                     setShowPricing(false);
                 }
            }
        } else {
            // Swipe Up to go to Pricing
            if (distance > minSwipeDistance) {
                setShowPricing(true);
            }
        }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showPricing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthFlow('agent');
  };

  const handleAuthFlow = (role: 'admin' | 'agent') => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(role);
      }, 800);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#050505] overflow-hidden relative font-sans text-white">
        
        {/* Background Layer (Static) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop')] bg-cover bg-center opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/50 to-[#050505] pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none"></div>

        {/* Scrolling Container */}
        <div 
            className="w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(${showPricing ? '-100%' : '0%'})` }}
        >
            {/* SECTION 1: LOGIN HERO */}
            {/* 
                Structure:
                - h-[100dvh]: Takes full viewport height.
                - flex flex-col: Stacks Form (flex-1) and Pricing Button (shrink-0).
            */}
            <div className="h-[100dvh] w-full flex flex-col relative overflow-y-auto custom-scrollbar">
                
                {/* 
                    Card Container:
                    - flex-1: Takes up all available space.
                    - min-h: Ensures it doesn't collapse too small.
                */}
                <div className="flex-1 flex items-center justify-center p-4 min-h-[600px]">
                    <div className="relative z-10 w-full max-w-md">
                        <div className="backdrop-blur-xl bg-glass-100 p-8 rounded-3xl border border-white/10 shadow-2xl">
                        
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
                                {branding.logoUrl ? (
                                    <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <span className="text-white font-bold text-xl">{branding.appName.charAt(0)}</span>
                                )}
                                </div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">{branding.appName}</h1>
                                <p className="text-gray-400 text-sm mt-1">Luxury Real Estate Operations</p>
                            </div>

                            {/* Explore Demo Button */}
                            <button 
                                onClick={() => handleAuthFlow('admin')}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition transform hover:scale-[1.02] mb-5 border border-emerald-500/20"
                            >
                                <Rocket size={18} /> Explore Demo
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-[1px] bg-white/10 flex-1"></div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Or Sign In</span>
                                <div className="h-[1px] bg-white/10 flex-1"></div>
                            </div>

                            {/* Login Methods Tabs */}
                            <div className="flex p-1 bg-black/40 rounded-xl mb-5 border border-white/5">
                                <button 
                                onClick={() => setActiveMethod('email')}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition flex items-center justify-center gap-2 ${activeMethod === 'email' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                >
                                <Mail size={14} /> Email
                                </button>
                                <button 
                                onClick={() => setActiveMethod('phone')}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition flex items-center justify-center gap-2 ${activeMethod === 'phone' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                >
                                <Phone size={14} /> Phone
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Organization ID */}
                                <div className="relative group">
                                    <Building2 className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-400 transition" size={16} />
                                    <input 
                                    type="text" 
                                    value={orgId}
                                    onChange={(e) => setOrgId(e.target.value)}
                                    placeholder="Organization ID" 
                                    className="w-full bg-black/40 border border-glass-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none transition"
                                    />
                                </div>

                                {/* Credentials */}
                                {activeMethod === 'email' ? (
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-400 transition" size={16} />
                                        <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="agent@brokerage.com" 
                                        className="w-full bg-black/40 border border-glass-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none transition"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-400 transition" size={16} />
                                        <input 
                                        type="tel" 
                                        placeholder="+91 99999 00000" 
                                        className="w-full bg-black/40 border border-glass-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none transition"
                                        />
                                    </div>
                                )}

                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-400 transition" size={16} />
                                    <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full bg-black/40 border border-glass-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none transition"
                                    required={activeMethod === 'email'}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => alert("Contact admin to reset.")} className="text-[10px] text-brand-400 hover:text-brand-300 transition">Forgot Password?</button>
                                </div>

                                <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
                                >
                                {isLoading ? (
                                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                ) : (
                                    <>Login <ArrowRight size={18} /></>
                                )}
                                </button>
                            </form>

                            {/* Social / Divider */}
                            <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-200 transition">
                                    <Chrome size={16} /> Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] text-white border border-white/10 rounded-xl text-xs font-bold hover:bg-black transition">
                                    <Key size={16} /> SSO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Nudge to Pricing - Sitting at the bottom */}
                <div className="shrink-0 pb-8 flex justify-center animate-bounce">
                    <button 
                        onClick={() => setShowPricing(true)}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition group cursor-pointer"
                    >
                        <span className="text-[10px] font-medium uppercase tracking-widest opacity-70 group-hover:opacity-100">View Pricing</span>
                        <ChevronDown size={20} />
                    </button>
                </div>
            </div>

            {/* SECTION 2: PRICING - IMPROVED RESPONSIVENESS */}
            <div className="h-[100dvh] w-full bg-[#050505] relative z-10 flex flex-col">
                
                {/* Fixed Top Bar with Gradient for visibility */}
                <div className="absolute top-0 left-0 w-full z-30 pt-6 pb-12 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-transparent pointer-events-none"></div>
                
                {/* Back Button - Fixed Position */}
                <div className="absolute top-4 w-full flex justify-center z-40">
                    <button 
                        onClick={() => setShowPricing(false)}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition group cursor-pointer bg-[#050505]/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5"
                    >
                        <ChevronUp size={20} />
                        <span className="text-[10px] font-medium uppercase tracking-widest opacity-70 group-hover:opacity-100">Back to Login</span>
                    </button>
                </div>

                {/* Scrollable Content Container */}
                <div ref={pricingScrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative z-20">
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1 flex flex-col items-center px-6 pt-32 pb-16">
                            <div className="max-w-7xl mx-auto w-full">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
                                    <p className="text-gray-400 max-w-2xl mx-auto">Scalable solutions for independent agents and large brokerages.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
                                    {/* Basic Tier */}
                                    <div className="backdrop-blur-xl bg-glass-100 p-6 lg:p-8 rounded-3xl border border-white/5 hover:border-brand-500/30 transition flex flex-col hover:bg-white/5">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-white">Solo Agent</h3>
                                            <p className="text-sm text-gray-500 mt-1">For independent realtors</p>
                                        </div>
                                        <div className="mb-6">
                                            <span className="text-3xl font-bold text-white">$199</span>
                                            <span className="text-gray-500">/mo</span>
                                            <p className="text-xs text-gray-400 mt-1">or ₹15,000 INR /mo billed annually</p>
                                        </div>
                                        <div className="space-y-3 mb-8 flex-1">
                                            {['AI Lead Qualification', 'WhatsApp/Telegram Bot', 'Inventory Management', 'Basic CRM Sync'].map(f => (
                                                <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                                                    <CheckCircle2 size={16} className="text-brand-500 shrink-0"/> {f}
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => handleAuthFlow('agent')} className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition font-medium">Get Started</button>
                                    </div>

                                    {/* Pro Tier */}
                                    <div className="backdrop-blur-xl bg-brand-500/10 p-6 lg:p-8 rounded-3xl border border-brand-500/50 relative flex flex-col transform md:-translate-y-4 shadow-2xl shadow-brand-900/20">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider">Best Value</div>
                                        <div className="mb-4 mt-2">
                                            <h3 className="text-xl font-bold text-white">Brokerage Team</h3>
                                            <p className="text-sm text-brand-200 mt-1">For high-volume teams</p>
                                        </div>
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-white">$499</span>
                                            <span className="text-gray-400">/mo</span>
                                            <p className="text-xs text-brand-300 mt-1">or ₹40,000 INR /mo billed annually</p>
                                        </div>
                                        <div className="space-y-3 mb-8 flex-1">
                                            {['Everything in Solo', 'AI Video Studio (Veo)', 'Virtual Staging', 'Campaign Management', 'Advanced Analytics'].map(f => (
                                                <div key={f} className="flex items-center gap-3 text-sm text-white font-medium">
                                                    <CheckCircle2 size={16} className="text-brand-400 shrink-0"/> {f}
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => handleAuthFlow('admin')} className="w-full py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-500 transition font-bold shadow-lg">Start Free Trial</button>
                                    </div>

                                    {/* Ultimate Tier */}
                                    <div className="backdrop-blur-xl bg-glass-100 p-6 lg:p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition flex flex-col hover:bg-white/5">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-white">Enterprise</h3>
                                            <p className="text-sm text-gray-500 mt-1">For developers & franchises</p>
                                        </div>
                                        <div className="mb-6">
                                            <span className="text-3xl font-bold text-white">Contact Us</span>
                                            <p className="text-xs text-gray-400 mt-1">Custom volume pricing</p>
                                        </div>
                                        <div className="space-y-3 mb-8 flex-1">
                                            {['Everything in Team', 'Seller Intel Scraper', 'Compliance Audits', 'Dedicated Success Manager', 'Custom API Integrations'].map(f => (
                                                <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                                                    <CheckCircle2 size={16} className="text-purple-500 shrink-0"/> {f}
                                                </div>
                                            ))}
                                        </div>
                                        <a 
                                            href="https://guaq.framer.ai/contact-us" 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition font-medium flex items-center justify-center gap-2"
                                        >
                                            Contact Sales <ExternalLink size={16}/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer inside scrolling container so it's always reachable on mobile */}
                        <div className="mt-auto">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;