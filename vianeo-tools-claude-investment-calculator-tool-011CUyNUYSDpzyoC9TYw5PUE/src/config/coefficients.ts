import type { TechnologyType, CurrentStage, TargetMarket, TeamStatus } from '../types';

// Development Costs by Technology Type and Stage
export const DEVELOPMENT_COSTS: Record<TechnologyType, Record<CurrentStage, number>> = {
  // Digital & Software
  'Software/SaaS Platform': {
    'Concept (TRL 1-3)': 200000,
    'Prototype (TRL 4-6)': 350000,
    'Pilot (TRL 7-8)': 500000,
    'Market Ready (TRL 9)': 150000,
  },
  'AI/Machine Learning': {
    'Concept (TRL 1-3)': 250000,
    'Prototype (TRL 4-6)': 400000,
    'Pilot (TRL 7-8)': 600000,
    'Market Ready (TRL 9)': 200000,
  },
  'FinTech/Financial Services': {
    'Concept (TRL 1-3)': 300000,
    'Prototype (TRL 4-6)': 500000,
    'Pilot (TRL 7-8)': 700000,
    'Market Ready (TRL 9)': 250000,
  },
  'EdTech/Learning Platform': {
    'Concept (TRL 1-3)': 200000,
    'Prototype (TRL 4-6)': 350000,
    'Pilot (TRL 7-8)': 500000,
    'Market Ready (TRL 9)': 150000,
  },
  'Blockchain/Web3': {
    'Concept (TRL 1-3)': 300000,
    'Prototype (TRL 4-6)': 450000,
    'Pilot (TRL 7-8)': 650000,
    'Market Ready (TRL 9)': 200000,
  },

  // Healthcare & Life Sciences
  'Biotech/Pharmaceutical': {
    'Concept (TRL 1-3)': 800000,
    'Prototype (TRL 4-6)': 2000000,
    'Pilot (TRL 7-8)': 3500000,
    'Market Ready (TRL 9)': 500000,
  },
  'Medical Devices/MedTech': {
    'Concept (TRL 1-3)': 700000,
    'Prototype (TRL 4-6)': 1500000,
    'Pilot (TRL 7-8)': 2500000,
    'Market Ready (TRL 9)': 400000,
  },
  'Diagnostics/Lab Tech': {
    'Concept (TRL 1-3)': 600000,
    'Prototype (TRL 4-6)': 1200000,
    'Pilot (TRL 7-8)': 2000000,
    'Market Ready (TRL 9)': 350000,
  },
  'Digital Health/Telemedicine': {
    'Concept (TRL 1-3)': 350000,
    'Prototype (TRL 4-6)': 600000,
    'Pilot (TRL 7-8)': 900000,
    'Market Ready (TRL 9)': 250000,
  },
  'Synthetic Biology': {
    'Concept (TRL 1-3)': 900000,
    'Prototype (TRL 4-6)': 2200000,
    'Pilot (TRL 7-8)': 4000000,
    'Market Ready (TRL 9)': 600000,
  },

  // Hardware & Manufacturing
  'Hardware/Physical Product': {
    'Concept (TRL 1-3)': 400000,
    'Prototype (TRL 4-6)': 750000,
    'Pilot (TRL 7-8)': 1200000,
    'Market Ready (TRL 9)': 300000,
  },
  'Robotics/Automation': {
    'Concept (TRL 1-3)': 600000,
    'Prototype (TRL 4-6)': 1200000,
    'Pilot (TRL 7-8)': 2000000,
    'Market Ready (TRL 9)': 400000,
  },
  'IoT/Connected Devices': {
    'Concept (TRL 1-3)': 350000,
    'Prototype (TRL 4-6)': 650000,
    'Pilot (TRL 7-8)': 1000000,
    'Market Ready (TRL 9)': 250000,
  },
  'Semiconductors/Electronics': {
    'Concept (TRL 1-3)': 1000000,
    'Prototype (TRL 4-6)': 2500000,
    'Pilot (TRL 7-8)': 4500000,
    'Market Ready (TRL 9)': 700000,
  },
  'Advanced Materials': {
    'Concept (TRL 1-3)': 700000,
    'Prototype (TRL 4-6)': 1500000,
    'Pilot (TRL 7-8)': 2500000,
    'Market Ready (TRL 9)': 450000,
  },

  // Energy & Environment
  'Clean Energy/Renewables': {
    'Concept (TRL 1-3)': 600000,
    'Prototype (TRL 4-6)': 1500000,
    'Pilot (TRL 7-8)': 2500000,
    'Market Ready (TRL 9)': 400000,
  },
  'Climate Tech/Carbon': {
    'Concept (TRL 1-3)': 500000,
    'Prototype (TRL 4-6)': 1100000,
    'Pilot (TRL 7-8)': 1800000,
    'Market Ready (TRL 9)': 350000,
  },
  'Water/Environmental Tech': {
    'Concept (TRL 1-3)': 500000,
    'Prototype (TRL 4-6)': 1000000,
    'Pilot (TRL 7-8)': 1700000,
    'Market Ready (TRL 9)': 300000,
  },
  'Nuclear/Advanced Nuclear': {
    'Concept (TRL 1-3)': 1200000,
    'Prototype (TRL 4-6)': 3000000,
    'Pilot (TRL 7-8)': 5000000,
    'Market Ready (TRL 9)': 800000,
  },

  // Agriculture & Food
  'AgriTech/Precision Agriculture': {
    'Concept (TRL 1-3)': 400000,
    'Prototype (TRL 4-6)': 800000,
    'Pilot (TRL 7-8)': 1300000,
    'Market Ready (TRL 9)': 250000,
  },
  'Food Tech/Alternative Protein': {
    'Concept (TRL 1-3)': 500000,
    'Prototype (TRL 4-6)': 1000000,
    'Pilot (TRL 7-8)': 1600000,
    'Market Ready (TRL 9)': 300000,
  },
  'Aquaculture/Blue Economy': {
    'Concept (TRL 1-3)': 500000,
    'Prototype (TRL 4-6)': 1000000,
    'Pilot (TRL 7-8)': 1700000,
    'Market Ready (TRL 9)': 300000,
  },

  // Industrial & Infrastructure
  'Aerospace/Defense': {
    'Concept (TRL 1-3)': 1000000,
    'Prototype (TRL 4-6)': 2500000,
    'Pilot (TRL 7-8)': 4000000,
    'Market Ready (TRL 9)': 700000,
  },
  'Space Technology': {
    'Concept (TRL 1-3)': 1200000,
    'Prototype (TRL 4-6)': 3000000,
    'Pilot (TRL 7-8)': 5000000,
    'Market Ready (TRL 9)': 800000,
  },
  'Construction/PropTech': {
    'Concept (TRL 1-3)': 400000,
    'Prototype (TRL 4-6)': 800000,
    'Pilot (TRL 7-8)': 1300000,
    'Market Ready (TRL 9)': 250000,
  },
  'Supply Chain/Logistics Tech': {
    'Concept (TRL 1-3)': 350000,
    'Prototype (TRL 4-6)': 650000,
    'Pilot (TRL 7-8)': 1000000,
    'Market Ready (TRL 9)': 200000,
  },
  'Advanced Manufacturing': {
    'Concept (TRL 1-3)': 600000,
    'Prototype (TRL 4-6)': 1300000,
    'Pilot (TRL 7-8)': 2200000,
    'Market Ready (TRL 9)': 400000,
  },
};

