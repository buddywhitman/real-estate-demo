import { GoogleGenAI, Type } from "@google/genai";
import { Property, Lead, LeadStatus } from '../types';

// Hardcoded API key as requested by user for this environment
const ai = new GoogleGenAI({ apiKey: 'AIzaSyAc5B7LllMZwg-p7sSy_GrLytXBfxZTxVw' });

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
  inventory: Property[]
): Promise<GatekeeperResponse> => {
  
  // 1. Context Detection: Which property is the user talking about?
  let relevantProperty: Property | undefined;
  // Look at the full conversation history to find the active property context
  const conversationText = (userMessage + " " + (chatHistory.map(m => m.text).join(" "))).toLowerCase();
  
  relevantProperty = inventory.find(p => {
      // Robust matching: Check if the title appears in the conversation
      return conversationText.includes(p.title.toLowerCase());
  });

  // 2. Build Base Prompt
  const inventorySummary = inventory.map(p => 
    `ID: ${p.id} | Name: ${p.title} | Loc: ${p.location} | Price: ${p.price} | Type: ${p.bhk} BHK`
  ).join('\n');

  const historyText = chatHistory.slice(-6).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');

  const systemInstruction = `
    You are "Guaq AI", an intelligent Real Estate Gatekeeper Bot for a luxury brokerage.
    
    INVENTORY SUMMARY:
    ${inventorySummary}

    RULES:
    1. NAME CAPTURE: You MUST try to get the user's name early. If the user asks to schedule a site visit, you MUST ask for their name if you don't have it yet.
    2. FILTERING: If new user, ask Budget, Location, Config (BHK).
    3. MATCHING: Search inventory. If matches found, return them in the 'interestedIn' field. Set Action to 'UPDATE_LEAD'.
    4. MEDIA REQUESTS: If user asks for photos, videos, or brochures of a specific property, you MUST return that property ID in the 'interestedIn' list.
    5. DOCUMENT LOOKUP: If the user asks specific questions (maintenance, pets, gym rules) about a specific property, refer to the provided PDF documents.
    6. SCHEDULING: 
       - If user wants to visit, check if you have their NAME and a preferred TIME.
       - If MISSING Name or Time: Ask for it. DO NOT schedule yet.
       - If HAVE Name and Time: Parse natural language time into 'siteVisitTime'. Set Status to 'SITE_VISIT_SCHEDULED'. Set Action to 'UPDATE_LEAD'.
    7. MANUAL INTERVENTION: If the user asks a complex question you can't answer or seems frustrated, set Action to 'STOP_AI'.
    
    Output JSON format:
    {
      "botReply": "string (The chat response)",
      "action": "CREATE_LEAD" | "UPDATE_LEAD" | "NONE" | "STOP_AI",
      "extractedData": {
        "name": "string (The user's name if known)",
        "budget": "string",
        "interestedIn": ["string property titles"],
        "confidenceScore": number (0-100),
        "status": "LeadStatus",
        "siteVisitTime": "string (Natural language time preference)"
      }
    }
  `;

  // 3. Construct Payload
  // If we found a relevant property with PDF documents, attach them as inlineData
  const contentParts: any[] = [];

  if (relevantProperty && relevantProperty.documents.length > 0) {
     relevantProperty.documents.forEach(doc => {
        if (doc.base64 && doc.mimeType === 'application/pdf') {
           // Attach PDF for "Real Parsing"
           contentParts.push({
             inlineData: {
               data: doc.base64,
               mimeType: 'application/pdf'
             }
           });
           contentParts.push({ text: `[System: The above attachment is the official document for ${relevantProperty!.title}. Use it to answer the user's question.]` });
        } else {
           // Fallback for text documents
           contentParts.push({ text: `[Document Content for ${relevantProperty!.title}]: ${doc.content}` });
        }
     });
  }

  // Add History and User Message
  contentParts.push({ text: `
    CONVERSATION HISTORY:
    ${historyText}
    
    USER QUERY: ${userMessage}
  `});

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

    const text = response.text;
    if (!text) throw new Error("No response");
    
    const parsed = JSON.parse(text);
    
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
      botReply: "I'm having trouble processing that right now. Let me connect you with a human agent.",
      action: 'STOP_AI',
      extractedData: {
          status: LeadStatus.STOP_AI,
          confidenceScore: 0
      }
    };
  }
};