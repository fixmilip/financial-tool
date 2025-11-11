import type { UserInputs, CalculationResults, Scenario, CostBreakdown, StagedFunding, FundingPhase } from '../types';
import {
  DEVELOPMENT_COSTS,
  REGULATORY_COSTS,
  GTM_COSTS,
  DEVELOPMENT_MONTHS,
  TEAM_MULTIPLIERS,
  GEOGRAPHIC_LOCATIONS,
  SCENARIO_MODIFIERS,
  RISK_BUFFER_PERCENTAGE,
} from '../config/coefficients';

export function calculateInvestment(inputs: UserInputs): CalculationResults {
  // Get base values
  const baseDevelopmentCost = DEVELOPMENT_COSTS[inputs.technologyType][inputs.currentStage];
  const regulatoryCost = REGULATORY_COSTS[inputs.technologyType];
  const gtmData = GTM_COSTS[inputs.targetMarket];
  const developmentMonths = DEVELOPMENT_MONTHS[inputs.currentStage];
  const teamMultiplier = TEAM_MULTIPLIERS[inputs.teamStatus];
  const geoLocation = GEOGRAPHIC_LOCATIONS.find(loc => loc.name === inputs.geographicLocation);
  const geoMultiplier = geoLocation?.index || 1.0;

  // Calculate realistic scenario (base case)
  // Development = baseDev × 1.2 × teamMultiplier × geoMultiplier
  const realisticDevelopment = baseDevelopmentCost * SCENARIO_MODIFIERS.realistic.development * teamMultiplier * geoMultiplier;
  const realisticRegulatory = regulatoryCost * geoMultiplier;
  const realisticTotalDev = realisticDevelopment + realisticRegulatory;

  // GTM = gtm.year1 × 1.2 × geoMultiplier
  const realisticGTMYear1 = gtmData.year1 * SCENARIO_MODIFIERS.realistic.gtm * geoMultiplier;
  const realisticGTMYears23 = gtmData.years23 * geoMultiplier;

  // Risk Buffer = development × 0.4
  const realisticRiskBuffer = realisticTotalDev * RISK_BUFFER_PERCENTAGE;

  // Total = Development + GTM + RiskBuffer
  const realisticTotal = realisticTotalDev + realisticGTMYear1 + realisticRiskBuffer;

  // Timeline and Break-even
  const realisticTimeline = Math.round(developmentMonths * SCENARIO_MODIFIERS.realistic.timeline);
  const realisticBreakEven = Math.round(realisticTimeline * SCENARIO_MODIFIERS.realistic.breakEven);

  const realisticBreakdown: CostBreakdown = {
    development: realisticTotalDev,
    technical: realisticDevelopment,
    regulatory: realisticRegulatory,
    gtm: realisticGTMYear1,
    gtmYear1: realisticGTMYear1,
    gtmYears23: realisticGTMYears23,
    riskBuffer: realisticRiskBuffer,
    total: realisticTotal,
    breakEven: realisticBreakEven,
  };

  // Calculate optimistic scenario
  // Development = baseDev × 0.7 × teamMultiplier × geoMultiplier
  const optimisticDevelopment = baseDevelopmentCost * SCENARIO_MODIFIERS.optimistic.development * teamMultiplier * geoMultiplier;
  const optimisticRegulatory = regulatoryCost * geoMultiplier;
  const optimisticTotalDev = optimisticDevelopment + optimisticRegulatory;

  // GTM = gtm.year1 × 0.6 × geoMultiplier
  const optimisticGTMYear1 = gtmData.year1 * SCENARIO_MODIFIERS.optimistic.gtm * geoMultiplier;
  const optimisticGTMYears23 = gtmData.years23 * geoMultiplier;

  // Risk Buffer = development × 0.4
  const optimisticRiskBuffer = optimisticTotalDev * RISK_BUFFER_PERCENTAGE;

  // Total
  const optimisticTotal = optimisticTotalDev + optimisticGTMYear1 + optimisticRiskBuffer;

  // Timeline and Break-even
  const optimisticTimeline = Math.round(developmentMonths * SCENARIO_MODIFIERS.optimistic.timeline);
  const optimisticBreakEven = Math.round(optimisticTimeline * SCENARIO_MODIFIERS.optimistic.breakEven);

  const optimisticBreakdown: CostBreakdown = {
    development: optimisticTotalDev,
    technical: optimisticDevelopment,
    regulatory: optimisticRegulatory,
    gtm: optimisticGTMYear1,
    gtmYear1: optimisticGTMYear1,
    gtmYears23: optimisticGTMYears23,
    riskBuffer: optimisticRiskBuffer,
    total: optimisticTotal,
    breakEven: optimisticBreakEven,
  };

  // Calculate conservative scenario
  // Development = baseDev × 1.8 × teamMultiplier × geoMultiplier
  const conservativeDevelopment = baseDevelopmentCost * SCENARIO_MODIFIERS.conservative.development * teamMultiplier * geoMultiplier;
  const conservativeRegulatory = regulatoryCost * geoMultiplier;
  const conservativeTotalDev = conservativeDevelopment + conservativeRegulatory;

  // GTM = gtm.year1 × 2.0 × geoMultiplier
  const conservativeGTMYear1 = gtmData.year1 * SCENARIO_MODIFIERS.conservative.gtm * geoMultiplier;
  const conservativeGTMYears23 = gtmData.years23 * geoMultiplier;

  // Risk Buffer = development × 0.4
  const conservativeRiskBuffer = conservativeTotalDev * RISK_BUFFER_PERCENTAGE;

  // Total
  const conservativeTotal = conservativeTotalDev + conservativeGTMYear1 + conservativeRiskBuffer;

  // Timeline and Break-even
  const conservativeTimeline = Math.round(developmentMonths * SCENARIO_MODIFIERS.conservative.timeline);
  const conservativeBreakEven = Math.round(conservativeTimeline * SCENARIO_MODIFIERS.conservative.breakEven);

  const conservativeBreakdown: CostBreakdown = {
    development: conservativeTotalDev,
    technical: conservativeDevelopment,
    regulatory: conservativeRegulatory,
    gtm: conservativeGTMYear1,
    gtmYear1: conservativeGTMYear1,
    gtmYears23: conservativeGTMYears23,
    riskBuffer: conservativeRiskBuffer,
    total: conservativeTotal,
    breakEven: conservativeBreakEven,
  };

  const scenarios: Scenario[] = [
    {
      name: 'Optimistic',
      total: optimisticTotal,
      timeline: optimisticTimeline,
      breakEven: optimisticBreakEven,
      breakdown: optimisticBreakdown,
    },
    {
      name: 'Realistic',
      total: realisticTotal,
      timeline: realisticTimeline,
      breakEven: realisticBreakEven,
      breakdown: realisticBreakdown,
    },
    {
      name: 'Conservative',
      total: conservativeTotal,
      timeline: conservativeTimeline,
      breakEven: conservativeBreakEven,
      breakdown: conservativeBreakdown,
    },
  ];

  // Calculate confidence interval (±15% of realistic)
  const confidenceInterval = {
    min: realisticTotal * 0.85,
    max: realisticTotal * 1.15,
  };

  return {
    scenarios,
    confidenceInterval,
    inputs,
  };
}