// Regulatory Costs by Technology Type
export const REGULATORY_COSTS: Record<TechnologyType, number> = {
  // Digital & Software
  'Software/SaaS Platform': 50000,
  'AI/Machine Learning': 75000,
  'FinTech/Financial Services': 200000,
  'EdTech/Learning Platform': 50000,
  'Blockchain/Web3': 150000,

  // Healthcare & Life Sciences
  'Biotech/Pharmaceutical': 2500000,
  'Medical Devices/MedTech': 1500000,
  'Diagnostics/Lab Tech': 1200000,
  'Digital Health/Telemedicine': 400000,
  'Synthetic Biology': 2800000,

  // Hardware & Manufacturing
  'Hardware/Physical Product': 200000,
  'Robotics/Automation': 300000,
  'IoT/Connected Devices': 150000,
  'Semiconductors/Electronics': 400000,
  'Advanced Materials': 350000,

  // Energy & Environment
  'Clean Energy/Renewables': 500000,
  'Climate Tech/Carbon': 300000,
  'Water/Environmental Tech': 350000,
  'Nuclear/Advanced Nuclear': 3000000,

  // Agriculture & Food
  'AgriTech/Precision Agriculture': 250000,
  'Food Tech/Alternative Protein': 400000,
  'Aquaculture/Blue Economy': 350000,

  // Industrial & Infrastructure
  'Aerospace/Defense': 1500000,
  'Space Technology': 2000000,
  'Construction/PropTech': 200000,
  'Supply Chain/Logistics Tech': 150000,
  'Advanced Manufacturing': 300000,
};

