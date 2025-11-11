// Technology Types (30 total across 6 groups)
export type TechnologyType =
  // Digital & Software (5)
  | 'Software/SaaS Platform'
  | 'AI/Machine Learning'
  | 'FinTech/Financial Services'
  | 'EdTech/Learning Platform'
  | 'Blockchain/Web3'
  // Healthcare & Life Sciences (5)
  | 'Biotech/Pharmaceutical'
  | 'Medical Devices/MedTech'
  | 'Diagnostics/Lab Tech'
  | 'Digital Health/Telemedicine'
  | 'Synthetic Biology'
  // Hardware & Manufacturing (5)
  | 'Hardware/Physical Product'
  | 'Robotics/Automation'
  | 'IoT/Connected Devices'
  | 'Semiconductors/Electronics'
  | 'Advanced Materials'
  // Energy & Environment (4)
  | 'Clean Energy/Renewables'
  | 'Climate Tech/Carbon'
  | 'Water/Environmental Tech'
  | 'Nuclear/Advanced Nuclear'
  // Agriculture & Food (3)
  | 'AgriTech/Precision Agriculture'
  | 'Food Tech/Alternative Protein'
  | 'Aquaculture/Blue Economy'
  // Industrial & Infrastructure (5)
  | 'Aerospace/Defense'
  | 'Space Technology'
  | 'Construction/PropTech'
  | 'Supply Chain/Logistics Tech'
  | 'Advanced Manufacturing';

// Current Stage (Technology Readiness Levels)
export type CurrentStage =
  | 'Concept (TRL 1-3)'
  | 'Prototype (TRL 4-6)'
  | 'Pilot (TRL 7-8)'
  | 'Market Ready (TRL 9)';

// Target Markets (33 total across 8 groups)
export type TargetMarket =
  // B2B Enterprise (3)
  | 'Large Enterprise (Fortune 1000)'
  | 'Mid-Market B2B (500-5000 employees)'
  | 'Small Business B2B (<500 employees)'
  // Government & Public Sector (4)
  | 'Federal/National Government'
  | 'State/Local Government'
  | 'Military/Defense'
  | 'International Gov/Multilateral'
  // Healthcare & Life Sciences (4)
  | 'Hospital Systems/Integrated Delivery'
  | 'Pharmaceutical/Biotech Companies'
  | 'Insurance/Payers'
  | 'Individual Providers/Clinics'
  // Research & Education (3)
  | 'Research Institutions/Labs'
  | 'Universities/Higher Ed'
  | 'K-12 Education Systems'
  // Consumer Markets (3)
  | 'Mass Market Consumer (B2C)'
  | 'Premium/Luxury Consumer'
  | 'Prosumer/Enthusiast Market'
  // Industry Specific (5)
  | 'Financial Services/Banking'
  | 'Energy/Utilities'
  | 'Manufacturing/Industrial'
  | 'Agriculture/Food Production'
  | 'Real Estate/Construction'
  // Impact & Non-Profit (4)
  | 'NGO/Non-Profit Organizations'
  | 'Social Enterprises'
  | 'Foundations/Philanthropic'
  | 'Development Organizations'
  // Platform & Multi-Sided (3)
  | 'Two-Sided Marketplace'
  | 'Multi-Sided Platform'
  | 'Network Effects Business'
  // Geographic Focus (2)
  | 'Emerging Markets Focus'
  | 'Global/Multi-Region';

export type TeamStatus = 'No team yet' | 'Partial team' | 'Full team assembled';
export type RegulatoryEnvironment = 'None' | 'Moderate' | 'Heavy (FDA/EPA level)';

export interface GeographicLocation {
  name: string;
  index: number;
}

export interface UserInputs {
  technologyType: TechnologyType;
  currentStage: CurrentStage;
  targetMarket: TargetMarket;
  geographicLocation: string;
  teamStatus: TeamStatus;
  regulatoryEnvironment: RegulatoryEnvironment;
}

export interface CostBreakdown {
  development: number;
  technical: number;
  regulatory: number;
  gtm: number;
  gtmYear1: number;
  gtmYears23: number;
  riskBuffer: number;
  total: number;
  breakEven: number;
}

export interface Scenario {
  name: 'Optimistic' | 'Realistic' | 'Conservative';
  total: number;
  timeline: number;
  breakEven: number;
  breakdown: CostBreakdown;
}

export interface CalculationResults {
  scenarios: Scenario[];
  confidenceInterval: {
    min: number;
    max: number;
  };
  inputs: UserInputs;
}

export interface FundingPhase {
  name: string;
  investment: number;
  duration: number;
  percentage: number;
  objective: string;
  keyMilestone: string;
  decisionGate: string;
}

export interface StagedFunding {
  phases: FundingPhase[];
  totalInvestment: number;
  totalDuration: number;
}
