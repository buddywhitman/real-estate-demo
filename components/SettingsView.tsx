/*
  ===========================================================================================
  SETTINGS & CONFIGURATION
  ===========================================================================================
  
  FUNCTIONALITY:
  - Manages application-wide settings (Theme, Branding).
  - Configures Agent Identity for Magic Drafts.
  - Controls Gatekeeper AI logic (auto-reply, thresholds).
  
  DATABASE PERSISTENCE:
  - Store as a JSONB column `settings` in the `User` table (Prisma).
  - API: `PUT /api/user/settings`
  
  VALIDATION:
  - Use Zod schemas on the backend to validate fields like `minConfidenceThreshold` (0-100) 
    and email formats before saving.
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Save, User, Bell, MessageSquare, Shield, Settings as SettingsIcon, Calendar, Palette, PenTool, Database, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setIsDirty(true);
    onUpdate({ ...settings, [key]: value });
  };

  const handleSave = () => {
      // Simulate save delay or just clear dirty state
      setIsDirty(false);
      // Logic for actual persistence would go here if not handled by parent immediately
  };

  const colors = [
      { name: 'Blue', value: 'blue', hex: 'bg-blue-500' },
      { name: 'Purple', value: 'purple', hex: 'bg-purple-500' },
      { name: 'Green', value: 'green', hex: 'bg-green-500' },
      { name: 'Orange', value: 'orange', hex: 'bg-orange-500' },
      { name: 'Pink', value: 'pink', hex: 'bg-pink-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10 relative">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">System Configuration</h2>
          {isDirty && (
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg border border-yellow-500/20 animate-pulse">
                  <AlertCircle size={16} />
                  <span className="text-xs font-semibold">Unsaved changes</span>
              </div>
          )}
       </div>
       
       {isDirty && (
           <div className="sticky top-20 z-40 bg-brand-900/90 backdrop-blur-md border border-brand-500/30 p-4 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in-up">
               <div className="flex items-center gap-3">
                   <div className="bg-brand-500 rounded-full p-1">
                       <AlertCircle size={16} className="text-white" />
                   </div>
                   <p className="text-sm text-white font-medium">You have unsaved changes. Don't forget to save!</p>
               </div>
               <button 
                 onClick={handleSave} 
                 className="bg-white text-brand-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
               >
                   Save Now
               </button>
           </div>
       )}
       
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
            <div>
                 <label className="block text-xs text-gray-400 mb-1">Accent Color</label>
                 <div className="flex gap-3 mt-2">
                     {colors.map(c => (
                         <button 
                            key={c.value}
                            onClick={() => handleChange('accentColor', c.value)}
                            className={`w-8 h-8 rounded-full ${c.hex} transition-all ${settings.accentColor === c.value ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                            title={c.name}
                         />
                     ))}
                 </div>
            </div>
          </div>
       </GlassCard>

       {/* Magic Draft Identity */}
       <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-brand-500/20 p-3 rounded-full text-brand-400">
              <PenTool size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Magic Draft Identity</h3>
              <p className="text-sm text-gray-400">Used by AI to auto-sign campaigns and seller pitches.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs text-gray-400 mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={settings.agentName}
                  onChange={(e) => handleChange('agentName', e.target.value)}
                  placeholder="e.g. John Realtor"
                  className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
                />
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Brokerage Name</label>
                <input 
                  type="text" 
                  value={settings.brokerageName}
                  onChange={(e) => handleChange('brokerageName', e.target.value)}
                  placeholder="e.g. Luxury Estates"
                  className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
                />
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={settings.agentPhone}
                  onChange={(e) => handleChange('agentPhone', e.target.value)}
                  placeholder="+91 99..."
                  className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
                />
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                <input 
                  type="text" 
                  value={settings.agentEmail}
                  onChange={(e) => handleChange('agentEmail', e.target.value)}
                  placeholder="john@luxury.com"
                  className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
                />
             </div>
             <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Website (Optional)</label>
                <input 
                  type="text" 
                  value={settings.agentWebsite}
                  onChange={(e) => handleChange('agentWebsite', e.target.value)}
                  placeholder="www.johnrealtor.com"
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
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-glass-border">
              <div>
                <p className="text-white font-medium flex items-center gap-2"><Calendar size={16}/> Automated Viewings Booking</p>
                <p className="text-xs text-gray-400 mt-1">Allow AI to access calendar and confirm site visits within work hours.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.enableAiBooking} onChange={(e) => handleChange('enableAiBooking', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

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

       {/* Data Management */}
       <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-3 rounded-full text-white">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Data Management</h3>
              <p className="text-sm text-gray-400">Export your data or clear system cache.</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm border border-glass-border transition-colors">
                <Download size={16} /> Export Leads (CSV)
             </button>
             <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm border border-glass-border transition-colors">
                <RefreshCw size={16} /> Clear Cache
             </button>
          </div>
       </GlassCard>
       
       <div className="flex justify-end">
         <button 
            onClick={handleSave}
            className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl transition-all shadow-lg ${isDirty ? 'bg-brand-600 hover:bg-brand-500 ring-2 ring-white/20' : 'bg-gray-700 hover:bg-gray-600'}`}
         >
           <Save size={18} /> {isDirty ? 'Save Changes' : 'Saved'}
         </button>
       </div>
    </div>
  );
};