// GTM Costs by Market Segment
export const GTM_COSTS: Record<TargetMarket, { year1: number; years23: number; salesCycle: string }> = {
  // B2B Enterprise
  'Large Enterprise (Fortune 1000)': { year1: 750000, years23: 4500000, salesCycle: '9-18 months' },
  'Mid-Market B2B (500-5000 employees)': { year1: 550000, years23: 3200000, salesCycle: '6-12 months' },
  'Small Business B2B (<500 employees)': { year1: 450000, years23: 2500000, salesCycle: '3-6 months' },

  // Government & Public Sector
  'Federal/National Government': { year1: 900000, years23: 4800000, salesCycle: '12-24 months' },
  'State/Local Government': { year1: 650000, years23: 3500000, salesCycle: '9-18 months' },
  'Military/Defense': { year1: 1000000, years23: 5200000, salesCycle: '18-36 months' },
  'International Gov/Multilateral': { year1: 850000, years23: 4600000, salesCycle: '12-24 months' },

  // Healthcare & Life Sciences
  'Hospital Systems/Integrated Delivery': { year1: 800000, years23: 4200000, salesCycle: '12-18 months' },
  'Pharmaceutical/Biotech Companies': { year1: 850000, years23: 4500000, salesCycle: '12-24 months' },
  'Insurance/Payers': { year1: 750000, years23: 4000000, salesCycle: '12-18 months' },
  'Individual Providers/Clinics': { year1: 500000, years23: 2800000, salesCycle: '6-12 months' },

  // Research & Education
  'Research Institutions/Labs': { year1: 550000, years23: 3000000, salesCycle: '6-12 months' },
  'Universities/Higher Ed': { year1: 500000, years23: 2800000, salesCycle: '6-12 months' },
  'K-12 Education Systems': { year1: 400000, years23: 2200000, salesCycle: '6-18 months' },

  // Consumer Markets
  'Mass Market Consumer (B2C)': { year1: 700000, years23: 5000000, salesCycle: 'Immediate' },
  'Premium/Luxury Consumer': { year1: 600000, years23: 3800000, salesCycle: '1-3 months' },
  'Prosumer/Enthusiast Market': { year1: 450000, years23: 2600000, salesCycle: '1-2 months' },

  // Industry Specific
  'Financial Services/Banking': { year1: 800000, years23: 4300000, salesCycle: '12-18 months' },
  'Energy/Utilities': { year1: 750000, years23: 4000000, salesCycle: '12-24 months' },
  'Manufacturing/Industrial': { year1: 600000, years23: 3400000, salesCycle: '9-15 months' },
  'Agriculture/Food Production': { year1: 500000, years23: 2800000, salesCycle: '6-12 months' },
  'Real Estate/Construction': { year1: 550000, years23: 3000000, salesCycle: '6-15 months' },

  // Impact & Non-Profit
  'NGO/Non-Profit Organizations': { year1: 350000, years23: 1800000, salesCycle: '6-12 months' },
  'Social Enterprises': { year1: 400000, years23: 2200000, salesCycle: '6-12 months' },
  'Foundations/Philanthropic': { year1: 450000, years23: 2400000, salesCycle: '6-15 months' },
  'Development Organizations': { year1: 500000, years23: 2600000, salesCycle: '9-18 months' },

  // Platform & Multi-Sided
  'Two-Sided Marketplace': { year1: 800000, years23: 5500000, salesCycle: '6-18 months' },
  'Multi-Sided Platform': { year1: 850000, years23: 5800000, salesCycle: '6-18 months' },
  'Network Effects Business': { year1: 750000, years23: 5200000, salesCycle: '6-18 months' },

  // Geographic Focus
  'Emerging Markets Focus': { year1: 450000, years23: 2800000, salesCycle: '6-18 months' },
  'Global/Multi-Region': { year1: 950000, years23: 5500000, salesCycle: '12-24 months' },
};

// Development Timelines by Stage (in months)
export const DEVELOPMENT_MONTHS: Record<CurrentStage, number> = {
  'Concept (TRL 1-3)': 30,
  'Prototype (TRL 4-6)': 24,
  'Pilot (TRL 7-8)': 18,
  'Market Ready (TRL 9)': 12,
};

// Team Multipliers
export const TEAM_MULTIPLIERS: Record<TeamStatus, number> = {
  'No team yet': 1.3,
  'Partial team': 1.1,
  'Full team assembled': 1.0,
};

