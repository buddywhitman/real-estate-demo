import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Film, Upload, Play, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { generatePropertyTrailer } from '../services/geminiService';

interface VideoStudioViewProps {
  properties: Property[];
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({ properties }) => {
  const [selectedProp, setSelectedProp] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedProp) return;
    setIsGenerating(true);
    // Simulating context from selected property
    const prop = properties.find(p => p.id === selectedProp);
    if (prop && prop.media.length > 0) {
        // Use first image as base
        const videoUrl = await generatePropertyTrailer(`Luxury cinematic trailer for ${prop.title}, ${prop.type}`, prop.media[0].url);
        setGeneratedVideo(videoUrl);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-semibold text-white">AI Video Studio</h2>
        <p className="text-gray-400 text-sm">Create property trailers and social media reels by stitching assets.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="h-fit">
                <h3 className="font-medium text-white mb-4">Configuration</h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs text-gray-400 block mb-1">Select Property</label>
                      <select 
                         className="w-full bg-glass-100 border border-glass-border rounded p-2 text-white"
                         onChange={(e) => setSelectedProp(e.target.value)}
                      >
                         <option value="">-- Choose Property --</option>
                         {properties.map(p => <option key={p.id} value={p.id} className="text-black">{p.title}</option>)}
                      </select>
                   </div>
                   
                   <div className="p-4 border border-dashed border-glass-border rounded-lg text-center cursor-pointer hover:bg-white/5">
                      <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                      <p className="text-xs text-gray-400">Add Extra B-Roll</p>
                   </div>
                   
                   <button 
                     onClick={handleGenerate}
                     disabled={!selectedProp || isGenerating}
                     className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-pink-500/20 disabled:opacity-50"
                   >
                     {isGenerating ? 'Rendering with Veo...' : 'Generate Trailer'}
                   </button>
                </div>
            </GlassCard>

            <div className="lg:col-span-2">
               <div className="aspect-video bg-black rounded-xl overflow-hidden border border-glass-border relative flex items-center justify-center">
                  {generatedVideo ? (
                      <video src={generatedVideo} controls autoPlay className="w-full h-full object-cover" />
                  ) : (
                      <div className="text-center opacity-50">
                         <Film size={48} className="mx-auto mb-2 text-gray-600" />
                         <p className="text-sm text-gray-500">Preview will appear here</p>
                      </div>
                  )}
                  {isGenerating && (
                     <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                        <Sparkles className="text-brand-400 animate-spin mb-2" size={32} />
                        <p className="text-white text-sm">AI is stitching scenes...</p>
                     </div>
                  )}
               </div>
            </div>
        </div>
    </div>
  );
};