export function calculateStagedFunding(realisticScenario: Scenario): StagedFunding {
  const totalInvestment = realisticScenario.total;
  const totalTimeline = realisticScenario.timeline;

  // Phase 1: Validate (15% of total, Months 0-6)
  const phase1Investment = totalInvestment * 0.15;
  const phase1Duration = 6;

  // Phase 2: Build (35% of total, Months 7-18)
  const phase2Investment = totalInvestment * 0.35;
  const phase2Duration = 12;

  // Phase 3: Scale (50% of total, Months 19-30)
  const phase3Investment = totalInvestment * 0.50;
  const phase3Duration = Math.max(12, totalTimeline - phase1Duration - phase2Duration);

  const phases: FundingPhase[] = [
    {
      name: 'Phase 1: Validate',
      investment: phase1Investment,
      duration: phase1Duration,
      percentage: 15,
      objective: 'Proof of concept and initial customer validation',
      keyMilestone: 'Technical feasibility confirmed, clear market need identified',
      decisionGate: 'Technical milestone achieved?',
    },
    {
      name: 'Phase 2: Build',
      investment: phase2Investment,
      duration: phase2Duration,
      percentage: 35,
      objective: 'Product development and market validation',
      keyMilestone: 'Product meets quality standards, positive customer feedback',
      decisionGate: 'Market traction confirmed?',
    },
    {
      name: 'Phase 3: Scale',
      investment: phase3Investment,
      duration: phase3Duration,
      percentage: 50,
      objective: 'Market expansion and team scaling',
      keyMilestone: 'Sustainable unit economics, repeatable sales process',
      decisionGate: 'Unit economics proven?',
    },
  ];

  return {
    phases,
    totalInvestment,
    totalDuration: phase1Duration + phase2Duration + phase3Duration,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
