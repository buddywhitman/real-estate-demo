import React from 'react';
import { GlassCard } from './GlassCard';
import { Save, User, Bell, MessageSquare, Shield, Settings as SettingsIcon } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const handleChange = (key: keyof AppSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
       <h2 className="text-2xl font-semibold text-white mb-6">System Configuration</h2>
       
       {/* Branding */}
       <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-3 rounded-full text-white">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">App Branding</h3>
              <p className="text-sm text-gray-400">Customize the look and feel of the dashboard.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Application Name</label>
              <input 
                type="text" 
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
       </GlassCard>

       {/* Profile */}
       <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-brand-500/20 p-3 rounded-full text-brand-400">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Broker Profile</h3>
              <p className="text-sm text-gray-400">Details displayed to clients in automated messages.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Display Name</label>
              <input 
                type="text" 
                value={settings.brokerName}
                onChange={(e) => handleChange('brokerName', e.target.value)}
                className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Notification Email</label>
              <input 
                type="email" 
                value={settings.notificationEmail}
                onChange={(e) => handleChange('notificationEmail', e.target.value)}
                className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
       </GlassCard>

       {/* AI Config */}
       <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Gatekeeper Logic</h3>
              <p className="text-sm text-gray-400">Configure how the AI handles incoming leads.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Reply Mode</p>
                <p className="text-xs text-gray-400">Allow AI to instantly reply to new inquiries on Telegram/WhatsApp.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.autoReply} onChange={(e) => handleChange('autoReply', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>

            <div>
               <div className="flex justify-between mb-2">
                 <label className="text-sm text-gray-300">Minimum Confidence Score for Handoff</label>
                 <span className="text-sm text-brand-400 font-bold">{settings.minConfidenceThreshold}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={settings.minConfidenceThreshold}
                 onChange={(e) => handleChange('minConfidenceThreshold', parseInt(e.target.value))}
                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
               />
               <p className="text-xs text-gray-500 mt-2">Leads with a score below this will be handled automatically. Above this, the broker is notified.</p>
            </div>
          </div>
       </GlassCard>
       
       <div className="flex justify-end">
         <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg">
           <Save size={18} /> Save Changes
         </button>
       </div>
    </div>
  );
};