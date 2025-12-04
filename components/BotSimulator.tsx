import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Bot, RefreshCw, Smartphone, PlayCircle, Image as ImageIcon, FileText, Download, Film } from 'lucide-react';
import { gatekeeperChat, GatekeeperResponse } from '../services/geminiService';
import { Property } from '../types';

interface BotSimulatorProps {
  inventory: Property[];
  onLeadUpdate: (data: GatekeeperResponse) => void;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  attachments?: Property[]; // Properties to show cards for
}

export const BotSimulator: React.FC<BotSimulatorProps> = ({ inventory, onLeadUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>(['System initialized. Ready for simulation.']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const processResponse = async (userMsg: string, currentHistory: { sender: 'user' | 'bot', text: string }[]) => {
    setIsTyping(true);
    try {
      // Call Gemini with updated history
      const result = await gatekeeperChat(userMsg, currentHistory, inventory);
      
      // Construct new bot message with potential attachments
      const botMsg: ChatMessage = {
        sender: 'bot',
        text: result.botReply,
        attachments: result.suggestedProperties
      };

      setMessages(prev => [...prev, botMsg]);
      
      // Log actions
      const logs = [`Bot replied: "${result.botReply.substring(0, 40)}..."`];
      if (result.action && result.action !== 'NONE') {
        logs.push(`ACTION TRIGGERED: ${result.action}`);
        if (result.extractedData) {
          logs.push(`Data Extracted: ${JSON.stringify(result.extractedData, null, 2)}`);
          onLeadUpdate(result);
        }
      }
      setDebugLog(prev => [...prev, ...logs]);
    } catch (error) {
      console.error("Simulation Error:", error);
      setDebugLog(prev => [...prev, `ERROR: ${error}`]);
      setMessages(prev => [...prev, { sender: 'bot', text: "System Error: Unable to process response." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    const newHistory = messages.map(m => ({ sender: m.sender, text: m.text }));
    const updatedHistory = [...newHistory, { sender: 'user', text: userMsg } as const];
    
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setDebugLog(prev => [...prev, `User sent: "${userMsg}"`]);
    
    await processResponse(userMsg, updatedHistory);
  };

  const handleSimulateIncoming = async () => {
     if (messages.length > 0) return;
     const triggerMsg = "Hi! I saw your ad on Instagram. I am looking for a property.";
     const newHistory = [{ sender: 'user', text: triggerMsg } as const];
     
     setMessages([{ sender: 'user', text: triggerMsg }]);
     setDebugLog(prev => [...prev, `Simulating incoming lead trigger...`]);
     
     await processResponse(triggerMsg, newHistory);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-140px)] animate-fade-in pb-10 lg:pb-0">
      {/* Mobile Preview */}
      <div className="flex-1 flex justify-center lg:justify-end xl:justify-center min-h-[500px] lg:min-h-0">
        <div className="w-full max-w-[360px] h-full min-h-[500px] bg-black rounded-[2rem] border-4 border-gray-800 relative shadow-2xl overflow-hidden flex flex-col shrink-0">
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-40 h-6 bg-black rounded-b-xl z-20"></div>
           
           {/* Header */}
           <div className="bg-[#1e2329] p-4 pt-10 flex items-center gap-3 border-b border-gray-800 z-10">
             <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white">
                <Bot size={20} />
             </div>
             <div>
               <h3 className="text-white font-medium text-sm">Guaq Assistant</h3>
               <p className="text-brand-400 text-xs">bot</p>
             </div>
           </div>

           {/* Chat Area */}
           <div className="flex-1 bg-[#0d1117] overflow-y-auto p-4 space-y-4 relative">
              {messages.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <button 
                     onClick={handleSimulateIncoming}
                     className="bg-brand-600/20 hover:bg-brand-600 text-brand-400 hover:text-white px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 border border-brand-600/30"
                   >
                     <PlayCircle size={16} /> Simulate Incoming Lead
                   </button>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-brand-600 text-white rounded-br-sm' 
                    : 'bg-[#1e2329] text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Render Attachments (Media/Docs) */}
                  {msg.attachments && msg.attachments.length > 0 && (
                     <div className="mt-2 space-y-2 w-full max-w-[85%]">
                        {msg.attachments.map(prop => (
                           <div key={prop.id} className="bg-[#1e2329] rounded-xl overflow-hidden border border-gray-800">
                              {/* Media Gallery */}
                              {prop.media && prop.media.length > 0 ? (
                                <div className="h-32 bg-gray-800 relative">
                                   {prop.media[0].type === 'video' ? (
                                      <div className="w-full h-full flex items-center justify-center"><Film size={24} className="text-gray-500"/></div>
                                   ) : (
                                      <img src={prop.media[0].url} className="w-full h-full object-cover" alt={prop.title} />
                                   )}
                                   <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 rounded">
                                      {prop.media.length} items
                                   </div>
                                </div>
                              ) : (
                                <div className="h-24 bg-gray-800 flex items-center justify-center">
                                   <ImageIcon className="text-gray-600" />
                                </div>
                              )}
                              
                              <div className="p-2">
                                 <h4 className="text-xs font-bold text-white truncate">{prop.title}</h4>
                                 <p className="text-[10px] text-gray-400">{prop.location} • {prop.price}</p>
                              </div>

                              {/* Documents */}
                              {prop.documents && prop.documents.length > 0 && (
                                 <div className="border-t border-gray-800 p-2 space-y-1">
                                    {prop.documents.map(doc => (
                                       <div key={doc.id} className="flex items-center gap-2 text-xs text-brand-400 p-1 hover:bg-white/5 rounded cursor-pointer">
                                          <FileText size={12} />
                                          <span className="truncate flex-1">{doc.name}</span>
                                          <Download size={12} />
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1e2329] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Input Area */}
           <div className="p-3 bg-[#1e2329] border-t border-gray-800">
             <div className="flex items-center gap-2">
               <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
                 placeholder="Type a message..."
                 className="flex-1 bg-[#0d1117] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
               />
               <button 
                 onClick={handleSend}
                 className="p-2 bg-brand-600 rounded-full text-white hover:bg-brand-500"
               >
                 <Send size={18} />
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Control Panel & Logs */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden h-auto min-h-[400px] lg:h-auto order-last lg:order-none">
         <div className="flex justify-between items-center mb-4 shrink-0">
           <h2 className="text-xl font-semibold text-white flex items-center gap-2">
             <Smartphone size={20} className="text-brand-400" />
             Live Simulator
           </h2>
           <button 
             onClick={() => {
                setMessages([]);
                setDebugLog(['Resetting simulation...']);
             }}
             className="text-xs flex items-center gap-1 text-gray-400 hover:text-white bg-white/5 px-3 py-1 rounded-lg transition-colors"
           >
             <RefreshCw size={12} /> Reset Chat
           </button>
         </div>

         <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2 bg-black/20 p-4 rounded-lg">
           <p className="text-gray-500 mb-2 border-b border-gray-800 pb-2">// Server-side Logic Logs</p>
           {debugLog.map((log, i) => (
             <div key={i} className={`p-2 rounded border-l-2 whitespace-pre-wrap ${
               log.includes('ACTION') ? 'bg-green-500/10 border-green-500 text-green-300' : 
               log.includes('Bot') ? 'bg-blue-500/10 border-blue-500 text-blue-300' :
               log.includes('ERROR') ? 'bg-red-500/10 border-red-500 text-red-300' :
               'bg-white/5 border-gray-600 text-gray-400'
             }`}>
               {log}
             </div>
           ))}
         </div>

         <div className="mt-4 p-4 rounded-lg bg-brand-900/20 border border-brand-500/20 shrink-0">
           <h4 className="text-sm font-medium text-brand-300 mb-1">How it works</h4>
           <p className="text-xs text-gray-400">
             1. Click "Simulate Incoming Lead" to act as a new customer.<br/>
             2. The AI uses your property inventory to answer queries.<br/>
             3. If interest is detected (e.g., "I want to see the penthouse"), the AI triggers an update to the Leads Pipeline automatically.
           </p>
         </div>
      </GlassCard>
    </div>
  );
};