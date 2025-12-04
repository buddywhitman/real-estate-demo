import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LeadsView } from './components/LeadsView';
import { InventoryView } from './components/InventoryView';
import { SettingsView } from './components/SettingsView';
import { BotSimulator } from './components/BotSimulator';
import { SupportView } from './components/SupportView';
import { GlassCard } from './components/GlassCard';
import { MOCK_LEADS, MOCK_PROPERTIES, MOCK_CHART_DATA } from './constants';
import { Property, Lead, AppSettings, ActivityLog, LeadStatus, ChartData } from './types';
import { Bell, Activity, TrendingUp, Users, CheckCircle, AlertTriangle, Clock, Power, Menu } from 'lucide-react';
import { GatekeeperResponse } from './services/geminiService';

// Main Dashboard Overview Component
const DashboardOverview = ({ 
  leadsCount, 
  propertiesCount,
  logs,
  chartData,
  isAiActive,
  onToggleAi
}: { 
  leadsCount: number, 
  propertiesCount: number,
  logs: ActivityLog[],
  chartData: ChartData[],
  isAiActive: boolean,
  onToggleAi: () => void
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GlassCard className="flex items-center justify-between">
        <div>
           <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Total Leads</p>
           <h3 className="text-3xl font-bold text-white mt-1">{leadsCount}</h3>
           <p className="text-green-400 text-xs mt-1 flex items-center">
             <TrendingUp size={12} className="mr-1" /> +12% this week
           </p>
        </div>
        <div className="bg-brand-500/20 p-3 rounded-full text-brand-400">
           <Users size={24} />
        </div>
      </GlassCard>
      
      <GlassCard className="flex items-center justify-between">
        <div>
           <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Site Visits</p>
           <h3 className="text-3xl font-bold text-white mt-1">8</h3>
           <p className="text-gray-500 text-xs mt-1">Upcoming in 7 days</p>
        </div>
        <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
           <Activity size={24} />
        </div>
      </GlassCard>

      <GlassCard className="flex items-center justify-between">
        <div>
           <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Active Inventory</p>
           <h3 className="text-3xl font-bold text-white mt-1">{propertiesCount}</h3>
           <p className="text-yellow-400 text-xs mt-1">2 Under Offer</p>
        </div>
        <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-400">
           <Bell size={24} />
        </div>
      </GlassCard>

       <GlassCard className={`relative overflow-hidden transition-all duration-300 ${isAiActive ? 'bg-gradient-to-br from-brand-600/20 to-purple-600/20 border-brand-500/30' : 'bg-gray-800/20 border-gray-700'}`}>
        <div className="flex justify-between items-start">
           <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${isAiActive ? 'text-brand-200' : 'text-gray-400'}`}>AI Gatekeeper</p>
              <h3 className="text-xl font-bold text-white mt-1">{isAiActive ? 'Active' : 'Paused'}</h3>
              <p className="text-xs mt-1 opacity-70 text-white">{isAiActive ? 'Processing incoming chats...' : 'Auto-replies disabled.'}</p>
           </div>
           <button 
             onClick={onToggleAi}
             className={`p-2 rounded-full transition-colors ${isAiActive ? 'bg-brand-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
             title={isAiActive ? "Pause AI" : "Resume AI"}
           >
             <Power size={20} />
           </button>
        </div>
      </GlassCard>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[450px]">
       <GlassCard className="lg:col-span-2 relative overflow-hidden group flex flex-col h-[300px] lg:h-auto">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-medium text-white">Pipeline Activity (Last 7 Days)</h3>
             <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-500 rounded-sm"></div> Leads</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Site Visits</div>
             </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
             {chartData.map((data, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group/bar h-full">
                  <div className="w-full flex gap-1 h-full items-end justify-center">
                    {/* Leads Bar */}
                    <div 
                      className="w-1/2 bg-brand-500 rounded-t-sm opacity-60 group-hover/bar:opacity-100 transition-all relative"
                      style={{ height: `${(data.leads / 20) * 100}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                         {data.leads} Leads
                       </div>
                    </div>
                    {/* Visits Bar */}
                    <div 
                      className="w-1/2 bg-purple-500 rounded-t-sm opacity-60 group-hover/bar:opacity-100 transition-all relative"
                      style={{ height: `${(data.visits / 20) * 100}%` }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                         {data.visits} Visits
                       </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{data.label}</span>
               </div>
             ))}
          </div>
       </GlassCard>
       
       <GlassCard className="flex flex-col h-[300px] lg:h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
             <h3 className="text-lg font-medium text-white">Gatekeeper Logs</h3>
             {isAiActive && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Live</span>}
             {!isAiActive && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">Paused</span>}
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
             {logs.length === 0 && <p className="text-gray-500 text-xs italic p-2">No recent system activity.</p>}
             {logs.map(log => (
               <div key={log.id} className={`flex gap-3 items-start border-l-2 pl-3 py-1 ${
                 log.severity === 'success' ? 'border-green-500 bg-green-500/5' :
                 log.severity === 'warning' ? 'border-yellow-500 bg-yellow-500/5' :
                 log.severity === 'danger' ? 'border-red-500 bg-red-500/5' : 'border-blue-500 bg-blue-500/5'
               } rounded-r-lg transition-all`}>
                 <div>
                   <div className="flex justify-between w-full gap-4">
                     <p className="text-sm text-white font-medium">{log.message}</p>
                     <span className="text-[10px] text-gray-500 whitespace-nowrap">{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                   <p className="text-xs text-gray-400 mt-0.5">{log.subtext}</p>
                 </div>
               </div>
             ))}
          </div>
       </GlassCard>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Track the current active simulator lead ID to ensure persistent updates to the same row
  const [simulatorLeadId, setSimulatorLeadId] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', type: 'SYSTEM', message: 'System Initialized', subtext: 'Connecting to Telegram Gatekeeper...', timestamp: new Date(), severity: 'info' }
  ]);
  
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'Guaq AI',
    brokerName: 'Guaq Brokerage',
    autoReply: true,
    minConfidenceThreshold: 75,
    notificationEmail: 'broker@guaq.ai'
  });

  const addLog = (message: string, subtext: string, severity: ActivityLog['severity']) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      type: 'SYSTEM',
      message,
      subtext,
      timestamp: new Date(),
      severity
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
  };

  const handleToggleAi = () => {
    const newState = !isAiActive;
    setIsAiActive(newState);
    addLog('System Status Change', newState ? 'AI Gatekeeper Resumed' : 'AI Gatekeeper Paused', newState ? 'success' : 'warning');
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties([newProp, ...properties]);
    addLog('Property Added', newProp.title, 'success');
  };

  const handleUpdateProperty = (updatedProp: Property) => {
    setProperties(properties.map(p => p.id === updatedProp.id ? updatedProp : p));
    addLog('Property Updated', updatedProp.title, 'info');
  };

  const handleDeleteProperty = (id: string) => {
    const title = properties.find(p => p.id === id)?.title || 'Unknown';
    setProperties(properties.filter(p => p.id !== id));
    addLog('Property Deleted', title, 'warning');
  };

  const handleDeleteLeads = (ids: string[]) => {
    setLeads(leads.filter(l => !ids.includes(l.id)));
    addLog('Leads Deleted', `${ids.length} records removed`, 'danger');
  };

  const handleBotUpdate = (data: GatekeeperResponse) => {
    if (!isAiActive) return; 

    if (!data.action || data.action === 'NONE') return;

    // Handle CREATE_LEAD, UPDATE_LEAD, and STOP_AI by ensuring the lead exists and is updated
    if (data.action === 'CREATE_LEAD' || data.action === 'UPDATE_LEAD' || data.action === 'STOP_AI') {
      const extracted = data.extractedData || {};

      // Determine the name: use extracted name from AI, or fallback
      const currentName = extracted.name || 'New Lead';
      
      // Determine status override for STOP_AI
      let newStatus = extracted.status ? (extracted.status as LeadStatus) : LeadStatus.NEW;
      if (data.action === 'STOP_AI') {
          newStatus = LeadStatus.STOP_AI;
      }
      
      // Try to find an existing lead for this simulator session
      let existingLeadIndex = -1;
      
      if (simulatorLeadId) {
         existingLeadIndex = leads.findIndex(l => l.id === simulatorLeadId);
      }

      if (existingLeadIndex >= 0) {
         // Update Existing Lead
         const oldLead = leads[existingLeadIndex];
         const updatedLead: Lead = { 
            ...oldLead, 
            ...extracted,
            name: extracted.name || oldLead.name, // Update name if AI found it
            status: newStatus,
            interestedIn: [...new Set([...oldLead.interestedIn, ...(extracted.interestedIn || [])])],
            siteVisitTime: extracted.siteVisitTime || oldLead.siteVisitTime,
            lastActive: 'Just now'
         };
         
         const newLeads = [...leads];
         newLeads[existingLeadIndex] = updatedLead;
         setLeads(newLeads);
         
         // Log special events
         if (updatedLead.status === LeadStatus.SITE_VISIT_SCHEDULED) {
            addLog('Site Visit Scheduled', `${updatedLead.name} @ ${updatedLead.siteVisitTime || 'TBD'}`, 'success');
         } else if (updatedLead.status === LeadStatus.STOP_AI) {
            addLog('Manual Intervention', `Bot stopped for ${updatedLead.name}`, 'danger');
         } else {
            addLog('Lead Updated', `${updatedLead.name} • Score: ${updatedLead.confidenceScore}`, 'info');
         }

      } else {
         // Create New Lead
         const newId = Math.random().toString();
         const newLead: Lead = {
           id: newId,
           name: currentName,
           platform: 'Telegram',
           phone: '+91 98765 00000',
           lastActive: 'Just now',
           chatHistory: [],
           conversationSummary: 'Generated via Simulator',
           interestedIn: [],
           budget: 'Unknown',
           status: newStatus,
           confidenceScore: 0,
           siteVisitTime: extracted.siteVisitTime,
           ...extracted
         } as Lead;
         
         setSimulatorLeadId(newId); // Bind this session to this new lead
         setLeads(prev => [newLead, ...prev]);
         
         if (newLead.status === LeadStatus.STOP_AI) {
            addLog('Manual Intervention', `Bot stopped for ${newLead.name}`, 'danger');
         } else {
            addLog('New Lead Captured', `${currentName} • Score: ${newLead.confidenceScore}`, 'info');
         }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-500/30">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        settings={settings} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="lg:pl-64 transition-all duration-300 w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-glass-border px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold capitalize truncate">
              {activeTab === 'dashboard' ? 'Overview' : 
               activeTab === 'simulator' ? 'Gatekeeper Simulator' : 
               activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <Bell size={20} />
                {logs.length > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-[#151515] border border-glass-border rounded-xl shadow-2xl overflow-hidden z-50">
                   <div className="p-3 border-b border-glass-border bg-white/5">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                      {logs.slice(0, 8).map(log => (
                        <div key={log.id} className="p-3 border-b border-glass-border hover:bg-white/5 cursor-pointer">
                           <div className="flex justify-between items-start mb-1">
                              <span className={`text-xs font-bold ${
                                log.severity === 'success' ? 'text-green-400' : 
                                log.severity === 'danger' ? 'text-red-400' : 'text-brand-400'
                              }`}>{log.message}</span>
                              <span className="text-[10px] text-gray-500">{log.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                           </div>
                           <p className="text-xs text-gray-300">{log.subtext}</p>
                        </div>
                      ))}
                   </div>
                   <div className="p-2 text-center border-t border-glass-border bg-white/5">
                      <button className="text-xs text-gray-400 hover:text-white">View Full Activity Log</button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
             <DashboardOverview 
                leadsCount={leads.length} 
                propertiesCount={properties.length} 
                logs={logs}
                chartData={MOCK_CHART_DATA}
                isAiActive={isAiActive}
                onToggleAi={handleToggleAi}
             />
          )}
          
          {activeTab === 'leads' && <LeadsView leads={leads} onDeleteLeads={handleDeleteLeads} />}
          
          {activeTab === 'properties' && (
            <InventoryView 
              properties={properties} 
              onAddProperty={handleAddProperty} 
              onUpdateProperty={handleUpdateProperty}
              onDeleteProperty={handleDeleteProperty}
            />
          )}
          
          {activeTab === 'simulator' && <BotSimulator inventory={properties} onLeadUpdate={handleBotUpdate} />}
          
          {activeTab === 'settings' && <SettingsView settings={settings} onUpdate={setSettings} />}
          
          {activeTab === 'support' && <SupportView />}
        </div>
      </main>
    </div>
  );
}