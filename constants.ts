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

export const MOCK_LEADS: Lead[] = [
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
    id: 'l4',
    name: 'Suresh Raina',
    platform: 'Telegram',
    phone: '+919000011111',
    budget: '1 Cr',
    interestedIn: ['Prestige Pinewood'],
    status: LeadStatus.COLD,
    lastActive: '3 days ago',
    conversationSummary: 'Stopped responding after price disclosure.',
    confidenceScore: 20,
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
  },
  {
    id: 'l6',
    name: 'Rohit Sharma',
    platform: 'WhatsApp',
    phone: '+919777777777',
    budget: '3 Cr',
    interestedIn: ['Adarsh Palm Retreat'],
    status: LeadStatus.NEW,
    lastActive: '30 mins ago',
    conversationSummary: 'Inquired about villa availability.',
    confidenceScore: 60,
    chatHistory: []
  }
];