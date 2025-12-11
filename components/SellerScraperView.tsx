/*
  ===========================================================================================
  SELLER SCRAPER & ACQUISITION TOOL
  ===========================================================================================
  
  FUNCTIONALITY:
  - Finds owner-listed properties on portals (MagicBricks, NoBroker).
  - Uses AI to match these listings against internal `Leads` database.
  - Generates "Buyer-First" pitch messages.
  
  MIGRATION & ARCHITECTURE:
  - Client-side scraping is insecure/unreliable due to CORS.
  - PRODUCTION: 
    1. `Run Scraper` -> Calls `POST /api/scraper/start`.
    2. Backend triggers a cloud function (Puppeteer/Playwright or Apify).
    3. Results are stored in a `potential_listings` table.
    4. Frontend polls `GET /api/scraper/results`.
  
  DATA PRIVACY:
  - Ensure scraped data usage complies with portal TOS and local privacy laws.
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Search, ExternalLink, Phone, Mail, Users, MessageSquare } from 'lucide-react';
import { ScrapedListing, Lead, AppSettings } from '../types';
import { generateSellerPitch } from '../services/geminiService';
import { MOCK_LEADS } from '../constants'; // Using mock buyers for matching

interface SellerScraperViewProps {
    settings?: AppSettings;
}

export const SellerScraperView: React.FC<SellerScraperViewProps> = ({ settings }) => {
  // Mock Data with new fields
  const [listings, setListings] = useState<ScrapedListing[]>([
      { id: '1', source: 'MagicBricks', title: '3BHK Owner Resale', location: 'Indiranagar', price: '2.5 Cr', ownerName: 'Rajesh Kumar', contact: '+91 98***', url: '#', predictedMotivation: 'High', matchingBuyerCount: 4 },
      { id: '2', source: 'NoBroker', title: 'Villa Plot', location: 'Whitefield', price: '1.2 Cr', ownerName: 'Amit Singh', contact: '+91 88***', url: '#', predictedMotivation: 'Medium', matchingBuyerCount: 2 },
      { id: '3', source: '99acres', title: 'Commercial Office Space', location: 'MG Road', price: '5.5 Cr', ownerName: 'Vikram Enterprises', contact: '+91 77***', url: '#', predictedMotivation: 'High', matchingBuyerCount: 8 },
      { id: '4', source: 'Housing', title: '2BHK Apartment', location: 'HSR Layout', price: '95 L', ownerName: 'Sneha P', contact: '+91 99***', url: '#', predictedMotivation: 'Low', matchingBuyerCount: 1 },
      { id: '5', source: 'NoBroker', title: 'Duplex Villa', location: 'Sarjapur', price: '3.1 Cr', ownerName: 'Col. Menon', contact: '+91 90***', url: '#', predictedMotivation: 'Medium', matchingBuyerCount: 3 },
  ]);

  const [activePitch, setActivePitch] = useState<{id: string, text: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [platform, setPlatform] = useState<'EMAIL' | 'WHATSAPP'>('WHATSAPP');

  const handleGeneratePitch = async (listing: ScrapedListing) => {
     if (!settings) return;
     setIsGenerating(true);
     const pitch = await generateSellerPitch(listing, listing.matchingBuyerCount || 0, platform, settings);
     setActivePitch({ id: listing.id, text: pitch });
     setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white">Owner Finder & Intel</h2>
            <p className="text-gray-400 text-sm">Proactive listing acquisition powered by buyer matching.</p>
          </div>
          <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
             <Search size={16} /> Run Scraper
          </button>
       </div>
       
       {/* Filters */}
       <GlassCard className="flex flex-col sm:flex-row gap-4 p-4">
          <input type="text" placeholder="Location" className="w-full sm:w-auto bg-glass-100 border border-glass-border rounded px-3 py-2 text-white text-sm" />
          <input type="text" placeholder="Min Price" className="w-full sm:w-auto bg-glass-100 border border-glass-border rounded px-3 py-2 text-white text-sm" />
          <input type="text" placeholder="Max Price" className="w-full sm:w-auto bg-glass-100 border border-glass-border rounded px-3 py-2 text-white text-sm" />
       </GlassCard>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-white/5 text-xs uppercase text-gray-500">
                        <tr>
                        <th className="p-3 rounded-tl-lg">Source</th>
                        <th className="p-3">Property</th>
                        <th className="p-3">Motivation</th>
                        <th className="p-3">Matches</th>
                        <th className="p-3 text-right rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border">
                        {listings.map(l => (
                        <tr key={l.id} className={`hover:bg-white/5 cursor-pointer ${activePitch?.id === l.id ? 'bg-white/5' : ''}`}>
                            <td className="p-3"><span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-[10px]">{l.source}</span></td>
                            <td className="p-3 font-medium text-white">{l.title}<br/><span className="text-gray-500 font-normal">{l.location} • {l.price}</span></td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-[10px] ${
                                    l.predictedMotivation === 'High' ? 'bg-red-500/20 text-red-400' : 
                                    l.predictedMotivation === 'Medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                    {l.predictedMotivation}
                                </span>
                            </td>
                            <td className="p-3">
                                <div className="flex items-center gap-1 text-white font-bold">
                                    <Users size={14} className="text-brand-400"/> {l.matchingBuyerCount}
                                </div>
                            </td>
                            <td className="p-3 text-right flex justify-end gap-2">
                                <button 
                                    onClick={() => handleGeneratePitch(l)}
                                    className="px-3 py-1.5 bg-brand-600/20 text-brand-400 rounded hover:bg-brand-600 hover:text-white transition-colors text-xs flex items-center gap-1"
                                >
                                    <MessageSquare size={12}/> Pitch
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
           </div>

           <div className="lg:col-span-1">
                <GlassCard className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <MessageSquare size={18} className="text-green-400"/> AI Pitch
                        </h3>
                        <div className="flex bg-glass-100 rounded p-0.5">
                             <button onClick={() => setPlatform('WHATSAPP')} className={`text-[10px] px-2 py-1 rounded ${platform === 'WHATSAPP' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}>WhatsApp</button>
                             <button onClick={() => setPlatform('EMAIL')} className={`text-[10px] px-2 py-1 rounded ${platform === 'EMAIL' ? 'bg-white/20 text-white' : 'text-gray-400'}`}>Email</button>
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-black/30 rounded-lg border border-glass-border p-4 text-sm text-gray-300 relative overflow-y-auto min-h-[200px]">
                        {activePitch ? (
                             <div className="whitespace-pre-wrap">
                                 {activePitch.text}
                             </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 text-center p-4">
                                <p>Select a listing and click "Pitch" to generate a buyer-first outreach message.</p>
                            </div>
                        )}
                        {isGenerating && (
                             <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-xs text-white">Matching buyers...</p>
                             </div>
                        )}
                    </div>

                    {activePitch && (
                        <div className="mt-4 flex gap-2">
                            {platform === 'WHATSAPP' ? (
                                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(activePitch.text)}`, '_blank')} className="flex-1 py-2 bg-green-600 rounded text-white text-sm hover:bg-green-500">
                                    Send WhatsApp
                                </button>
                            ) : (
                                <button onClick={() => window.open(`mailto:?subject=Inquiry&body=${encodeURIComponent(activePitch.text)}`, '_blank')} className="flex-1 py-2 bg-blue-600 rounded text-white text-sm hover:bg-blue-500">
                                    Send Email
                                </button>
                            )}
                            <button className="flex-1 py-2 bg-white/10 rounded text-white text-sm hover:bg-white/20">
                                Copy
                            </button>
                        </div>
                    )}
                </GlassCard>
           </div>
       </div>
    </div>
  );
};