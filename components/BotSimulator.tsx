/*
  ===========================================================================================
  BOT SIMULATOR & GATEKEEPER INTERFACE
  ===========================================================================================
  
  PURPOSE:
  - This component acts as a "Sandbox" for the broker to test the AI configuration.
  - It simulates a guest user on WhatsApp/Telegram interacting with the bot.
  
  MIGRATION TO PRODUCTION:
  - Current implementation calls `gatekeeperChat` (Gemini API) directly.
  - PROD: Use WebSockets (Socket.io) or Server-Sent Events (SSE) to handle chat.
  
  API ENDPOINTS REQUIRED:
  - POST /api/simulator/send
    Body: { message: string, history: [], leadId?: string }
    Response: Stream<string> (for typing effect)
  
  FEATURES:
  - Voice Input: Mocked. Integrate `react-speech-recognition` or browser native API.
  - Image Editing: Calls `visualizeProperty`.
  - Debug Log: Shows backend decision logic (useful for prompt tuning).
*/

import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Bot, RefreshCw, Smartphone, PlayCircle, Image as ImageIcon, FileText, Download, Film, Mic, Sparkles, StopCircle, Wand2 } from 'lucide-react';
import { gatekeeperChat, visualizeProperty, GatekeeperResponse } from '../services/geminiService';
import { Property, AppSettings } from '../types';

interface BotSimulatorProps {
  inventory: Property[];
  onLeadUpdate: (data: GatekeeperResponse) => void;
  settings: AppSettings;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  type?: 'text' | 'audio';
  attachments?: Property[]; 
  imageUrl?: string; // For edited images
}

