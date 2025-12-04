import React, { useState, useRef } from 'react';
import { Property, PropertyStatus, PropertyMedia, PropertyDocument } from '../types';
import { GlassCard } from './GlassCard';
import { MapPin, Home, Maximize2, Plus, Sparkles, X, Check, Trash2, Edit, UploadCloud, FileText, Image as ImageIcon, Film, Bath } from 'lucide-react';
import { generatePropertyDescription } from '../services/geminiService';

interface InventoryViewProps {
  properties: Property[];
  onAddProperty: (p: Property) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ properties, onAddProperty, onUpdateProperty, onDeleteProperty }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const initialFormState: Partial<Property> = {
    title: '',
    location: '',
    price: '',
    type: 'Apartment',
    bhk: '3',
    bathrooms: '3',
    furnishing: 'Semi Furnished',
    size: '',
    features: [],
    description: '',
    status: PropertyStatus.AVAILABLE,
    media: [],
    documents: []
  };

  const [formData, setFormData] = useState<Partial<Property>>(initialFormState);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingId(prop.id);
    setFormData({ ...prop });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property from inventory?')) {
      onDeleteProperty(id);
    }
  };

  // --- File Handling Logic ---

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newMedia: PropertyMedia[] = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        type: file.type.startsWith('video') ? 'video' : 'image',
        url: URL.createObjectURL(file), // Create local preview blob
        file: file
      }));
      setFormData(prev => ({ ...prev, media: [...(prev.media || []), ...newMedia] }));
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        
        // For PDFs, we want to read as DataURL to get Base64 for the API
        reader.onload = (event) => {
           const result = event.target?.result as string;
           const base64Data = result.split(',')[1]; // Remove "data:application/pdf;base64," prefix
           
           const newDoc: PropertyDocument = {
             id: Math.random().toString(36).substr(2, 9),
             name: file.name,
             type: 'pdf',
             content: `(PDF File: ${file.name})`, // Fallback display text
             base64: base64Data,
             mimeType: file.type || 'application/pdf',
             url: URL.createObjectURL(file)
           };
           setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), newDoc] }));
        };
        
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (id: string) => {
    setFormData(prev => ({ ...prev, media: prev.media?.filter(m => m.id !== id) }));
  };

  const removeDoc = (id: string) => {
    setFormData(prev => ({ ...prev, documents: prev.documents?.filter(d => d.id !== id) }));
  };

  // --- End File Handling ---

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.location) return;
    
    setIsGenerating(true);
    const desc = await generatePropertyDescription(
      formData.title!,
      formData.location!,
      formData.features || [],
      `${formData.bhk} BHK ${formData.type}`,
      formData.price || 'Price on Request'
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalProp: Property = {
        id: editingId || Math.random().toString(36).substr(2, 9),
        title: formData.title || 'Untitled Property',
        location: formData.location || 'Unknown',
        price: formData.price || 'TBD',
        type: formData.type || 'Apartment',
        bhk: formData.bhk || '3',
        bathrooms: formData.bathrooms || '3',
        furnishing: formData.furnishing || 'Semi Furnished',
        size: formData.size || 'N/A',
        status: formData.status || PropertyStatus.AVAILABLE,
        description: formData.description || '',
        features: formData.features || [],
        media: formData.media || [],
        documents: formData.documents || []
    };

    if (editingId) {
      onUpdateProperty(finalProp);
    } else {
      onAddProperty(finalProp);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Property Inventory</h2>
          <p className="text-gray-400 text-sm">Manage listings, upload brochures, and train the AI.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus size={18} /> Add Entity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <GlassCard key={prop.id} className="group hover:border-brand-500/30 transition-all duration-300 flex flex-col h-full" noPadding>
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl shrink-0 bg-gray-900">
              {prop.media && prop.media.length > 0 ? (
                prop.media[0].type === 'video' ? (
                   <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                      <Film size={32} />
                   </div>
                ) : (
                  <img 
                    src={prop.media[0].url} 
                    alt={prop.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">
                  <ImageIcon size={32} />
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex gap-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleOpenEdit(prop); }}
                   className="p-1.5 bg-black/50 backdrop-blur-md rounded text-white hover:bg-brand-600 transition-colors"
                 >
                   <Edit size={14} />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleDelete(prop.id); }}
                   className="p-1.5 bg-black/50 backdrop-blur-md rounded text-white hover:bg-red-600 transition-colors"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider backdrop-blur-md ${
                  prop.status === PropertyStatus.AVAILABLE ? 'bg-green-500/80 text-white' :
                  prop.status === PropertyStatus.SOLD ? 'bg-red-500/80 text-white' :
                  'bg-yellow-500/80 text-white'
                }`}>
                  {prop.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-white group-hover:text-brand-glow transition-colors line-clamp-1">{prop.title}</h3>
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <MapPin size={12} className="mr-1" />
                    {prop.location}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-lg font-bold text-white">{prop.price}</p>
                </div>
              </div>

              <div className="flex gap-3 my-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Home size={12}/> {prop.bhk} BHK</span>
                  <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Bath size={12}/> {prop.bathrooms} Bath</span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{prop.description}</p>

              <div className="flex gap-4 border-t border-glass-border pt-4 mt-auto justify-between">
                <div className="flex items-center text-gray-400 text-xs">
                  <Maximize2 size={14} className="mr-1.5 text-brand-500" />
                  {prop.size}
                </div>
                 {prop.documents.length > 0 && (
                  <div className="flex items-center text-brand-400 text-xs" title={`${prop.documents.length} docs available for AI`}>
                    <FileText size={14} className="mr-1.5" />
                    {prop.documents.length} Docs
                  </div>
                 )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Property Title</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
                      placeholder="e.g. Sobha Opal Penthouse"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Price</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
                          placeholder="e.g. 1.5 Cr"
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                      <div>
                         <label className="block text-xs text-gray-400 mb-1">Location</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
                          placeholder="e.g. Koramangala"
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Type</label>
                         <select
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500 text-sm appearance-none"
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                          <option className="bg-neutral-900 text-white" value="Apartment">Apartment</option>
                          <option className="bg-neutral-900 text-white" value="Villa">Villa</option>
                          <option className="bg-neutral-900 text-white" value="Penthouse">Penthouse</option>
                          <option className="bg-neutral-900 text-white" value="Plot">Plot</option>
                        </select>
                      </div>
                       <div>
                        <label className="block text-xs text-gray-400 mb-1">BHK</label>
                         <select
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500 text-sm appearance-none"
                          value={formData.bhk}
                          onChange={e => setFormData({...formData, bhk: e.target.value})}
                        >
                          <option className="bg-neutral-900 text-white" value="1">1 BHK</option>
                          <option className="bg-neutral-900 text-white" value="2">2 BHK</option>
                          <option className="bg-neutral-900 text-white" value="3">3 BHK</option>
                          <option className="bg-neutral-900 text-white" value="4">4 BHK</option>
                          <option className="bg-neutral-900 text-white" value="5+">5+ BHK</option>
                        </select>
                      </div>
                       <div>
                        <label className="block text-xs text-gray-400 mb-1">Baths</label>
                        <input 
                          type="number" 
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
                          value={formData.bathrooms}
                          onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                        />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs text-gray-400 mb-1">Furnishing</label>
                         <select
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500 text-sm appearance-none"
                          value={formData.furnishing}
                          onChange={e => setFormData({...formData, furnishing: e.target.value as any})}
                        >
                          <option className="bg-neutral-900 text-white" value="Unfurnished">Unfurnished</option>
                          <option className="bg-neutral-900 text-white" value="Semi Furnished">Semi Furnished</option>
                          <option className="bg-neutral-900 text-white" value="Fully Furnished">Fully Furnished</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Size (Sqft)</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
                          placeholder="e.g. 1850"
                          value={formData.size}
                          onChange={e => setFormData({...formData, size: e.target.value})}
                        />
                      </div>
                   </div>
                </div>
              </div>

              {/* Status & Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Listing Status</label>
                    <select
                      className="w-full bg-glass-100 border border-glass-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500 appearance-none"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as PropertyStatus})}
                    >
                      <option className="bg-neutral-900 text-white" value={PropertyStatus.AVAILABLE}>Available</option>
                      <option className="bg-neutral-900 text-white" value={PropertyStatus.UNDER_OFFER}>Under Offer</option>
                      <option className="bg-neutral-900 text-white" value={PropertyStatus.SOLD}>Sold</option>
                    </select>
                 </div>
                 <div className="md:col-span-2">
                     <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs text-gray-400">Description</label>
                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 disabled:opacity-50"
                      >
                        <Sparkles size={12} />
                        {isGenerating ? 'Generating...' : 'Auto-Generate with AI'}
                      </button>
                    </div>
                    <textarea 
                      rows={3}
                      className="w-full bg-glass-100 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 resize-none text-sm"
                      placeholder="Enter or generate property description..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>
              </div>

              <hr className="border-glass-border" />

              {/* UPLOADS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 
                 {/* Media Upload */}
                 <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                       <ImageIcon size={16} /> Photos & Videos
                    </label>
                    <div 
                      onClick={() => mediaInputRef.current?.click()}
                      className="border-2 border-dashed border-glass-border rounded-xl p-6 text-center hover:bg-white/5 hover:border-brand-500 transition-all cursor-pointer group"
                    >
                       <UploadCloud size={32} className="mx-auto text-gray-500 group-hover:text-brand-400 mb-2" />
                       <p className="text-sm text-gray-300">Click to upload photos/videos</p>
                       <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, MP4</p>
                       <input 
                         ref={mediaInputRef}
                         type="file" 
                         multiple 
                         accept="image/*,video/*"
                         className="hidden" 
                         onChange={handleMediaUpload}
                       />
                    </div>
                    
                    {/* Media Previews */}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                       {formData.media?.map((m) => (
                         <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden group">
                            {m.type === 'video' ? (
                               <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400"><Film size={20}/></div>
                            ) : (
                               <img src={m.url} alt="preview" className="w-full h-full object-cover" />
                            )}
                            <button 
                              type="button"
                              onClick={() => removeMedia(m.id)}
                              className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X size={12} />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Documents Upload */}
                 <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                       <FileText size={16} /> Documents (Brochures/Policies)
                    </label>
                    <div 
                      onClick={() => docInputRef.current?.click()}
                      className="border-2 border-dashed border-glass-border rounded-xl p-6 text-center hover:bg-white/5 hover:border-brand-500 transition-all cursor-pointer group"
                    >
                       <UploadCloud size={32} className="mx-auto text-gray-500 group-hover:text-brand-400 mb-2" />
                       <p className="text-sm text-gray-300">Click to upload PDFs</p>
                       <p className="text-xs text-gray-500 mt-1">Bot will read these to answer specific queries</p>
                       <input 
                         ref={docInputRef}
                         type="file" 
                         multiple 
                         accept=".pdf,.txt"
                         className="hidden" 
                         onChange={handleDocUpload}
                       />
                    </div>

                    {/* Doc List */}
                    <div className="mt-4 space-y-2">
                       {formData.documents?.map((d) => (
                         <div key={d.id} className="flex justify-between items-center bg-glass-100 border border-glass-border p-2 rounded-lg">
                            <div className="flex items-center gap-2 overflow-hidden">
                               <FileText size={16} className="text-brand-400 shrink-0" />
                               <span className="text-xs text-gray-300 truncate">{d.name}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeDoc(d.id)}
                              className="text-gray-500 hover:text-red-400 p-1"
                            >
                              <X size={14} />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>

              </div>

              <div className="pt-6 border-t border-glass-border flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <Check size={16} /> {editingId ? 'Update' : 'Save'} Property
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};