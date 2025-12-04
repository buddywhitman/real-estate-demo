import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus } from '../types';
import { MessageSquare, Phone, Send, Search, Filter, AlertCircle, CheckCircle2, Clock, Trash2, Mail, ArrowUpDown, X, Sparkles, CalendarDays } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface LeadsViewProps {
  leads: Lead[];
  onDeleteLeads: (ids: string[]) => void;
}

type SortKey = 'name' | 'confidenceScore' | 'lastActive' | 'status';

export const LeadsView: React.FC<LeadsViewProps> = ({ leads, onDeleteLeads }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeSummary, setActiveSummary] = useState<{name: string, summary: string} | null>(null);

  // Filter Logic
  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.phone.includes(searchQuery) ||
      l.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.interestedIn.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [leads, searchQuery]);

  // Sort Logic
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];

      // Handle specific sorts
      if (sortKey === 'status') {
         // Simple string sort for enum for now, could be weighted
         valA = a.status;
         valB = b.status;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortKey, sortOrder]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.size} leads?`)) {
      onDeleteLeads(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc'); // Default to descending for new metrics
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case LeadStatus.QUALIFIED: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case LeadStatus.SITE_VISIT_SCHEDULED: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case LeadStatus.CLOSED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case LeadStatus.COLD: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case LeadStatus.STOP_AI: return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceBar = (score: number) => {
    let color = 'bg-red-500';
    if (score > 40) color = 'bg-yellow-500';
    if (score > 75) color = 'bg-green-500';
    
    return (
      <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
       {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Active Leads</h2>
          <p className="text-gray-400 text-sm">Real-time gatekeeper pipeline from Telegram & WhatsApp.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {selectedIds.size > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Trash2 size={16} /> Delete ({selectedIds.size})
            </button>
          )}

          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, phone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-glass-100 border border-glass-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
          
          <div className="relative group">
             <button className="flex items-center justify-between gap-2 px-3 py-2 w-full sm:w-auto bg-glass-100 border border-glass-border rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
               <span className="flex items-center gap-2">
                 <ArrowUpDown size={16} />
                 <span className="text-xs font-medium uppercase">{sortKey}</span>
               </span>
             </button>
             {/* Simple Dropdown for Sort */}
             <div className="absolute right-0 top-full mt-2 w-40 bg-[#151515] border border-glass-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col overflow-hidden">
                <button onClick={() => handleSort('lastActive')} className="px-4 py-2 text-left text-sm text-gray-400 hover:bg-white/10 hover:text-white">Recency</button>
                <button onClick={() => handleSort('confidenceScore')} className="px-4 py-2 text-left text-sm text-gray-400 hover:bg-white/10 hover:text-white">Confidence</button>
                <button onClick={() => handleSort('name')} className="px-4 py-2 text-left text-sm text-gray-400 hover:bg-white/10 hover:text-white">Name</button>
                <button onClick={() => handleSort('status')} className="px-4 py-2 text-left text-sm text-gray-400 hover:bg-white/10 hover:text-white">Status</button>
             </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="rounded-xl border border-glass-border overflow-hidden bg-glass-100 backdrop-blur-md min-h-[500px] flex flex-col">
        {filteredLeads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-10">
             <Search size={48} className="mb-4 opacity-20" />
             <p>No leads found matching "{searchQuery}"</p>
          </div>
        ) : (
        <div className="overflow-x-auto flex-1 w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-glass-border">
                <th className="p-4 font-medium w-12">
                   <input 
                    type="checkbox" 
                    checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded bg-gray-800 border-gray-700 accent-brand-500 cursor-pointer" 
                  />
                </th>
                <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Business/Name</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Interest</th>
                <th className="p-4 font-medium">Site Visit Pref</th>
                <th className="p-4 font-medium">AI Summary</th>
                <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('confidenceScore')}>Pot. Score</th>
                <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('status')}>Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {sortedLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-white/5 transition-colors group ${selectedIds.has(lead.id) ? 'bg-brand-500/10' : ''}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="rounded bg-gray-800 border-gray-700 accent-brand-500 cursor-pointer" 
                    />
                  </td>
                  <td className="p-4">
                     <div>
                       <div className="font-medium text-white">{lead.name}</div>
                       <a href={`tel:${lead.phone}`} className="text-xs text-gray-500 hover:text-brand-400 hover:underline">{lead.phone}</a>
                     </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      {lead.platform === 'Telegram' ? <Send size={14} className="text-blue-400" /> : 
                       lead.platform === 'WhatsApp' ? <MessageSquare size={14} className="text-green-400" /> :
                       <Mail size={14} className="text-orange-400" />}
                      {lead.platform}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {lead.interestedIn.map((item, i) => (
                        <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-300 w-fit line-clamp-1">{item}</span>
                      ))}
                      <div className="text-xs text-gray-500 mt-1">Budget: {lead.budget}</div>
                    </div>
                  </td>
                  <td className="p-4">
                     {lead.siteVisitTime ? (
                        <div className="flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 px-2 py-1 rounded w-fit">
                           <CalendarDays size={12} />
                           {lead.siteVisitTime}
                        </div>
                     ) : (
                        <span className="text-xs text-gray-600">-</span>
                     )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="flex items-start gap-2 group/summary">
                       <button 
                         onClick={() => setActiveSummary({ name: lead.name, summary: lead.conversationSummary })}
                         className="bg-brand-500/10 p-1 rounded-full mt-0.5 shrink-0 hover:bg-brand-500/30 text-brand-400 transition-colors"
                         title="View Full Summary"
                       >
                          <AlertCircle size={12} />
                       </button>
                       <p className="text-xs text-gray-400 line-clamp-2 cursor-pointer" onClick={() => setActiveSummary({ name: lead.name, summary: lead.conversationSummary })}>
                         {lead.conversationSummary}
                       </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {getConfidenceBar(lead.confidenceScore)}
                      <span className="text-[10px] text-gray-500 text-right">{lead.confidenceScore > 75 ? 'High' : 'Mid'} Pot.</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status === LeadStatus.SITE_VISIT_SCHEDULED && <Clock size={10} className="mr-1" />}
                      {lead.status === LeadStatus.NEW && <AlertCircle size={10} className="mr-1" />}
                      {lead.status === LeadStatus.CLOSED && <CheckCircle2 size={10} className="mr-1" />}
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <a href={`tel:${lead.phone}`} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" title="Call">
                        <Phone size={16} />
                      </a>
                      <a 
                        href={lead.platform === 'Telegram' ? 'https://t.me/' : 'https://wa.me/'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" 
                        title="Open Chat"
                      >
                        <MessageSquare size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        <div className="p-4 border-t border-glass-border flex justify-between items-center text-xs text-gray-500">
           <span>Showing {filteredLeads.length} leads</span>
           <div className="flex gap-2">
              <button disabled className="disabled:opacity-30 hover:text-white px-2 py-1 rounded hover:bg-white/5">Previous</button>
              <button disabled className="disabled:opacity-30 hover:text-white px-2 py-1 rounded hover:bg-white/5">Next</button>
           </div>
        </div>
      </div>

      {/* Summary Modal */}
      {activeSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-md animate-fade-in-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-brand-500/20 text-brand-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Context Summary</h3>
                  <p className="text-xs text-gray-400">Lead: {activeSummary.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveSummary(null)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-glass-border">
              <p className="text-sm text-gray-200 leading-relaxed">{activeSummary.summary}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setActiveSummary(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};