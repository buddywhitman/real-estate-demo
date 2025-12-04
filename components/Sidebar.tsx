import React from 'react';
import { LayoutDashboard, Users, Building2, Settings, HelpCircle, LogOut, Bot, X } from 'lucide-react';
import { NavItem, AppSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, settings, isOpen, onClose }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Pipeline', icon: Users },
    { id: 'properties', label: 'Inventory', icon: Building2 },
    { id: 'simulator', label: 'Bot Simulator', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    onClose(); // Close sidebar on mobile after selection
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

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-neutral-950 border-r border-glass-border flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20">
               {settings.appName.charAt(0)}
             </div>
             <span className="font-bold text-lg tracking-tight text-white truncate max-w-[140px]">{settings.appName}</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-glass-border space-y-2">
          <button 
            onClick={() => handleNavClick('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'support' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <HelpCircle size={20} />
            <span className="font-medium text-sm">Support</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
