/*
  ===========================================================================================
  SIDEBAR NAVIGATION COMPONENT
  ===========================================================================================
  
  FUNCTIONALITY:
  - Handles main navigation logic via `activeTab` prop.
  - Displays user profile and subscription tier ('Admin' vs 'Agent').
  - Responsive: Collapses on mobile with a backdrop.
  
  SUBSCRIPTION TIER LOGIC:
  - Visualized by the crown/badge icon on the user avatar.
  - Text updates dynamically based on `userRole` prop passed from App.tsx.
  
  MIGRATION NOTE:
  - In Next.js App Router, this will likely reside in `app/layout.tsx`.
  - Authentication state (`userRole`, `onLogout`) should be handled by `useSession()` from NextAuth.
*/

import React from 'react';
import { LayoutDashboard, Users, Building2, Settings, HelpCircle, LogOut, Bot, X, Calendar, Database, Film, PieChart, FileCheck, Search, Image as ImageIcon, Crown, BadgeCheck } from 'lucide-react';
import { NavItem, AppSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userRole?: 'admin' | 'agent';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, settings, isOpen, onClose, onLogout, userRole = 'admin' }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Pipeline', icon: Users },
    { id: 'properties', label: 'Inventory', icon: Building2 },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'simulator', label: 'Bot Simulator', icon: Bot },
    { id: 'crm', label: 'CRM & Campaigns', icon: Database },
    { id: 'media', label: 'AI Media Studio', icon: ImageIcon },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'scraper', label: 'Seller Intel', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    onClose(); 
  };

  // Get initials from agent name
  const getInitials = (name: string) => {
      if (!name) return 'ME';
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-glass-border flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Brand Header */}
        <div className="p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20">
               {settings.appName.charAt(0)}
             </div>
             <span className="font-bold text-lg tracking-tight text-white truncate max-w-[140px]">{settings.appName}</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2">
            <button 
                onClick={() => handleNavClick('support')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors border border-white/5 bg-white/5 hover:bg-white/10 text-white mb-2`}
            >
                <HelpCircle size={18} className="text-brand-400" />
                <span className="font-medium text-sm">Help Center</span>
            </button>
        </div>

        {/* Main Nav Items */}
        <nav className="flex-1 px-4 space-y-1 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-glass-border bg-[#050505] shrink-0">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-medium border border-glass-border relative">
                {getInitials(settings.agentName)}
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                    {/* Tier Indicator Icon */}
                    {userRole === 'admin' ? <Crown size={12} className="text-yellow-400 fill-yellow-400"/> : <BadgeCheck size={12} className="text-blue-400 fill-blue-400"/>}
                </div>
             </div>
             <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{settings.agentName || 'Agent'}</h4>
                <p className="text-[10px] text-brand-300 font-medium flex items-center gap-1">
                    {/* Dynamic Subscription Text */}
                    {userRole === 'admin' ? 'Ultimate Plan' : 'Agent Seat'}
                </p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-400 text-xs px-2 py-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
          >
             <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};