// Geographic Location Cost Indices
export const GEOGRAPHIC_LOCATIONS = [
  { name: 'Bay Area (San Francisco)', index: 1.35 },
  { name: 'New York City', index: 1.30 },
  { name: 'Seattle', index: 1.25 },
  { name: 'Boston', index: 1.22 },
  { name: 'Los Angeles', index: 1.20 },
  { name: 'Austin', index: 1.05 },
  { name: 'Denver', index: 1.03 },
  { name: 'Remote US', index: 1.00 },
  { name: 'Chicago', index: 0.98 },
  { name: 'Atlanta', index: 0.95 },
  { name: 'Miami', index: 0.92 },
  { name: 'Toronto', index: 0.88 },
  { name: 'London', index: 1.15 },
  { name: 'Berlin', index: 0.85 },
  { name: 'Singapore', index: 1.10 },
  { name: 'Tel Aviv', index: 1.05 },
  { name: 'São Paulo', index: 0.65 },
  { name: 'Bangalore', index: 0.45 },
  { name: 'Warsaw', index: 0.55 },
  { name: 'Cape Town', index: 0.50 },
];

// Scenario Modifiers
export const SCENARIO_MODIFIERS = {
  optimistic: {
    development: 0.7,
    gtm: 0.6,
    timeline: 0.75,
    breakEven: 1.5,
  },
  realistic: {
    development: 1.2,
    gtm: 1.2,
    timeline: 1.0,
    breakEven: 1.75,
  },
  conservative: {
    development: 1.8,
    gtm: 2.0,
    timeline: 1.5,
    breakEven: 2.25,
  },
};

// Risk Buffer Percentage
export const RISK_BUFFER_PERCENTAGE = 0.40; // 40% of development costs

// Fixed Annual Team Costs
export const ANNUAL_TEAM_COSTS = 900000; // $900K per year

// Technology Type Groups for UI Organization
export const TECHNOLOGY_GROUPS = {
  'Digital & Software': [
    'Software/SaaS Platform',
    'AI/Machine Learning',
    'FinTech/Financial Services',
    'EdTech/Learning Platform',
    'Blockchain/Web3',
  ],
  'Healthcare & Life Sciences': [
    'Biotech/Pharmaceutical',
    'Medical Devices/MedTech',
    'Diagnostics/Lab Tech',
    'Digital Health/Telemedicine',
    'Synthetic Biology',
  ],
  'Hardware & Manufacturing': [
    'Hardware/Physical Product',
    'Robotics/Automation',
    'IoT/Connected Devices',
    'Semiconductors/Electronics',
    'Advanced Materials',
  ],
  'Energy & Environment': [
    'Clean Energy/Renewables',
    'Climate Tech/Carbon',
    'Water/Environmental Tech',
    'Nuclear/Advanced Nuclear',
  ],
  'Agriculture & Food': [
    'AgriTech/Precision Agriculture',
    'Food Tech/Alternative Protein',
    'Aquaculture/Blue Economy',
  ],
  'Industrial & Infrastructure': [
    'Aerospace/Defense',
    'Space Technology',
    'Construction/PropTech',
    'Supply Chain/Logistics Tech',
    'Advanced Manufacturing',
  ],
};

// Market Segment Groups for UI Organization
export const MARKET_GROUPS = {
  'B2B Enterprise': [
    'Large Enterprise (Fortune 1000)',
    'Mid-Market B2B (500-5000 employees)',
    'Small Business B2B (<500 employees)',
  ],
  'Government & Public Sector': [
    'Federal/National Government',
    'State/Local Government',
    'Military/Defense',
    'International Gov/Multilateral',
  ],
  'Healthcare & Life Sciences': [
    'Hospital Systems/Integrated Delivery',
    'Pharmaceutical/Biotech Companies',
    'Insurance/Payers',
    'Individual Providers/Clinics',
  ],
  'Research & Education': [
    'Research Institutions/Labs',
    'Universities/Higher Ed',
    'K-12 Education Systems',
  ],
  'Consumer Markets': [
    'Mass Market Consumer (B2C)',
    'Premium/Luxury Consumer',
    'Prosumer/Enthusiast Market',
  ],
  'Industry Specific': [
    'Financial Services/Banking',
    'Energy/Utilities',
    'Manufacturing/Industrial',
    'Agriculture/Food Production',
    'Real Estate/Construction',
  ],
  'Impact & Non-Profit': [
    'NGO/Non-Profit Organizations',
    'Social Enterprises',
    'Foundations/Philanthropic',
    'Development Organizations',
  ],
  'Platform & Multi-Sided': [
    'Two-Sided Marketplace',
    'Multi-Sided Platform',
    'Network Effects Business',
  ],
  'Geographic Focus': [
    'Emerging Markets Focus',
    'Global/Multi-Region',
  ],
};
