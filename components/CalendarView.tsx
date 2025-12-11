/*
  ===========================================================================================
  SCHEDULE MANAGER & CALENDAR
  ===========================================================================================
  
  FUNCTIONALITY:
  - Manages site visits and broker availability.
  - "Blocked Rules" allow defining work hours/recurring unavailability.
  
  INTEGRATION NOTES:
  - Syncing with Google/Outlook Calendar requires OAuth2.
  - Use the Google Calendar API `events.list` and `events.insert`.
  - PRODUCTION: The backend must maintain a 2-way sync state token.
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Calendar as CalendarIcon, Clock, Briefcase, Coffee, Download, CheckCircle, X, ChevronDown, Plus, Trash2, Repeat, Flag, CalendarDays } from 'lucide-react';
import { CalendarEvent, BlockedTimeRule, AppSettings } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (e: CalendarEvent) => void;
}

type ViewMode = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  
  // Rule Management
  const [blockedRules, setBlockedRules] = useState<BlockedTimeRule[]>([]);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<BlockedTimeRule>>({
      title: 'Unavailable',
      startTime: '10:00',
      endTime: '11:00',
      isRecurring: false,
      recurrenceType: 'WEEKLY',
      recurrenceDays: []
  });

  // Settings Mock (In real app, props would pass this down)
  const [workDays, setWorkDays] = useState<number[]>([1,2,3,4,5]); // Mon-Fri
  const [holidays, setHolidays] = useState<string[]>([]); // "YYYY-MM-DD" format strings
  const [newHolidayDate, setNewHolidayDate] = useState('');
  
  // Lunch Break Specific Config
  const [lunchBreak, setLunchBreak] = useState({
      enabled: true,
      start: '13:00',
      end: '14:00'
  });

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleExport = () => {
    const content = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GuaqAI//BokerCalendar//EN\nEND:VCALENDAR";
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule.ics';
    a.click();
  };

  const handleAddRule = () => {
      if(newRule.title && newRule.startTime && newRule.endTime) {
          setBlockedRules([...blockedRules, {
              id: Math.random().toString(),
              title: newRule.title,
              startTime: newRule.startTime,
              endTime: newRule.endTime,
              isRecurring: newRule.isRecurring || false,
              recurrenceType: newRule.recurrenceType,
              recurrenceDays: newRule.recurrenceDays
          }]);
          setIsAddingRule(false);
          setNewRule({ title: 'Unavailable', startTime: '10:00', endTime: '11:00', isRecurring: false, recurrenceType: 'WEEKLY', recurrenceDays: [] });
      }
  };

  const deleteRule = (id: string) => {
      setBlockedRules(blockedRules.filter(r => r.id !== id));
  };

  const toggleWorkDay = (dayIdx: number) => {
      if (workDays.includes(dayIdx)) {
          setWorkDays(workDays.filter(d => d !== dayIdx));
      } else {
          setWorkDays([...workDays, dayIdx].sort());
      }
  };

  const addHoliday = () => {
      if (newHolidayDate && !holidays.includes(newHolidayDate)) {
          setHolidays([...holidays, newHolidayDate].sort());
          setNewHolidayDate('');
      }
  };

  const removeHoliday = (dateStr: string) => {
      setHolidays(holidays.filter(h => h !== dateStr));
  };

  const renderEvent = (hour: number, dayOffset: number = 0) => {
    const currentDay = new Date(selectedDate);
    currentDay.setDate(selectedDate.getDate() + dayOffset);
    const dayOfWeek = currentDay.getDay();
    const dateStr = currentDay.toISOString().split('T')[0];

    // Check Holiday
    if (holidays.includes(dateStr)) {
        if (hour === 8) return <div className="absolute inset-1 bg-red-500/10 text-red-400 text-xs flex items-center justify-center border border-red-500/20 rounded h-[calc(100%*12)] z-10 font-bold tracking-wide"><Flag size={14} className="mr-2"/> HOLIDAY - OFFICE CLOSED</div>;
        return null;
    }

    // Check Work Day
    if (!workDays.includes(dayOfWeek)) {
        return <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[1px] z-0"></div>;
    }
    
    // Check Lunch Break
    if (lunchBreak.enabled) {
        const lunchStart = parseInt(lunchBreak.start.split(':')[0]);
        // Simple visualization for full hour blocks
        if (hour === lunchStart) {
             return (
                <div className="absolute inset-1 bg-neutral-800/60 text-gray-500 text-[10px] flex items-center justify-center border border-white/5 rounded z-10 backdrop-blur-sm">
                    <Coffee size={12} className="mr-1 opacity-70" /> Lunch
                </div>
             );
        }
    }

    // Check Events
    const event = events.find(e => 
      e.start.getDate() === currentDay.getDate() && 
      e.start.getMonth() === currentDay.getMonth() &&
      e.start.getHours() === hour
    );

    if (event) {
        return (
        <div className={`absolute inset-1 rounded p-1 text-[10px] md:text-xs flex flex-col justify-center truncate z-10 ${
            event.type === 'VISIT' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 
            'bg-yellow-500/20 text-yellow-300'
        }`}>
            <span className="font-bold truncate">{event.title}</span>
            <span className="hidden md:inline">{event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        );
    }

    // Check Block Rules
    const matchedRule = blockedRules.find(r => {
        const startH = parseInt(r.startTime.split(':')[0]);
        if (startH !== hour) return false;
        
        if (r.isRecurring) {
            if (r.recurrenceType === 'WEEKLY' && r.recurrenceDays?.includes(dayOfWeek)) return true;
            if (r.recurrenceType === 'DAILY') return true;
        } else {
            return true; 
        }
        return false;
    });

    if (matchedRule) {
        return (
            <div className="absolute inset-1 rounded p-1 text-[10px] flex items-center justify-center bg-red-500/10 text-red-300 border border-red-500/20 z-10">
                <span className="truncate">{matchedRule.title}</span>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header Actions */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Schedule Manager</h2>
            <p className="text-gray-400 text-sm">Manage site visits, work hours, and holidays.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative group">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm text-white transition-colors">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-4 h-4" /> 
                    Sync Calendar <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#151515] border border-glass-border rounded-lg shadow-xl hidden group-hover:block z-20">
                    <div className="p-2 space-y-1">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded flex items-center justify-between">Google Calendar <CheckCircle size={12} className="text-green-500"/></button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded">Outlook Calendar</button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded flex items-center justify-between">iCloud Calendar <CheckCircle size={12} className="text-green-500"/></button>
                    </div>
                </div>
             </div>
             <button onClick={handleExport} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg text-sm text-white transition-colors">
                <Download size={16} /> Export .cal
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <GlassCard className="lg:col-span-1 space-y-6 h-fit">
             <div>
                <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                   <Briefcase size={18} className="text-brand-400" /> Work Configuration
                </h3>
                
                {/* Work Days */}
                <div className="mb-4">
                    <label className="text-xs text-gray-400 block mb-2">Work Days</label>
                    <div className="flex justify-between">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                            <button 
                                key={i}
                                onClick={() => toggleWorkDay(i)}
                                className={`w-6 h-6 rounded text-[10px] flex items-center justify-center transition-colors ${
                                    workDays.includes(i) ? 'bg-brand-600 text-white' : 'bg-white/5 text-gray-500'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Lunch Break - RESTORED */}
                <div className="mb-4 pb-4 border-b border-glass-border">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-gray-400 flex items-center gap-2">
                           <Coffee size={12} /> Lunch Break
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={lunchBreak.enabled} 
                              onChange={e => setLunchBreak({...lunchBreak, enabled: e.target.checked})}
                              className="sr-only peer" 
                            />
                            <div className="w-7 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                    {lunchBreak.enabled && (
                        <div className="flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-glass-border animate-fade-in">
                            <input 
                              type="time" 
                              value={lunchBreak.start}
                              onChange={e => setLunchBreak({...lunchBreak, start: e.target.value})}
                              className="bg-black/20 text-xs p-1 rounded text-white flex-1 border border-transparent focus:border-brand-500 outline-none"
                            />
                            <span className="text-gray-500 text-xs">-</span>
                            <input 
                              type="time" 
                              value={lunchBreak.end}
                              onChange={e => setLunchBreak({...lunchBreak, end: e.target.value})}
                              className="bg-black/20 text-xs p-1 rounded text-white flex-1 border border-transparent focus:border-brand-500 outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* Holiday Manager */}
                <div className="mb-4">
                    <label className="text-xs text-gray-400 block mb-2 flex items-center gap-2">
                        <CalendarDays size={12}/> Holiday Exceptions
                    </label>
                    <div className="flex gap-2 mb-3 items-center">
                         {/* Styled Date Picker */}
                         <div className="relative flex-1">
                             <input 
                               type="date" 
                               className="w-full bg-white/5 text-xs p-2 rounded-lg text-white border border-glass-border focus:border-brand-500 focus:outline-none appearance-none"
                               value={newHolidayDate}
                               onChange={(e) => setNewHolidayDate(e.target.value)}
                               style={{ colorScheme: 'dark' }}
                             />
                         </div>
                         <button 
                           onClick={addHoliday}
                           disabled={!newHolidayDate}
                           className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg text-xs disabled:opacity-50 transition-colors"
                         >
                            Mark Off
                         </button>
                    </div>
                    
                    {holidays.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {holidays.map(dateStr => (
                                <div key={dateStr} className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-xs text-gray-300 group border border-transparent hover:border-red-500/30 transition-all">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <button onClick={() => removeHoliday(dateStr)} className="text-gray-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity p-1">
                                        <X size={14}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600 italic border border-dashed border-glass-border rounded-lg p-3 text-center">No holidays marked.</p>
                    )}
                </div>

                {/* Blocked Rules */}
                <div className="pt-4 border-t border-glass-border">
                    <div className="flex justify-between items-center mb-3">
                         <span className="text-sm text-white font-medium">Daily Blocks</span>
                         <button onClick={() => setIsAddingRule(true)} className="text-xs text-brand-400 hover:text-white flex items-center gap-1"><Plus size={12}/> Add</button>
                    </div>
                    
                    {isAddingRule && (
                        <div className="bg-white/5 p-3 rounded-lg border border-glass-border mb-3 space-y-2 animate-fade-in-up">
                            <input type="text" placeholder="Reason (e.g. Meeting)" className="w-full bg-black/20 text-xs p-1 rounded text-white border border-glass-border" value={newRule.title} onChange={e => setNewRule({...newRule, title: e.target.value})}/>
                            <div className="flex gap-2">
                                <input type="time" className="bg-black/20 text-xs p-1 rounded text-white flex-1 border border-glass-border" value={newRule.startTime} onChange={e => setNewRule({...newRule, startTime: e.target.value})}/>
                                <input type="time" className="bg-black/20 text-xs p-1 rounded text-white flex-1 border border-glass-border" value={newRule.endTime} onChange={e => setNewRule({...newRule, endTime: e.target.value})}/>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={newRule.isRecurring} onChange={e => setNewRule({...newRule, isRecurring: e.target.checked})} className="rounded bg-black/20 border-gray-600"/>
                                <span className="text-xs text-gray-400">Repeat Weekly</span>
                            </div>
                            {newRule.isRecurring && (
                                <div className="flex gap-1 flex-wrap">
                                    {[1,2,3,4,5].map(d => (
                                        <button 
                                            key={d} 
                                            onClick={() => {
                                                const current = newRule.recurrenceDays || [];
                                                setNewRule({
                                                    ...newRule, 
                                                    recurrenceDays: current.includes(d) ? current.filter(x => x !== d) : [...current, d]
                                                });
                                            }}
                                            className={`w-5 h-5 text-[9px] rounded ${newRule.recurrenceDays?.includes(d) ? 'bg-brand-500 text-white' : 'bg-white/10 text-gray-500'}`}
                                        >
                                            {weekDays[d][0]}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsAddingRule(false)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                                <button onClick={handleAddRule} className="text-xs bg-brand-600 px-3 py-1 rounded text-white hover:bg-brand-500">Save</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {blockedRules.map(r => (
                            <div key={r.id} className="text-xs text-gray-400 bg-white/5 p-2 rounded flex justify-between items-center group border border-transparent hover:border-brand-500/20">
                                <div>
                                    <div className="text-white font-medium">{r.title}</div>
                                    <div className="text-[10px]">{r.startTime}-{r.endTime} {r.isRecurring ? '(Weekly)' : ''}</div>
                                </div>
                                <button onClick={() => deleteRule(r.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                            </div>
                        ))}
                        {blockedRules.length === 0 && !isAddingRule && <p className="text-xs text-gray-600 italic border border-dashed border-glass-border rounded-lg p-3 text-center">No custom blocks.</p>}
                    </div>
                </div>
             </div>
             
             <div className="border-t border-glass-border pt-4">
                <h3 className="font-medium text-white mb-2 text-sm">Active Integrations</h3>
                <div className="space-y-2">
                   <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <span className="text-xs text-gray-300">Google Calendar</span>
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] text-green-400">Synced</span>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <span className="text-xs text-gray-300">iCloud Calendar</span>
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] text-green-400">Synced</span>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                   </div>
                </div>
             </div>
          </GlassCard>

          {/* Main Calendar UI */}
          <GlassCard className="lg:col-span-3 min-h-[600px] flex flex-col" noPadding>
             {/* Header */}
             <div className="p-4 border-b border-glass-border flex flex-col sm:flex-row justify-between items-center bg-white/5 gap-4">
                <div className="flex items-center gap-4">
                   <h3 className="text-xl font-bold text-white">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                   </h3>
                   <div className="flex bg-black/20 rounded-lg p-1">
                      <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate()-1)))} className="px-3 py-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">←</button>
                      <button onClick={() => setSelectedDate(new Date())} className="px-3 py-1 hover:bg-white/10 rounded text-xs font-medium text-brand-400">Today</button>
                      <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate()+1)))} className="px-3 py-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">→</button>
                   </div>
                </div>
                
                <div className="flex bg-glass-100 rounded-lg p-1 border border-glass-border">
                    <button onClick={() => setViewMode('day')} className={`px-3 py-1 text-xs rounded ${viewMode === 'day' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>Day</button>
                    <button onClick={() => setViewMode('week')} className={`px-3 py-1 text-xs rounded ${viewMode === 'week' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>Week</button>
                    <button onClick={() => setViewMode('month')} className={`px-3 py-1 text-xs rounded ${viewMode === 'month' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>Month</button>
                </div>
             </div>

             {/* Grid */}
             <div className="flex-1 overflow-y-auto relative">
                {viewMode === 'day' && hours.map(hour => (
                   <div key={hour} className="flex border-b border-glass-border min-h-[60px] relative group hover:bg-white/[0.02]">
                      <div className="w-20 border-r border-glass-border p-2 text-xs text-gray-500 text-right bg-black/20">
                         {hour}:00
                      </div>
                      <div className="flex-1 relative p-1">
                         {renderEvent(hour)}
                         <button className="opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded hover:bg-brand-500 hover:text-white transition-all">
                            + Block
                         </button>
                      </div>
                   </div>
                ))}
                
                {viewMode === 'week' && (
                    <div className="flex h-full">
                        <div className="w-14 shrink-0 border-r border-glass-border">
                            {hours.map(h => (
                                <div key={h} className="h-16 text-[10px] text-gray-500 text-right pr-2 pt-1 border-b border-glass-border">{h}:00</div>
                            ))}
                        </div>
                        <div className="flex-1 grid grid-cols-7 divide-x divide-glass-border">
                            {Array.from({length: 7}).map((_, dayIdx) => {
                                const date = new Date(selectedDate);
                                const currentDay = date.getDate() - date.getDay() + dayIdx;
                                const actualDate = new Date(date.setDate(currentDay));
                                
                                return (
                                    <div key={dayIdx} className="relative">
                                        <div className={`text-center text-xs py-2 border-b border-glass-border ${actualDate.toDateString() === new Date().toDateString() ? 'bg-brand-500/10 text-brand-400' : 'bg-white/5 text-gray-400'}`}>
                                            {actualDate.toLocaleDateString('en-US', {weekday: 'short', day: 'numeric'})}
                                        </div>
                                        <div className="relative">
                                            {hours.map(h => (
                                                <div key={h} className="h-16 border-b border-glass-border relative">
                                                     {renderEvent(h, dayIdx - selectedDate.getDay())}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {viewMode === 'month' && (
                    <div className="grid grid-cols-7 grid-rows-5 h-full divide-x divide-y divide-glass-border">
                        {Array.from({length: 35}).map((_, i) => (
                            <div key={i} className="p-2 min-h-[80px] hover:bg-white/5 relative">
                                <span className="text-xs text-gray-500">{i + 1}</span>
                                {i === 12 && <div className="mt-1 bg-brand-500/20 text-brand-300 text-[9px] p-1 rounded truncate">Site Visit: Sobha</div>}
                            </div>
                        ))}
                    </div>
                )}
             </div>
          </GlassCard>
       </div>
    </div>
  );
};