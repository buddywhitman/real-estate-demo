/*
  ===========================================================================================
  DASHBOARD OVERVIEW WIDGETS
  ===========================================================================================
*/

import React from 'react';
import { GlassCard } from './GlassCard';
import { ActivityLog, ChartData } from '../types';
import { TrendingUp, Users, Activity, Bell, Power } from 'lucide-react';

interface DashboardOverviewProps { 
  leadsCount: number; 
  propertiesCount: number;
  logs: ActivityLog[];
  chartData: ChartData[];
  isAiActive: boolean;
  onToggleAi: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  leadsCount, 
  propertiesCount,
  logs,
  chartData,
  isAiActive,
  onToggleAi
}) => (
  <div className="space-y-6 animate-fade-in">
    {/* KPI CARDS */}
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
              <p className="text-xs mt-1 opacity-70 text-white">{isAiActive ? 'Processing incoming chats via n8n...' : 'Auto-replies disabled.'}</p>
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
       {/* ACTIVITY CHART */}
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
                    <div 
                      className="w-1/2 bg-brand-500 rounded-t-sm opacity-60 group-hover/bar:opacity-100 transition-all relative"
                      style={{ height: `${(data.leads / 20) * 100}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                         {data.leads} Leads
                       </div>
                    </div>
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
       
       {/* RECENT LOGS WIDGET */}
       <GlassCard className="flex flex-col h-[300px] lg:h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
             <h3 className="text-lg font-medium text-white">Gatekeeper Logs</h3>
             {isAiActive && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Live</span>}
             {!isAiActive && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">Paused</span>}
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent">
             {logs.length === 0 && <p className="text-gray-500 text-xs italic p-2">No recent system activity.</p>}
             {logs.slice(0, 10).map(log => (
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