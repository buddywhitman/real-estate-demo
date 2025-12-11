import { Lead, LeadStatus, Property, PropertyStatus, ChartData } from './types';

export const MOCK_CHART_DATA: ChartData[] = [
  { label: 'Mon', leads: 4, visits: 1 },
  { label: 'Tue', leads: 7, visits: 2 },
  { label: 'Wed', leads: 3, visits: 0 },
  { label: 'Thu', leads: 8, visits: 3 },
  { label: 'Fri', leads: 12, visits: 4 },
  { label: 'Sat', leads: 15, visits: 8 },
  { label: 'Sun', leads: 10, visits: 6 },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Sobha Opal Penthouse',
    location: 'Koramangala, Bangalore',
    price: '4.5 Cr',
    type: 'Penthouse',
    bhk: '4',
    bathrooms: '4',
    furnishing: 'Fully Furnished',
    size: '3400 sqft',
    status: PropertyStatus.AVAILABLE,
    description: 'Ultra-luxury penthouse with 360-degree city views, private terrace, and Italian marble flooring.',
    features: ['Private Pool', 'Home Automation', 'Concierge'],
    media: [
        { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' }
    ],
    documents: [
        { id: 'd1', name: 'Sobha_Opal_Brochure.pdf', type: 'text', content: 'Detailed floor plans, marble specifications, and maintenance fee of 8Rs/sqft.' }
    ]
  },
  {
    id: '2',
    title: 'Prestige Pinewood',
    location: 'Koramangala, Bangalore',
    price: '1.8 Cr',
    type: 'Apartment',
    bhk: '3',
    bathrooms: '3',
    furnishing: 'Semi Furnished',
    size: '1850 sqft',
    status: PropertyStatus.UNDER_OFFER,
    description: 'Contemporary design with spacious balconies and access to a world-class clubhouse.',
    features: ['Clubhouse', 'Gym', 'Kids Play Area'],
    media: [
        { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?auto=format&fit=crop&w=800&q=80' }
    ],
    documents: []
  },
  {
    id: '3',
    title: 'Embassy Lake Terraces',
    location: 'Hebbal, Bangalore',
    price: '5.2 Cr',
    type: 'Sky Villa',
    bhk: '4',
    bathrooms: '5',
    furnishing: 'Unfurnished',
    size: '4200 sqft',
    status: PropertyStatus.AVAILABLE,
    description: 'Lake facing sky villa offering unparalleled serenity and luxury connectivity.',
    features: ['Lake View', 'Central AC', 'Servant Quarters'],
    media: [
        { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' }
    ],
    documents: []
  },
  {
    id: '4',
    title: 'Divyasree 77 East',
    location: 'Marathahalli',
    price: '6.5 Cr',
    type: 'Villa',
    bhk: '5+',
    bathrooms: '6',
    furnishing: 'Fully Furnished',
    size: '5000 sqft',
    status: PropertyStatus.SOLD,
    description: 'Exclusive villa community with private gardens and state of the art security.',
    features: ['Gated Community', 'Private Garden', 'Smart Security'],
    media: [
        { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80' }
    ],
    documents: []
  },
  {
    id: '5',
    title: 'Adarsh Palm Retreat',
    location: 'Bellandur',
    price: '3.2 Cr',
    type: 'Villa',
    bhk: '3',
    bathrooms: '3',
    furnishing: 'Semi Furnished',
    size: '2200 sqft',
    status: PropertyStatus.AVAILABLE,
    description: 'Spacious villa in a lush green gated community near IT parks.',
    features: ['Swimming Pool', 'Tennis Court', 'Clubhouse'],
    media: [
        { id: 'm5', type: 'image', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' }
    ],
    documents: []
  },
  {
    id: '6',
    title: 'Brigade Exotica',
    location: 'Old Madras Road',
    price: '1.9 Cr',
    type: 'Apartment',
    bhk: '3',
    bathrooms: '3',
    furnishing: 'Unfurnished',
    size: '2600 sqft',
    status: PropertyStatus.AVAILABLE,
    description: 'High-rise luxury apartment with panoramic views and eco-friendly architecture.',
    features: ['Forest View', 'Rooftop Garden', 'Jogging Track'],
    media: [
        { id: 'm6', type: 'image', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' }
    ],
    documents: []
  }
];

// GENERATED MOCK LEADS
const NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Anika", "Navya", "Angel", "Myra", "Riya"];
const LAST_NAMES = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Reddy", "Nair", "Iyer", "Kumar", "Das", "Mukherjee", "Rao", "Mehta", "Jain", "Saxena", "Chopra", "Desai", "Joshi", "Bhat"];
const PLATFORMS = ['Telegram', 'WhatsApp', 'Web'];
const STATUSES = [LeadStatus.NEW, LeadStatus.QUALIFIED, LeadStatus.COLD, LeadStatus.SITE_VISIT_SCHEDULED, LeadStatus.NEGOTIATION];

const generateLeads = (count: number): Lead[] => {
  const leads: Lead[] = [];
  for (let i = 0; i < count; i++) {
    const fn = NAMES[Math.floor(Math.random() * NAMES.length)];
    const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const conf = Math.floor(Math.random() * 100);
    
    leads.push({
      id: `gen_${i}`,
      name: `${fn} ${ln}`,
      platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)] as any,
      phone: `+91 ${9000000000 + i}`,
      budget: `${(Math.random() * 5 + 0.5).toFixed(1)} Cr`,
      interestedIn: [MOCK_PROPERTIES[Math.floor(Math.random() * MOCK_PROPERTIES.length)].title],
      status: status,
      lastActive: `${Math.floor(Math.random() * 24)}h ago`,
      conversationSummary: `Interested in ${status === LeadStatus.SITE_VISIT_SCHEDULED ? 'visiting' : 'buying'} a property. Budget confirmed.`,
      confidenceScore: conf,
      chatHistory: [],
      siteVisitTime: status === LeadStatus.SITE_VISIT_SCHEDULED ? 'Tomorrow 11 AM' : undefined
    });
  }
  return leads;
};

export const MOCK_LEADS: Lead[] = [
  ...generateLeads(25), // Generate 25 random leads
  {
    id: 'l1',
    name: 'Pratham Shetty',
    platform: 'Telegram',
    phone: '+919876543210',
    budget: '1.5 Cr',
    interestedIn: ['Sobha Opal Penthouse'],
    status: LeadStatus.SITE_VISIT_SCHEDULED,
    lastActive: '2 mins ago',
    conversationSummary: 'Bot verified budget. Requested site visit for Sobha Opal. Scheduled for Tomorrow 4 PM.',
    confidenceScore: 92,
    chatHistory: []
  },
  {
    id: 'l2',
    name: 'Aisha Kapoor',
    platform: 'WhatsApp',
    phone: '+919988776655',
    budget: '5 Cr+',
    interestedIn: ['Embassy Lake Terraces'],
    status: LeadStatus.NEW,
    lastActive: '10 mins ago',
    conversationSummary: 'Asked about maintenance fees and pet policy. Bot provided policy doc.',
    confidenceScore: 78,
    chatHistory: []
  },
  {
    id: 'l3',
    name: 'Rahul Dravid',
    platform: 'Telegram',
    phone: '+919123456789',
    budget: '2 Cr',
    interestedIn: ['Koramangala General'],
    status: LeadStatus.QUALIFIED,
    lastActive: '1 hour ago',
    conversationSummary: 'Looking for investment property. Bot sent ROI calculations for 2 properties.',
    confidenceScore: 65,
    chatHistory: []
  },
  {
    id: 'l5',
    name: 'Virat Kohli',
    platform: 'WhatsApp',
    phone: '+919898989898',
    budget: '15 Cr',
    interestedIn: ['Kingfisher Towers', 'Total Environment'],
    status: LeadStatus.NEGOTIATION,
    lastActive: '5 hours ago',
    conversationSummary: 'Broker handling personally. Discussing payment terms.',
    confidenceScore: 98,
    chatHistory: []
  }
];

export const REAL_ESTATE_ARTICLES: Record<string, string> = {
    "Platform Overview & Navigation": `
# Platform Overview & Navigation

Welcome to the Guaq AI Real Estate Operations Portal. This dashboard is your central command center for managing luxury listings, high-net-worth leads, and AI-driven negotiations.

## The Dashboard View
Upon logging in, you see the **Overview Dashboard**. This aggregates critical real-time data:

### Key Sections:
1.  **Summary Cards**:
    *   **Total Leads**: Active inquiries from all channels (WhatsApp, Telegram, Web).
    *   **Site Visits**: Upcoming scheduled property viewings for the next 7 days.
    *   **Active Inventory**: Properties currently available or under offer.
    *   **Gatekeeper Status**: Shows if the AI is actively handling incoming chats.

2.  **Pipeline Activity Graph**:
    *   Visualizes your lead inflow vs. actual site visits converted over the last week/month.

3.  **Navigation Sidebar**:
    *   **Leads Pipeline**: Manage buyer inquiries and track their status.
    *   **Inventory**: Upload and manage property details, media, and docs.
    *   **Bot Simulator**: Test your AI Gatekeeper's responses.
    *   **CRM & Campaigns**: Send personalized "Magic Drafts" to segmented lists.
    *   **Seller Intel**: Scrape listings to find direct owners and generate pitches.
    *   **AI Media Studio**: Virtual staging and video trailer generation.

## Role-Based Access
*   **Admin (Broker/Owner)**: Full access to settings, team management, and financial insights.
*   **Agent**: Access to leads, inventory, and CRM tools but restricted from global settings.
`,

    "Setting up Agency Branding": `
# Setting up Agency Branding

Customize the platform to reflect your brokerage's identity. This branding is used in generated reports, email drafts, and the interface itself.

## Configuration
1.  Navigate to **Settings** via the sidebar.
2.  **App Branding**:
    *   **Application Name**: The name displayed on the dashboard (e.g., "Prestige Realty OS").
    *   **Accent Color**: Choose a theme color that matches your brand guidelines.

3.  **Magic Draft Identity**:
    *   *Crucial for Automation*: Enter your Name, Brokerage Name, Phone, Email, and Website here.
    *   The AI uses these fields to auto-sign emails and WhatsApp messages generated in the CRM and Seller Intel modules.
    *   *Note*: If a field is left empty, it will simply be omitted from the signature.
`,

    "Managing Inventory & AI Context": `
# Managing Inventory & AI Context

The Inventory module is not just a database; it is the "brain" of your AI Gatekeeper.

## Adding a Property
1.  Click **Inventory** > **+ Add Entity**.
2.  **Basic Details**: Enter Title, Location, Price, Configuration (BHK), and Size.
3.  **AI Description**: Click "Auto-Generate with AI" to have Gemini write a luxury description based on the basic details.

## Training the AI (RAG)
To enable the bot to answer specific questions like "What is the maintenance fee?" or "Is it pet friendly?":
1.  **Upload Documents**: In the property edit screen, upload PDF brochures, floor plans, or policy documents.
2.  **Context**: The AI automatically reads these files (Retrieval Augmented Generation) to answer user queries accurately during chats.

## Media
*   Upload high-res images for **Virtual Staging**.
*   Upload raw video clips for **AI Video Trailer** generation.
`,

    "Understanding Lead Qualification": `
# Understanding Lead Qualification

The AI Gatekeeper qualifies leads based on their interaction depth and intent.

## The Confidence Score
Every lead is assigned a score (0-100):
*   **0-40 (Cold)**: Just browsing, vague answers, low budget match.
*   **41-75 (Warm)**: Asking specific questions, budget aligns with inventory.
*   **76-100 (Hot)**: Requested a site visit, confirmed budget, asked about payment plans.

## Status Workflow
1.  **NEW**: Lead just started chatting.
2.  **QUALIFIED**: AI has confirmed Name, Budget, and Requirement.
3.  **SITE_VISIT_SCHEDULED**: AI successfully booked a slot on your calendar.
4.  **STOP_AI**: Manual intervention required (or requested by user).

## Configuring Handover
Go to **Settings** > **Gatekeeper Logic**.
*   **Min Confidence Threshold**: Set the score at which you want to be notified. Default is 75%.
*   **Auto-Reply**: Toggle this to enable/disable the bot on WhatsApp/Telegram.
`,

    "Magic Drafts & Campaigns": `
# Magic Drafts & Campaigns

The **CRM & Campaigns** module allows you to send hyper-personalized outreach at scale.

## Creating a Campaign
1.  **Select Targets**: Choose leads from your list.
2.  **Match Properties**: Select one or more properties to pitch.
3.  **Generate Magic Draft**: 
    *   The AI analyzes the chat history of the selected leads and the details of the selected properties.
    *   It writes a personalized message (Email or WhatsApp format) connecting the client's needs to the property's features.
    *   It uses your **Magic Draft Identity** settings for the signature.

## Tone Selection
*   **Email**: Generates a professional, structured message with subject lines.
*   **WhatsApp**: Generates a casual, emoji-friendly, short message.
`,

    "Using Virtual Staging": `
# Using Virtual Staging

Sell empty properties faster by visualizing their potential.

1.  Go to **AI Media Studio** > **Virtual Staging**.
2.  **Upload**: Upload a photo of an empty room.
3.  **Describe Style**: Enter a prompt like "Modern luxury living room with beige sofa and warm lighting."
4.  **Generate**: The AI (Gemini Flash Image) will overlay furniture and decor while preserving the structural integrity (walls/windows) of the room.
5.  **Refine**: If you want to change the sofa color, just type "Change sofa to blue velvet" and update.
`,

    "Seller Intel & Acquisition": `
# Seller Intel & Acquisition

Find direct owners selling properties on listing sites and pitch your services.

1.  Go to **Seller Intel**.
2.  **Scrape**: Run the scraper (simulated) to find owner-listed properties matching your criteria.
3.  **Buyer Matching**: The system automatically checks your active leads database to see who is looking for a property like this.
4.  **Generate Pitch**:
    *   Click "Pitch".
    *   The AI writes a message to the owner: "Hi [Owner], I have [X] pre-qualified buyers looking for a [Type] in [Location] exactly like yours..."
    *   This "Buyer-First" approach has a much higher conversion rate than cold calling.
`
};

export const CODEBASE_CONTEXT = `
  You are an expert on the "Guaq AI" Real Estate Platform codebase.
  
  CORE FEATURES:
  1. Leads Pipeline: Displays leads from Telegram/WhatsApp. Has columns for Confidence Score, Status (New, Qualified, Site Visit, etc.).
  2. Inventory: Management of properties with AI description generation. Supports PDF uploads for RAG (Retrieval Augmented Generation).
  3. Calendar: Manages site visits and blocked times. Supports recurring blocks and Google/iCloud sync status.
  4. Bot Simulator: A test environment to chat with the Gatekeeper AI. Supports voice input and image visualization.
  5. CRM: Syncs with external CRMs. Features "Magic Draft" for personalized outreach using configured agent identity.
  6. Media Studio: Virtual Staging (using Gemini Flash Image) and Video generation (using Veo).
  7. Seller Intel: Scrapes listing sites to find owners selling directly. Generates "Buyer-First" pitches.
  
  TECH STACK:
  - Frontend: React + Vite + TailwindCSS.
  - AI: Google Gemini API (gemini-2.5-flash, gemini-2.5-flash-image, veo-3.1).
  - State: React local state (useState).
  
  SPECIFIC LOGIC:
  - The "Gatekeeper" calculates a confidence score based on budget and intent.
  - "Virtual Staging" takes a raw image and a prompt to render a furnished version.
  - "Seller Pitch" matches existing buyers in the DB to the scraped listing to create a compelling message.
  - "Magic Draft" uses the agent's name, phone, and brokerage from Settings to sign messages.
`;