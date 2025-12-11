/*
  ===========================================================================================
  AI & BACKEND SERVICE LAYER
  ===========================================================================================
  
  CURRENT STATE (DEMO):
  - Uses Google Gemini API (`@google/genai`) directly from the browser.
  - This is for demonstration purposes to show capability without backend setup.
  
  PRODUCTION ARCHITECTURE (AGENCY INFRA):
  - **Frontend** should NOT call Gemini/OpenAI directly.
  - **Frontend** calls **Dedicated Backend API** (`/api/chat`).
  - **Backend** proxies request to **Dify API** (Port 20081).
  
  HYBRID AI STRATEGY (IMPLEMENTED IN DIFY):
  1. **Tier 1 (Llama 3.2 via Ollama):**
     - Use for: Greetings, FAQ, Price lookups, basic filtering.
     - Latency: < 200ms.
     - Cost: $0.
  2. **Tier 2 (Gemini Pro / GPT-4):**
     - Use for: Complex reasoning, "Magic Drafts", Compliance Audits, Image Vision.
     - Latency: 1-3s.
     - Cost: Usage-based.
  
  DATA STORAGE:
  - **Images/Docs:** Upload to **MinIO** bucket `agency-assets`.
  - **Vectors:** Dify automatically stores embeddings in **Postgres (pgvector)**.
*/

import { GoogleGenAI, Type } from "@google/genai";
import { Property, Lead, LeadStatus, ComplianceReport, ScrapedListing, AppSettings } from '../types';
import { CODEBASE_CONTEXT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Support Bot ---
export const askSupportBot = async (userQuery: string): Promise<string> => {
  // PROD: Call Dify App ID configured for "Internal Support"
  // Route: POST /api/dify/support
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        SYSTEM CONTEXT:
        ${CODEBASE_CONTEXT}
        
        USER QUESTION: ${userQuery}
        
        ANSWER: Provide a helpful, concise answer explaining how to use the feature or how the system works. Use markdown formatting.
      `,
    });
    return response.text || "I couldn't find an answer in the documentation.";
  } catch (error) {
    return "Support system is currently offline.";
  }
};

// --- Image Generation / Visualization ---
export const visualizeProperty = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // PROD:
    // 1. Upload base64Image to MinIO -> Get URL.
    // 2. Call Dify Workflow "Virtual Staging".
    // 3. Dify calls Gemini/Imagen via Tool.
    // 4. Result stored in MinIO -> URL returned.
    
    const finalPrompt = `
      Create a PHOTOREALISTIC 8K render based on this image. 
      Goal: ${prompt}.
      Keep the structural integrity (walls, windows) exactly the same.
      Lighting should be natural and high-end. 
      Textures should be hyper-realistic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: finalPrompt }
        ]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"; 

  } catch (error) {
    console.error("Visualization Error:", error);
    return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"; 
  }
};

// --- Video Generation ---
export const generatePropertyTrailer = async (prompt: string, imageBase64: string): Promise<string> => {
  try {
     const finalPrompt = `Photorealistic 4k Cinematic real estate trailer: ${prompt}. Smooth camera movements. High luxury feel.`;
     let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: finalPrompt,
        image: {
            imageBytes: imageBase64,
            mimeType: 'image/jpeg'
        },
        config: {
           numberOfVideos: 1,
           resolution: '720p',
           aspectRatio: '16:9'
        }
     });
     
     // PROD: This is a long-running job. Use n8n or Temporal.io to poll status.
     return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"; 
  } catch (error) {
     console.error("Video Gen Error:", error);
     return "";
  }
};

