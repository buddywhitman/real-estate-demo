/*
  ===========================================================================================
  DATA INTELLIGENCE & INSIGHTS
  ===========================================================================================
  
  FUNCTIONALITY:
  - Aggregated stats (Leads, Response Time, Pipeline Value).
  - Visualization of Lead/Visit ratios.
  - AI Strategic Recommendations.
  
  BACKEND QUERY PERFORMANCE:
  - These charts require heavy aggregation.
  - PRE-COMPUTATION: Use a materialized view or nightly job to calculate `daily_stats`.
  - API: `GET /api/analytics/dashboard`.
*/

import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { PieChart, BarChart, TrendingUp, Lightbulb, Users, DollarSign, Activity, Target, ChevronDown } from 'lucide-react';
import { ChartData } from '../types';

interface InsightsViewProps {
  data: ChartData[]; // Kept for interface compatibility, but we use internal mocks for the toggle demo
}

// MOCK DATASETS FOR DEMO
const DATA_7_DAYS: ChartData[] = [
  { label: 'Mon', leads: 4, visits: 1 },
  { label: 'Tue', leads: 7, visits: 2 },
  { label: 'Wed', leads: 3, visits: 0 },
  { label: 'Thu', leads: 8, visits: 3 },
  { label: 'Fri', leads: 12, visits: 4 },
  { label: 'Sat', leads: 15, visits: 8 },
  { label: 'Sun', leads: 10, visits: 6 },
];

const DATA_30_DAYS: ChartData[] = [
  { label: 'Wk 1', leads: 28, visits: 8 },
  { label: 'Wk 2', leads: 35, visits: 12 },
  { label: 'Wk 3', leads: 42, visits: 15 },
  { label: 'Wk 4', leads: 38, visits: 10 },
];

const DATA_YEAR: ChartData[] = [
  { label: 'Jan', leads: 120, visits: 45 },
  { label: 'Feb', leads: 135, visits: 52 },
  { label: 'Mar', leads: 160, visits: 68 },
  { label: 'Apr', leads: 145, visits: 55 },
  { label: 'May', leads: 180, visits: 75 },
  { label: 'Jun', leads: 210, visits: 90 },
  { label: 'Jul', leads: 195, visits: 82 },
  { label: 'Aug', leads: 220, visits: 95 },
  { label: 'Sep', leads: 240, visits: 110 },
  { label: 'Oct', leads: 255, visits: 115 },
  { label: 'Nov', leads: 230, visits: 105 },
  { label: 'Dec', leads: 180, visits: 70 },
];

const STATS_CONFIG = {
    '7 Days': { conversion: '14.2%', avgResponse: '2m 4s', pipeline: '₹ 42 Cr', buyers: 128, trend: '+2.4%' },
    '30 Days': { conversion: '12.8%', avgResponse: '2m 10s', pipeline: '₹ 156 Cr', buyers: 450, trend: '+5.1%' },
    'Year': { conversion: '11.5%', avgResponse: '2m 15s', pipeline: '₹ 1,240 Cr', buyers: 3200, trend: '+12.4%' },
};

