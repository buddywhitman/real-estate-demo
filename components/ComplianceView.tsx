/*
  ===========================================================================================
  COMPLIANCE AUDITOR
  ===========================================================================================
  
  FUNCTIONALITY:
  - Upload PDF contracts/deeds.
  - AI scans for risk factors (clauses, missing signatures).
  
  AI PIPELINE:
  1. Frontend: Upload file -> Base64.
  2. Backend: `POST /api/compliance/audit`.
  3. AI Model: Gemini 2.5 Pro (preferred for long context window).
  
  NOTE:
  - Client-side PDF parsing is limited. In production, use a library like `pdf-parse` on the server 
    to extract text before sending to LLM to save tokens, or use Gemini 1.5 Pro which handles PDFs natively.
*/

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { FileCheck, UploadCloud, AlertTriangle, CheckCircle } from 'lucide-react';
import { checkCompliance } from '../services/geminiService';
import { ComplianceReport } from '../types';

export const ComplianceView: React.FC = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setIsAnalyzing(true);
          // Mocking read and analysis
          setTimeout(async () => {
             // Real logic would read file as base64 here
             const result = await checkCompliance("mock_base64", "application/pdf");
             // Overwrite mock result for demo
             setReport({
                id: '1',
                fileName: file.name,
                score: 85,
                flags: [
                    { severity: 'medium', text: 'Indemnity clause needs review' },
                    { severity: 'low', text: 'Page 4 footer missing' }
                ],
                summary: 'Document appears mostly compliant. Standard lease terms detected.'
             });
             setIsAnalyzing(false);
          }, 2000);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-semibold text-white">Compliance Auditor</h2>
       <p className="text-gray-400 text-sm">Scan contracts and deeds for risks before closing.</p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-glass-border hover:bg-white/5 transition-colors cursor-pointer relative">
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
             <UploadCloud size={48} className="text-brand-400 mb-4" />
             <p className="text-white font-medium">Drop Contract PDF Here</p>
             <p className="text-xs text-gray-500 mt-2">Max 10MB</p>
          </GlassCard>

          <GlassCard className="h-64 relative overflow-hidden">
             {isAnalyzing ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-gray-300">Auditing with Gemini...</p>
                 </div>
             ) : report ? (
                 <div className="h-full overflow-y-auto pr-2">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="text-white font-medium truncate max-w-[150px]">{report.fileName}</h4>
                          <p className="text-xs text-gray-400">Scan Complete</p>
                       </div>
                       <div className={`px-3 py-1 rounded text-xl font-bold ${report.score > 80 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {report.score}/100
                       </div>
                    </div>
                    
                    <p className="text-xs text-gray-300 italic mb-4 border-l-2 border-gray-600 pl-2">"{report.summary}"</p>
                    
                    <div className="space-y-2">
                       {report.flags.map((flag, i) => (
                          <div key={i} className={`flex gap-2 p-2 rounded text-xs ${flag.severity === 'high' ? 'bg-red-500/10 text-red-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                             <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                             {flag.text}
                          </div>
                       ))}
                       {report.flags.length === 0 && (
                          <div className="flex gap-2 p-2 rounded text-xs bg-green-500/10 text-green-300">
                             <CheckCircle size={14} /> No risks detected.
                          </div>
                       )}
                    </div>
                 </div>
             ) : (
                 <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Analysis results will appear here.</p>
                 </div>
             )}
          </GlassCard>
       </div>
    </div>
  );
};