// --- Compliance ---
export const checkCompliance = async (fileBase64: string, mimeType: string): Promise<ComplianceReport> => {
  try {
    // PROD: Use Gemini 1.5 Pro (2M Context) for large PDF contracts.
    // Llama 3.2 is likely too small for complex legal logic unless finetuned.
    const prompt = `
      Analyze this real estate document for compliance risks.
      Check for:
      1. Missing signatures
      2. Risky clauses (indemnity, termination)
      3. Incorrect dates
      4. Illegible text
      
      Return JSON:
      {
        "score": number (0-100, 100 is safe),
        "flags": [{"severity": "high"|"medium"|"low", "text": "string"}],
        "summary": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: fileBase64 } },
          { text: prompt }
        ]
      },
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
       id: 'error',
       fileName: 'Error',
       score: 0,
       flags: [{ severity: 'high', text: 'Analysis Failed' }],
       summary: 'Could not process document.'
    };
  }
};

// --- CRM & Insights ---
export const findTopLeads = async (leads: Lead[], strategy: string): Promise<{topIds: string[], reason: string}> => {
    const leadsSummary = leads.map(l => `ID: ${l.id}, Name: ${l.name}, Budget: ${l.budget}, Summary: ${l.conversationSummary}`).join('\n');
    
    // PROD: This query can be heavy. Use n8n to batch process leads nightly.
    const prompt = `
      Act as a high-end Real Estate Sales Director.
      Analyze these leads and identify the top 5% (or best matches) based on this strategy: "${strategy}".
      
      LEADS:
      ${leadsSummary}
      
      Return JSON: { "topIds": ["id1", "id2"], "reason": "Strategic explanation" }
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    return JSON.parse(response.text || '{"topIds": [], "reason": ""}');
};

export const generatePersonalizedEmail = async (leads: Lead[], properties: Property[], platform: 'EMAIL' | 'WHATSAPP', settings: AppSettings): Promise<string> => {
   // DIFY INTEGRATION:
   // Create a Dify App type "Text Generator".
   // Inputs: `leads_data`, `property_data`, `agent_signature`, `tone`.
   // Model: Gemini Pro (Best for creative writing).
   
   const names = leads.map(l => l.name).join(', ');
   const props = properties.map(p => p.title).join(', ');
   
   const context = `
     CLIENTS: ${names}
     PROPERTIES: ${props}
     PLATFORM: ${platform}
   `;

   const identity = `
     MY IDENTITY (Use these details for signature/context):
     Name: ${settings.agentName || 'The Broker'}
     Brokerage: ${settings.brokerageName || 'Guaq Realty'}
     Phone: ${settings.agentPhone || ''}
     Email: ${settings.agentEmail || ''}
     Website: ${settings.agentWebsite || ''}
   `;

   const tonePrompt = platform === 'EMAIL' 
     ? 'Professional, exclusive, slightly detailed, use bullet points for features. Subject line included.' 
     : 'Short, punchy, conversational, use emojis, mobile-friendly format. No subject line.';

   const prompt = `
     Write a personalization draft message from a luxury broker.
     
     CONTEXT:
     ${context}
     
     ${identity}
     
     TONE GUIDELINES:
     ${tonePrompt}
     
     IMPORTANT: 
     - Use the provided identity details for the signature. 
     - If a detail (like website) is missing, do not include a placeholder for it.
     - If multiple clients/properties, write a TEMPLATE that works for this segment.
   `;
   
   const response = await ai.models.generateContent({
     model: 'gemini-2.5-flash',
     contents: prompt,
   });
   
   return response.text || "Could not generate draft.";
};

export const generateSellerPitch = async (listing: ScrapedListing, buyerCount: number, platform: 'EMAIL' | 'WHATSAPP', settings: AppSettings): Promise<string> => {
    const tonePrompt = platform === 'EMAIL' 
      ? 'Formal business inquiry. Concise but professional.' 
      : 'Casual, direct, use emojis. Like a neighbor reaching out.';

    const identity = `
     MY IDENTITY:
     Name: ${settings.agentName || 'The Broker'}
     Brokerage: ${settings.brokerageName || 'Guaq Realty'}
     Phone: ${settings.agentPhone || ''}
     Email: ${settings.agentEmail || ''}
     Website: ${settings.agentWebsite || ''}
   `;

    const prompt = `
      Write a cold message to a property owner selling their property on ${listing.source}.
      
      PROPERTY: ${listing.title} at ${listing.location} for ${listing.price}.
      VALUE PROP: I have ${buyerCount} qualified buyers.
      PLATFORM: ${platform}
      TONE: ${tonePrompt}
      
      ${identity}
      
      GOAL: Get a meeting.
      
      IMPORTANT: Use the provided identity details for the signature. Do not use placeholders like [Your Name].
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate pitch.";
};

// --- Core Gatekeeper ---
export const generatePropertyDescription = async (
  title: string,
  location: string,
  features: string[],
  type: string,
  price: string
): Promise<string> => {
  try {
    const prompt = `
      Write a compelling, luxury real estate description for a property with the following details:
      Title: ${title}
      Location: ${location}
      Type: ${type}
      Price: ${price}
      Key Features: ${features.join(', ')}

      The tone should be sophisticated, exclusive, and persuasive. Keep it under 150 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Description generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description at this time.";
  }
};

export interface GatekeeperResponse {
  botReply: string;
  suggestedProperties?: Property[];
  action?: 'CREATE_LEAD' | 'UPDATE_LEAD' | 'NONE' | 'STOP_AI';
  extractedData?: Partial<Lead>;
}