export const InsightsView: React.FC<InsightsViewProps> = ({ data: initialData }) => {
  const [timeRange, setTimeRange] = useState<'7 Days' | '30 Days' | 'Year'>('7 Days');
  const [chartData, setChartData] = useState<ChartData[]>(DATA_7_DAYS);
  const [stats, setStats] = useState(STATS_CONFIG['7 Days']);

  const handleRangeChange = (range: '7 Days' | '30 Days' | 'Year') => {
      setTimeRange(range);
      setStats(STATS_CONFIG[range]);
      
      switch(range) {
          case '7 Days': setChartData(DATA_7_DAYS); break;
          case '30 Days': setChartData(DATA_30_DAYS); break;
          case 'Year': setChartData(DATA_YEAR); break;
      }
  };

  // Calculate max values for chart scaling
  const maxLeads = Math.max(...chartData.map(d => d.leads));
  const maxVisits = Math.max(...chartData.map(d => d.visits)); // Used for relative scaling if needed, but we usually scale to leads for uniform height
  const scale = maxLeads > 0 ? maxLeads : 1;

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-semibold text-white">Data Intelligence</h2>
         <div className="flex gap-4 items-center">
             <div className="relative group">
                 <button className="flex items-center gap-2 bg-white/5 border border-glass-border px-3 py-1.5 rounded-lg text-xs text-white hover:bg-white/10 min-w-[100px] justify-between">
                     {timeRange === 'Year' ? 'This Year' : `Last ${timeRange}`} <ChevronDown size={12}/>
                 </button>
                 <div className="absolute right-0 top-full mt-2 w-32 bg-[#151515] border border-glass-border rounded-lg shadow-xl hidden group-hover:block z-20">
                     <button onClick={() => handleRangeChange('7 Days')} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10">Last 7 Days</button>
                     <button onClick={() => handleRangeChange('30 Days')} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10">Last 30 Days</button>
                     <button onClick={() => handleRangeChange('Year')} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10">This Year</button>
                 </div>
             </div>
             <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">Updated: Just Now</span>
         </div>
       </div>

       {/* KPI Row */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <GlassCard className="flex flex-col justify-between" noPadding>
               <div className="p-4">
                   <p className="text-xs text-gray-400 uppercase font-semibold">Conversion Rate</p>
                   <h3 className="text-2xl font-bold text-white mt-1">{stats.conversion}</h3>
                   <span className="text-xs text-green-400 flex items-center mt-2"><TrendingUp size={10} className="mr-1"/> {stats.trend} vs prev</span>
               </div>
               <div className="h-1 bg-green-500/20 w-full"><div className="h-full bg-green-500 w-[75%]"></div></div>
           </GlassCard>
           <GlassCard className="flex flex-col justify-between" noPadding>
               <div className="p-4">
                   <p className="text-xs text-gray-400 uppercase font-semibold">Avg. Response Time</p>
                   <h3 className="text-2xl font-bold text-white mt-1">{stats.avgResponse}</h3>
                   <span className="text-xs text-green-400 flex items-center mt-2"><TrendingUp size={10} className="mr-1"/> AI Gatekeeper Active</span>
               </div>
               <div className="h-1 bg-brand-500/20 w-full"><div className="h-full bg-brand-500 w-[90%]"></div></div>
           </GlassCard>
           <GlassCard className="flex flex-col justify-between" noPadding>
               <div className="p-4">
                   <p className="text-xs text-gray-400 uppercase font-semibold">Pipeline Value</p>
                   <h3 className="text-2xl font-bold text-white mt-1">{stats.pipeline}</h3>
                   <span className="text-xs text-gray-500 mt-2">Weighted forecast</span>
               </div>
               <div className="h-1 bg-purple-500/20 w-full"><div className="h-full bg-purple-500 w-[60%]"></div></div>
           </GlassCard>
           <GlassCard className="flex flex-col justify-between" noPadding>
               <div className="p-4">
                   <p className="text-xs text-gray-400 uppercase font-semibold">Active Buyers</p>
                   <h3 className="text-2xl font-bold text-white mt-1">{stats.buyers}</h3>
                   <span className="text-xs text-red-400 flex items-center mt-2"><Users size={10} className="mr-1"/> {Math.round(stats.buyers * 0.1)} Hot Leads</span>
               </div>
               <div className="h-1 bg-red-500/20 w-full"><div className="h-full bg-red-500 w-[45%]"></div></div>
           </GlassCard>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
             <h3 className="font-medium text-white mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-green-400"/> Lead Volume vs Site Visits</h3>
             <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-glass-border">
                {chartData.map((d, i) => (
                   <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 h-full group">
                      <div className="w-full flex gap-1 items-end justify-center h-full">
                          {/* Scale height based on max value in dataset */}
                          <div 
                              className="w-1/2 bg-brand-500/20 hover:bg-brand-500/40 transition-all duration-500 rounded-t-sm relative" 
                              style={{height: `${Math.max((d.leads / scale) * 100, 5)}%`}}
                          >
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{d.leads}</div>
                          </div>
                          <div 
                              className="w-1/2 bg-purple-500/20 hover:bg-purple-500/40 transition-all duration-500 rounded-t-sm relative" 
                              style={{height: `${Math.max((d.visits / scale) * 100, 5)}%`}}
                          >
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{d.visits}</div>
                          </div>
                      </div>
                      {/* X-Axis Label */}
                      <span className="text-[10px] text-gray-500 -mb-6 truncate w-full text-center">{d.label}</span>
                   </div>
                ))}
             </div>
             <div className="flex justify-center gap-4 mt-8 text-xs">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-500/20 rounded"></div> Leads</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500/20 rounded"></div> Visits</div>
             </div>
          </GlassCard>

          <GlassCard>
             <h3 className="font-medium text-white mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-yellow-400"/> Strategic Recommendations</h3>
             <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded border border-glass-border hover:border-brand-500/50 transition-colors cursor-pointer">
                   <div className="flex justify-between">
                       <p className="text-sm font-medium text-white">Focus on Koramangala Inventory</p>
                       <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Urgent</span>
                   </div>
                   <p className="text-xs text-gray-400 mt-1">Search volume for 3BHKs in Koramangala is up 40%, but you only have 2 listings.</p>
                </div>
                <div className="p-3 bg-white/5 rounded border border-glass-border hover:border-brand-500/50 transition-colors cursor-pointer">
                   <div className="flex justify-between">
                       <p className="text-sm font-medium text-white">Re-engage Cold Leads</p>
                       <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">Opportunity</span>
                   </div>
                   <p className="text-xs text-gray-400 mt-1">24 leads from last month haven't been contacted in 14 days. Click to launch automated WhatsApp campaign.</p>
                </div>
                <div className="p-3 bg-white/5 rounded border border-glass-border hover:border-brand-500/50 transition-colors cursor-pointer">
                   <div className="flex justify-between">
                       <p className="text-sm font-medium text-white">Pricing Adjustment</p>
                       <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Tip</span>
                   </div>
                   <p className="text-xs text-gray-400 mt-1">Properties priced under 2Cr are closing 2x faster. Consider highlighting "Prestige Pinewood".</p>
                </div>
             </div>
          </GlassCard>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <GlassCard>
               <h3 className="text-sm font-semibold text-white mb-4">Lead Source</h3>
               <div className="flex items-center justify-center relative h-48">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-bold text-white">Total</span>
                        <span className="text-xs text-gray-500">Sources</span>
                    </div>
                    {/* Visual Mock Pie Chart */}
                    <div className="w-32 h-32 rounded-full border-[12px] border-brand-500 border-r-purple-500 border-b-green-500 border-l-yellow-500 rotate-45"></div>
               </div>
               <div className="flex justify-between text-xs text-gray-400 px-4">
                   <span>WhatsApp (45%)</span>
                   <span>Telegram (25%)</span>
                   <span>Web (30%)</span>
               </div>
           </GlassCard>
           
           <GlassCard className="md:col-span-2">
               <h3 className="text-sm font-semibold text-white mb-4">Agent Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                        <thead className="text-gray-500 border-b border-glass-border">
                            <tr>
                                <th className="p-2">Agent</th>
                                <th className="p-2">Leads Handled</th>
                                <th className="p-2">Avg Resp Time</th>
                                <th className="p-2">Closures</th>
                                <th className="p-2 text-right">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-glass-border/50">
                                <td className="p-2 text-white">AI Bot</td>
                                <td className="p-2">842</td>
                                <td className="p-2 text-green-400">0.2s</td>
                                <td className="p-2">-</td>
                                <td className="p-2 text-right">4.9 ★</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-white">Broker (You)</td>
                                <td className="p-2">45</td>
                                <td className="p-2 text-yellow-400">45m</td>
                                <td className="p-2">8</td>
                                <td className="p-2 text-right">4.8 ★</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
           </GlassCard>
       </div>
    </div>
  );
};