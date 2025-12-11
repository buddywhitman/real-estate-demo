/*
  ===========================================================================================
  AI MEDIA STUDIO (VIRTUAL STAGING & VIDEO)
  ===========================================================================================
  
  FUNCTIONALITY:
  - Virtual Staging: Takes an empty room image + prompt -> Furnished room.
  - Video Generation: Takes property image/prompt -> 4K Trailer (Veo).
  
  ARCHITECTURE:
  - Image Gen: Synchronous or fast-async. `gemini-flash-image` is usually fast enough for direct return.
  - Video Gen: LONG RUNNING PROCESS.
    > Frontend sends start request -> Backend returns Job ID.
    > Frontend polls status `GET /api/jobs/:id` every 5s.
    > When done, Backend returns Cloud Storage URL.
  
  API ROUTES:
  - POST /api/media/stage
  - POST /api/media/video-start
  - GET /api/media/video-status/:id
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Film, Upload, Play, Sparkles, Image as ImageIcon, Wand2, MonitorPlay, RefreshCw } from 'lucide-react';
import { Property } from '../types';
import { generatePropertyTrailer, visualizeProperty } from '../services/geminiService';

interface MediaStudioViewProps {
  properties: Property[];
}

export const MediaStudioView: React.FC<MediaStudioViewProps> = ({ properties }) => {
  const [activeMode, setActiveMode] = useState<'video' | 'staging'>('staging');
  
  // Video State
  const [selectedProp, setSelectedProp] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<string>('');
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);

  // Staging State
  const [stagingPrompt, setStagingPrompt] = useState('Modern Scandinavian minimalist interior with beige sofa, photorealistic 8k render');
  const [stagingImage, setStagingImage] = useState<string | null>(null); // The uploaded base64
  const [stagedResult, setStagedResult] = useState<string | null>(null);
  const [isStagingGenerating, setIsStagingGenerating] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');

  const handleVideoGenerate = async () => {
    if (!selectedProp) return;
    setIsVideoGenerating(true);
    const prop = properties.find(p => p.id === selectedProp);
    if (prop && prop.media.length > 0) {
        // Use first image as base
        const videoUrl = await generatePropertyTrailer(`Luxury cinematic trailer for ${prop.title}, ${prop.type}, photorealistic 4k`, "mock_base64");
        setGeneratedVideo(videoUrl);
    }
    setIsVideoGenerating(false);
  };

  const handleStagingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
           const result = evt.target?.result as string;
           setStagingImage(result);
           setStagedResult(null); // Reset previous result
        };
        reader.readAsDataURL(file);
     }
  };

  const handleStagingGenerate = async () => {
     if (!stagingImage) return;
     setIsStagingGenerating(true);
     // Extract base64 content
     const base64 = stagingImage.split(',')[1];
     const promptToUse = refinePrompt ? `${stagingPrompt}. Modification: ${refinePrompt}` : stagingPrompt;
     
     const result = await visualizeProperty(base64, promptToUse);
     setStagedResult(result);
     setIsStagingGenerating(false);
     setRefinePrompt(''); // Clear refine input after use
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-2xl font-semibold text-white">AI Media Studio</h2>
                <p className="text-gray-400 text-sm">Generate marketing assets: Virtual Staging & Video Trailers.</p>
            </div>
            <div className="bg-glass-100 p-1 rounded-lg flex w-full sm:w-auto gap-1 border border-glass-border">
                <button 
                  onClick={() => setActiveMode('staging')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeMode === 'staging' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                   <div className="flex items-center justify-center gap-2"><ImageIcon size={16}/> Virtual Staging</div>
                </button>
                <button 
                  onClick={() => setActiveMode('video')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeMode === 'video' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                   <div className="flex items-center justify-center gap-2"><Film size={16}/> Video Studio</div>
                </button>
            </div>
        </div>

        {activeMode === 'staging' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="h-fit space-y-4">
                 <h3 className="text-white font-medium flex items-center gap-2"><Wand2 size={18} className="text-purple-400"/> Staging Config</h3>
                 
                 <div>
                    <label className="text-xs text-gray-400 block mb-2">1. Upload Empty Room</label>
                    <div className="border-2 border-dashed border-glass-border rounded-lg p-6 text-center hover:bg-white/5 cursor-pointer relative group">
                        <Upload size={24} className="mx-auto text-gray-500 mb-2 group-hover:text-brand-400" />
                        <p className="text-xs text-gray-400">Click to upload JPG/PNG</p>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleStagingUpload} />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs text-gray-400 block mb-2">2. Describe Style</label>
                    <textarea 
                       value={stagingPrompt}
                       onChange={(e) => setStagingPrompt(e.target.value)}
                       className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white text-sm focus:border-brand-500 outline-none h-24 resize-none"
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                       <button onClick={() => setStagingPrompt('Bohemian chic with plants and rugs, photorealistic')} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 hover:text-white">Boho</button>
                       <button onClick={() => setStagingPrompt('Modern luxury office with mahogany desk, photorealistic')} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 hover:text-white">Office</button>
                       <button onClick={() => setStagingPrompt('Cozy bedroom with warm lighting, photorealistic')} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 hover:text-white">Bedroom</button>
                    </div>
                 </div>

                 <button 
                   onClick={handleStagingGenerate}
                   disabled={!stagingImage || isStagingGenerating}
                   className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
                 >
                   {isStagingGenerating ? 'Furnishing Room...' : 'Generate Staging'}
                 </button>
              </GlassCard>

              <div className="lg:col-span-2 space-y-4">
                 <GlassCard className="h-[400px] flex items-center justify-center relative overflow-hidden bg-black/40">
                    {!stagingImage && !stagedResult && (
                        <div className="text-center opacity-40">
                           <ImageIcon size={64} className="mx-auto mb-4" />
                           <p>Upload an image to start magic staging</p>
                        </div>
                    )}
                    
                    {stagingImage && !stagedResult && (
                       <img src={stagingImage} className={`max-h-full max-w-full object-contain ${isStagingGenerating ? 'animate-pulse opacity-50' : ''}`} />
                    )}

                    {stagedResult && (
                       <div className="relative w-full h-full group">
                          <img src={stagedResult} className="w-full h-full object-contain" />
                          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-white">
                             AI Generated Staging
                          </div>
                       </div>
                    )}

                    {isStagingGenerating && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <Sparkles className="text-purple-400 animate-spin mb-2" size={32} />
                          <p className="text-white text-sm font-medium shadow-black drop-shadow-md">Adding furniture...</p>
                       </div>
                    )}
                 </GlassCard>

                 {stagedResult && (
                     <GlassCard>
                         <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2"><RefreshCw size={14} className="text-brand-400"/> Refine Result</h4>
                         <div className="flex flex-col sm:flex-row gap-2">
                             <input 
                                type="text" 
                                placeholder="E.g. Change the sofa to blue velvet, make lighting warmer..." 
                                className="flex-1 bg-glass-100 border border-glass-border rounded-lg px-3 py-2 text-sm text-white"
                                value={refinePrompt}
                                onChange={(e) => setRefinePrompt(e.target.value)}
                             />
                             <button 
                                onClick={handleStagingGenerate}
                                className="bg-brand-600 px-4 py-2 rounded-lg text-sm text-white hover:bg-brand-500"
                                disabled={isStagingGenerating}
                             >
                                 Update
                             </button>
                         </div>
                     </GlassCard>
                 )}
              </div>
           </div>
        )}

        {activeMode === 'video' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="h-fit">
                <h3 className="font-medium text-white mb-4 flex items-center gap-2"><MonitorPlay size={18} className="text-pink-400"/> Video Config</h3>
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
                     onClick={handleVideoGenerate}
                     disabled={!selectedProp || isVideoGenerating}
                     className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-pink-500/20 disabled:opacity-50"
                   >
                     {isVideoGenerating ? 'Rendering with Veo...' : 'Generate Trailer'}
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
                  {isVideoGenerating && (
                     <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                        <Sparkles className="text-brand-400 animate-spin mb-2" size={32} />
                        <p className="text-white text-sm">AI is stitching scenes...</p>
                     </div>
                  )}
               </div>
            </div>
        </div>
        )}
    </div>
  );
};