export const gatekeeperChat = async (
  userMessage: string,
  chatHistory: { sender: 'user' | 'bot', text: string }[],
  inventory: Property[],
  enableAiBooking: boolean = true
): Promise<GatekeeperResponse> => {
  
  // DIFY / OLLAMA IMPLEMENTATION GUIDE:
  // 
  // 1. **Dify Workflow**: Create a workflow in Dify that takes `userMessage` and `chatHistory`.
  // 2. **Intent Classification**: Use a Dify "Classifier" node to check intent.
  //    - If intent is "Greeting" or "General FAQ" -> Route to **Llama 3.2 (Ollama)**.
  //    - If intent is "Property Inquiry" or "Negotiation" -> Route to **Gemini Pro**.
  // 3. **RAG**: The Dify Knowledge Base (Postgres/pgvector) will automatically retrieve relevant property docs.
  // 4. **API Call**:
  //    const res = await fetch(`${process.env.DIFY_API_URL}/v1/chat-messages`, {
  //        headers: { 'Authorization': `Bearer ${client.dify_api_key}` },
  //        body: JSON.stringify({ query: userMessage, inputs: { enableAiBooking }, ... })
  //    });
  
  const conversationText = (userMessage + " " + (chatHistory.map(m => m.text).join(" "))).toLowerCase();
  const relevantProperty = inventory.find(p => conversationText.includes(p.title.toLowerCase()));

  const inventorySummary = inventory.map(p => 
    `ID: ${p.id} | Name: ${p.title} | Loc: ${p.location} | Price: ${p.price} | Type: ${p.bhk} BHK`
  ).join('\n');

  const historyText = chatHistory.slice(-6).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');

  const systemInstruction = `
    You are "Guaq AI", an intelligent Real Estate Gatekeeper Bot for a luxury brokerage.
    
    INVENTORY SUMMARY:
    ${inventorySummary}
    
    BOOKING ENABLED: ${enableAiBooking}

    RULES:
    1. NAME CAPTURE: If confidence score > 75 or user shows strong interest, you MUST ask for their Name, Budget, and Handover Timeline if unknown.
    2. VISUALIZATION: If user says "visualize" or "how would this look", suggest they try the visualization tool or describe it vividly.
    3. MATCHING: Search inventory. If matches found, return them in the 'interestedIn' field.
    4. SCHEDULING: 
       - If booking is DISABLED, say "I will have the broker contact you to schedule."
       - If booking is ENABLED, ask for Name + Preferred Time. ONLY set status to 'SITE_VISIT_SCHEDULED' if you have both.
    5. MANUAL INTERVENTION: If user is frustrated or asks for human, set Action 'STOP_AI'.
    
    Output JSON format:
    {
      "botReply": "string",
      "action": "CREATE_LEAD" | "UPDATE_LEAD" | "NONE" | "STOP_AI",
      "extractedData": {
        "name": "string",
        "budget": "string",
        "interestedIn": ["string"],
        "confidenceScore": number (0-100),
        "status": "LeadStatus",
        "siteVisitTime": "string"
      }
    }
  `;

  const contentParts: any[] = [];
  if (relevantProperty?.documents) {
     relevantProperty.documents.forEach(doc => {
        if (doc.base64 && doc.mimeType === 'application/pdf') {
           contentParts.push({ inlineData: { data: doc.base64, mimeType: 'application/pdf' } });
           contentParts.push({ text: `[System: Context from ${doc.name}]` });
        } else {
           contentParts.push({ text: `[Doc Content]: ${doc.content}` });
        }
     });
  }
  contentParts.push({ text: `HISTORY:\n${historyText}\nUSER: ${userMessage}` });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentParts,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            botReply: { type: Type.STRING },
            action: { type: Type.STRING },
            extractedData: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                budget: { type: Type.STRING },
                interestedIn: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidenceScore: { type: Type.NUMBER },
                status: { type: Type.STRING },
                siteVisitTime: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const suggestions: Property[] = [];
    if (parsed.extractedData?.interestedIn) {
        parsed.extractedData.interestedIn.forEach((title: string) => {
            const match = inventory.find(p => p.title.toLowerCase().includes(title.toLowerCase()));
            if(match) suggestions.push(match);
        });
    }

    return {
      botReply: parsed.botReply,
      action: parsed.action,
      extractedData: parsed.extractedData,
      suggestedProperties: suggestions
    };

  } catch (error) {
    console.error("Gatekeeper Error:", error);
    return {
      botReply: "I'm connecting you to a specialist immediately.",
      action: 'STOP_AI',
      extractedData: { status: LeadStatus.STOP_AI, confidenceScore: 0 }
    };
  }
};