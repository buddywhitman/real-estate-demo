/*
  ===========================================================================================
  CRM & CAMPAIGNS VIEW
  ===========================================================================================
  
  FUNCTIONALITY:
  - Integration hub for external CRMs (Salesforce, HubSpot).
  - AI "Magic Draft" generation for email/WhatsApp campaigns.
  
  BACKEND INTEGRATION:
  - `Sync Now`: Trigger a background job (BullMQ/Inngest) -> `POST /api/crm/sync`.
  - `handleDraftMessage`: Calls Gemini via `geminiService` (Move to server-side).
  
  MAGIC DRAFT LOGIC:
  - The `settings` object is critical here. It injects the agent's signature into the prompt.
  - See `generatePersonalizedEmail` in `geminiService.ts` for the prompt structure.
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Database, Filter, Send, Users, Check, Zap, Mail, ChevronRight, Copy, MessageSquare } from 'lucide-react';
import { Lead, Property, AppSettings } from '../types';
import { findTopLeads, generatePersonalizedEmail } from '../services/geminiService';
import { MOCK_PROPERTIES } from '../constants';

interface CrmViewProps {
  leads: Lead[];
  settings?: AppSettings;
}

export const CrmView: React.FC<CrmViewProps> = ({ leads, settings }) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'campaigns'>('campaigns');
  const [isSyncing, setIsSyncing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{topIds: string[], reason: string} | null>(null);
  
  // Campaign State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [selectedPropIds, setSelectedPropIds] = useState<Set<string>>(new Set());
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [platform, setPlatform] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL');

  const handleAiAnalysis = async () => {
     setIsSyncing(true);
     const result = await findTopLeads(leads, "Identify high-net-worth individuals interested in immediate possession villas.");
     setAnalysisResult(result);
     setIsSyncing(false);
  };

  const toggleLead = (id: string) => {
      const newSet = new Set(selectedLeadIds);
      if(newSet.has(id)) newSet.delete(id); else newSet.add(id);
      setSelectedLeadIds(newSet);
  };

  const toggleProp = (id: string) => {
      const newSet = new Set(selectedPropIds);
      if(newSet.has(id)) newSet.delete(id); else newSet.add(id);
      setSelectedPropIds(newSet);
  };

  const handleDraftMessage = async () => {
    if (!settings) {
        alert("Settings not loaded.");
        return;
    }
    const targetLeads = leads.filter(l => selectedLeadIds.has(l.id));
    const targetProps = MOCK_PROPERTIES.filter(p => selectedPropIds.has(p.id));

    if (targetLeads.length > 0 && targetProps.length > 0) {
        setIsDrafting(true);
        const msg = await generatePersonalizedEmail(targetLeads, targetProps, platform, settings);
        setGeneratedMessage(msg);
        setIsDrafting(false);
    }
  };

  const handleSend = () => {
      if (platform === 'EMAIL') {
          // Construct Mailto
          const subject = "Exclusive Opportunity: " + MOCK_PROPERTIES.find(p => selectedPropIds.has(p.id))?.title;
          const body = encodeURIComponent(generatedMessage);
          window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      } else {
          // Construct WhatsApp
          const text = encodeURIComponent(generatedMessage);
          // Just open for first lead for demo
          const lead = leads.find(l => selectedLeadIds.has(l.id));
          if(lead) {
              window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
          } else {
              window.open(`https://wa.me/?text=${text}`, '_blank');
          }
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">CRM & Campaigns</h2>
            <div className="bg-glass-100 p-1 rounded-lg flex gap-1 border border-glass-border">
                <button onClick={() => setActiveTab('campaigns')} className={`px-4 py-2 rounded text-sm ${activeTab === 'campaigns' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}>Smart Campaigns</button>
                <button onClick={() => setActiveTab('sync')} className={`px-4 py-2 rounded text-sm ${activeTab === 'sync' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}>Data Sync</button>
            </div>
        </div>
        
        {activeTab === 'sync' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" className="h-8 opacity-80" />
                        <div>
                            <h3 className="text-white font-medium">Salesforce</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1"><Check size={10} /> Connected</p>
                        </div>
                    </div>
                    <button className="bg-white/10 px-3 py-1 rounded text-xs text-white">Sync Now</button>
                </GlassCard>
                
                <GlassCard className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/HubSpot_Logo.svg" className="h-8 opacity-80 bg-white/90 rounded px-1" />
                        <div>
                            <h3 className="text-white font-medium">HubSpot</h3>
                            <p className="text-xs text-gray-500">Not Connected</p>
                        </div>
                    </div>
                    <button className="bg-brand-600/20 text-brand-400 px-3 py-1 rounded text-xs">Connect</button>
                </GlassCard>
                </div>

                <GlassCard className="relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> AI Lead Segmentation</h3>
                        <p className="text-sm text-gray-400 mt-1">Use Gemini to scan CRM data and identify top 5% high-priority prospects.</p>
                    </div>
                    <button 
                        onClick={handleAiAnalysis}
                        disabled={isSyncing}
                        className="bg-gradient-to-r from-brand-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg disabled:opacity-50"
                    >
                        {isSyncing ? 'Analyzing...' : 'Find Top 5%'}
                    </button>
                </div>

                {analysisResult && (
                    <div className="bg-white/5 rounded-xl p-6 border border-glass-border animate-fade-in-up">
                        <h4 className="text-brand-400 font-medium mb-2">Analysis Result</h4>
                        <p className="text-sm text-gray-300 mb-4">{analysisResult.reason}</p>
                        
                        <div className="flex gap-4 mb-6">
                            <div className="bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{analysisResult.topIds.length}</div>
                            <div className="text-xs text-brand-400">High Priority</div>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-center opacity-50">
                            <div className="text-2xl font-bold text-white">{leads.length - analysisResult.topIds.length}</div>
                            <div className="text-xs text-gray-400">Standard Drip</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                            <Send size={16} /> Campaign to Top 5% (Warm)
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                            <Filter size={16} /> Schedule Drip for Rest
                            </button>
                        </div>
                    </div>
                )}
                </GlassCard>
            </>
        )}

        {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <GlassCard className="h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-medium">1. Select Targets</h3>
                            <span className="text-xs text-brand-400">{selectedLeadIds.size} selected</span>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {leads.map(lead => (
                                <div 
                                    key={lead.id} 
                                    onClick={() => toggleLead(lead.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedLeadIds.has(lead.id) ? 'bg-brand-500/20 border-brand-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-white">{lead.name}</span>
                                        {selectedLeadIds.has(lead.id) && <Check size={14} className="text-brand-400"/>}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-1">{lead.budget} • {lead.status}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                    <GlassCard className="h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-medium">2. Match Properties</h3>
                            <span className="text-xs text-purple-400">{selectedPropIds.size} selected</span>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {MOCK_PROPERTIES.map(prop => (
                                <div 
                                    key={prop.id} 
                                    onClick={() => toggleProp(prop.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedPropIds.has(prop.id) ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-white">{prop.title}</span>
                                        {selectedPropIds.has(prop.id) && <Check size={14} className="text-purple-400"/>}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-1">{prop.location}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div className="lg:col-span-2">
                    <GlassCard className="h-full flex flex-col">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
                                <h3 className="text-white font-medium flex items-center gap-2"><Mail size={18} className="text-brand-400"/> AI Draft Studio</h3>
                                <div className="bg-glass-100 rounded-lg p-0.5 flex w-full sm:w-auto">
                                    <button 
                                        onClick={() => setPlatform('EMAIL')} 
                                        className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs transition-colors ${platform === 'EMAIL' ? 'bg-white/20 text-white' : 'text-gray-400'}`}
                                    >Email</button>
                                    <button 
                                        onClick={() => setPlatform('WHATSAPP')} 
                                        className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs transition-colors ${platform === 'WHATSAPP' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}
                                    >WhatsApp</button>
                                </div>
                           </div>
                           
                           <button 
                             onClick={handleDraftMessage}
                             disabled={selectedLeadIds.size === 0 || selectedPropIds.size === 0 || isDrafting}
                             className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
                           >
                              {isDrafting ? 'Drafting...' : 'Generate Magic Draft'}
                           </button>
                        </div>
                        
                        <div className="flex-1 bg-black/30 rounded-lg border border-glass-border p-4 font-mono text-sm text-gray-300 relative min-h-[200px]">
                            {generatedMessage ? (
                                <textarea 
                                    className="w-full h-full bg-transparent resize-none focus:outline-none"
                                    value={generatedMessage}
                                    onChange={(e) => setGeneratedMessage(e.target.value)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                                    <Zap size={32} className="mb-2" />
                                    <p className="text-center">Select Targets and Properties to generate a personalized {platform.toLowerCase()} draft.</p>
                                </div>
                            )}
                        </div>

                        {generatedMessage && (
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-gray-300 text-sm">
                                    <Copy size={16} /> Copy
                                </button>
                                <button 
                                    onClick={handleSend}
                                    className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-600 rounded hover:bg-brand-500 text-white text-sm shadow-lg"
                                >
                                    <Send size={16} /> Send Now
                                </button>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        )}
    </div>
  );
};