export const BotSimulator: React.FC<BotSimulatorProps> = ({ inventory, onLeadUpdate, settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>(['System initialized.']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const processResponse = async (userMsg: string, currentHistory: { sender: 'user' | 'bot', text: string }[]) => {
    setIsTyping(true);
    try {
      // Check for visualization request
      const isVizRequest = userMsg.toLowerCase().includes('visualize') || userMsg.toLowerCase().includes('how would this look');
      const lastBotImage = [...messages].reverse().find(m => m.sender === 'bot' && m.attachments?.some(a => a.media.length > 0));

      if (isVizRequest && lastBotImage && lastBotImage.attachments?.[0].media[0].url) {
          // Trigger Image Editing
          setDebugLog(prev => [...prev, `Visualization Request Detected. Processing with Nano Banana...`]);
          
          // Convert blob URL to base64 (mock logic as we can't easily fetch blob content in this sandbox without FileReader flow from original file)
          // For demo, we just pass a placeholder or the URL if it's external
          const editedImageUrl = await visualizeProperty(lastBotImage.attachments[0].media[0].url, userMsg);
          
          setMessages(prev => [...prev, { 
              sender: 'bot', 
              text: "Here is a visualization based on your request:",
              imageUrl: editedImageUrl
          }]);
          
          setDebugLog(prev => [...prev, `Image Generated & Stored locally.`]);
      } else {
          // Standard Chat
          const result = await gatekeeperChat(userMsg, currentHistory, inventory, settings.enableAiBooking);
          
          const botMsg: ChatMessage = {
            sender: 'bot',
            text: result.botReply,
            attachments: result.suggestedProperties
          };
          setMessages(prev => [...prev, botMsg]);

          if (result.action && result.action !== 'NONE') {
             onLeadUpdate(result);
             setDebugLog(prev => [...prev, `ACTION: ${result.action} | Conf: ${result.extractedData?.confidenceScore}%`]);
          }
      }
    } catch (error) {
      console.error("Simulation Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    const newHistory = messages.map(m => ({ sender: m.sender, text: m.text }));
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setDebugLog(prev => [...prev, `User: "${userMsg}"`]);
    await processResponse(userMsg, [...newHistory, { sender: 'user', text: userMsg }]);
  };

  const handleVoiceInput = () => {
      if (!isRecording) {
          setIsRecording(true);
          // Simulate recording start
      } else {
          setIsRecording(false);
          // Simulate recording end -> STT
          const simulatedText = "I really like the penthouse, can we schedule a visit next Tuesday?";
          setMessages(prev => [...prev, { sender: 'user', text: "🎤 [Voice Message] " + simulatedText, type: 'audio' }]);
          setDebugLog(prev => [...prev, `Voice Input Transcribed: "${simulatedText}"`]);
          processResponse(simulatedText, messages.map(m => ({ sender: m.sender, text: m.text })));
      }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] animate-fade-in pb-2">
      {/* Phone Simulator Container */}
      <div className="flex-1 flex justify-center lg:justify-end xl:justify-center h-full overflow-hidden">
        <div className="w-full max-w-[360px] h-full bg-black rounded-[2.5rem] border-4 border-gray-800 relative shadow-2xl flex flex-col shrink-0 ring-4 ring-gray-900 overflow-hidden">
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-xl z-20 pointer-events-none"></div>
           
           {/* Phone Header */}
           <div className="bg-[#1e2329]/95 backdrop-blur-md p-4 pt-12 flex items-center gap-3 border-b border-gray-800 z-10 sticky top-0 shrink-0">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                <Bot size={20} />
             </div>
             <div>
               <h3 className="text-white font-medium text-sm">Guaq Assistant</h3>
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-brand-400 text-[10px]">Online • Reply in 2s</p>
               </div>
             </div>
           </div>

           {/* Chat Area */}
           <div className="flex-1 bg-[#0d1117] overflow-y-auto p-4 space-y-4 relative scrollbar-thin scrollbar-thumb-gray-800">
              {messages.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-60">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="text-brand-400" />
                   </div>
                   <p className="text-sm text-gray-400 mb-4">Say "Visualize this with marble flooring" to test image editing.</p>
                   <button 
                     onClick={() => {
                        const msg = "Hi! I saw the penthouse. Can you visualize it with wooden flooring?";
                        setMessages([{ sender: 'user', text: msg }]);
                        processResponse(msg, []);
                     }}
                     className="bg-brand-600/20 text-brand-300 px-4 py-2 rounded-full text-xs border border-brand-600/30"
                   >
                     Try Demo Prompt
                   </button>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-lg ${
                    msg.sender === 'user' 
                    ? 'bg-brand-600 text-white rounded-br-sm' 
                    : 'bg-[#1e2329] text-gray-200 rounded-bl-sm border border-gray-800'
                  }`}>
                    {msg.text}
                    {/* ElevenLabs Mock Player */}
                    {msg.sender === 'bot' && (
                        <div className="mt-2 flex items-center gap-2 bg-black/20 p-1.5 rounded-full pr-3 w-fit">
                            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                                <PlayCircle size={12} fill="white" />
                            </div>
                            <div className="h-0.5 w-12 bg-gray-600 rounded-full relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-brand-400"></div>
                            </div>
                            <span className="text-[9px] text-gray-400">0:12</span>
                        </div>
                    )}
                  </div>

                  {msg.imageUrl && (
                      <div className="mt-2 max-w-[85%] rounded-xl overflow-hidden border border-brand-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                          <img src={msg.imageUrl} className="w-full" alt="AI Generated" />
                          <div className="bg-brand-900/80 p-1.5 text-center text-[10px] text-brand-200">
                             <Wand2 size={10} className="inline mr-1"/> AI Visualized
                          </div>
                      </div>
                  )}

                  {msg.attachments?.map(prop => (
                       <div key={prop.id} className="mt-2 w-[85%] bg-[#1e2329] rounded-xl overflow-hidden border border-gray-800 shadow-xl">
                          <div className="h-32 bg-gray-800 relative group cursor-pointer">
                             <img src={prop.media[0]?.url} className="w-full h-full object-cover" alt={prop.title} />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium border border-white px-3 py-1 rounded-full">View Details</span>
                             </div>
                          </div>
                          <div className="p-3">
                             <h4 className="text-xs font-bold text-white truncate">{prop.title}</h4>
                             <p className="text-[10px] text-gray-400 mt-0.5">{prop.location}</p>
                             <div className="flex gap-2 mt-2">
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] py-1.5 rounded">Brochure</button>
                                <button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white text-[10px] py-1.5 rounded">Book Visit</button>
                             </div>
                          </div>
                       </div>
                    ))}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1e2329] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    <span className="w-2 h-2 bg-brand-500/50 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-brand-500/50 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-brand-500/50 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Input Area */}
           <div className="p-3 bg-[#1e2329] border-t border-gray-800 shrink-0">
             <div className="flex items-center gap-2">
               <button 
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
               >
                  {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
               </button>
               <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
                 placeholder={isRecording ? "Listening..." : "Message..."}
                 className="flex-1 bg-[#0d1117] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-all placeholder:text-gray-600"
               />
               <button onClick={handleSend} className="p-2 bg-brand-600 rounded-full text-white hover:bg-brand-500 shadow-lg shadow-brand-600/20">
                 <Send size={18} />
               </button>
             </div>
           </div>
        </div>
      </div>
      
      {/* Logger Panel - HIDDEN ON MOBILE */}
      <GlassCard className="flex-1 hidden lg:flex flex-col h-full overflow-hidden">
         <div className="font-mono text-xs space-y-2 h-full flex flex-col">
             <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2 shrink-0">
                 <h3 className="text-white font-semibold">Simulator Terminal</h3>
                 <span className="text-green-400">● Live</span>
             </div>
             <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
               {debugLog.map((log, i) => (
                 <div key={i} className="text-gray-400 break-words border-l border-white/10 pl-2 mb-1">
                   <span className="text-brand-500 mr-2">{new Date().toLocaleTimeString()}</span>
                   {log}
                 </div>
               ))}
             </div>
         </div>
      </GlassCard>
    </div>
  );
};