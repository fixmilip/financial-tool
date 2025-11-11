import type { CalculationResults } from '../types/calculator';

export type NormalizedMatrix = {
  personas: string[];
  needs: string[];
  // 0..1 weights per cell; same shape as values
  weights: number[][];
  // basic interpretation about scale type
  scale: 'percentage' | 'score-1-5' | 'score-0-10' | 'binary' | 'categorical' | 'unknown';
};

// Map common categorical tokens to weights
const CATEGORICAL_WEIGHTS: Record<string, number> = {
  // high/medium/low
  high: 1.0,
  medium: 0.6,
  low: 0.3,
  // yes/no
  yes: 1.0,
  no: 0.0,
  // priority
  critical: 1.0,
  important: 0.7,
  optional: 0.3,
};

// Given raw matrix values (strings or numbers), produce 0..1 weights
export function normalizeMatrix(personas: string[], needs: string[], values: (string | number)[][]): NormalizedMatrix {
  const numericValues: number[] = [];
  const weights: number[][] = values.map(row => row.map(v => {
    if (typeof v === 'number' && isFinite(v)) {
      numericValues.push(v);
      return NaN; // placeholder; will fill after scale detect
    }
    const s = String(v).trim();
    const num = parseFloat(s.replace(/[^0-9.\-]/g, ''));
    if (!isNaN(num)) {
      numericValues.push(num);
      return NaN;
    }
    const key = s.toLowerCase();
    if (key in CATEGORICAL_WEIGHTS) return CATEGORICAL_WEIGHTS[key];
    return NaN;
  }));

  // Determine numeric scale if any
  let scale: NormalizedMatrix['scale'] = 'unknown';
  if (numericValues.length) {
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    // Heuristics
    if (max <= 1 && min >= 0) scale = 'binary';
    else if (max <= 5 && min >= 0) scale = 'score-1-5';
    else if (max <= 10 && min >= 0) scale = 'score-0-10';
    else if (max <= 100 && min >= 0) scale = 'percentage';
    else scale = 'score-0-10';

    // Normalize numeric to 0..1
    const denom = (scale === 'percentage') ? 100 : (max - Math.max(0, min) || max || 1);
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        if (isNaN(weights[i][j])) {
          const v = typeof values[i][j] === 'number' ? Number(values[i][j]) : parseFloat(String(values[i][j]).replace(/[^0-9.\-]/g, ''));
          const normalized = scale === 'percentage' ? (v / 100) : ((v - Math.max(0, min)) / denom);
          weights[i][j] = Math.max(0, Math.min(1, normalized));
        }
      }
    }
  }

  // Any remaining NaNs (unknown tokens) -> small default weight
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights[i].length; j++) {
      if (isNaN(weights[i][j])) weights[i][j] = 0.2;
    }
  }

  // If we saw only categorical tokens
  if (!numericValues.length) scale = 'categorical';

  return { personas, needs, weights, scale };
}

// Detect cost driver emphasis from need label via keywords
export function inferDriverWeights(needLabel: string): { dev: number; gtm: number; regulatory: number } {
  const s = needLabel.toLowerCase();
  // Regulatory heavy
  if (/regulat|compliance|approval|certif|fda|epa|hipaa|gdpr/.test(s)) return { dev: 0.2, gtm: 0.1, regulatory: 0.7 };
  // GTM heavy
  if (/market|sales|pricing|acquisition|demand|distribution|channel|brand|marketing/.test(s)) return { dev: 0.2, gtm: 0.7, regulatory: 0.1 };
  // Development heavy
  if (/tech|product|prototype|mvp|build|engineering|performance|scal(ing|ability)|feature/.test(s)) return { dev: 0.7, gtm: 0.2, regulatory: 0.1 };
  // Default balanced
  return { dev: 0.5, gtm: 0.4, regulatory: 0.1 };
}

// Estimate incremental cost for a single cell (persona x need) given normalized weight
export function estimateCellCost(results: CalculationResults, needLabel: string, normalizedWeight: number): number {
  const realistic = results.scenarios.find(s => s.name === 'Realistic') || results.scenarios[1];
  const { dev, gtm, regulatory } = inferDriverWeights(needLabel);
  const shareDev = realistic.breakdown.development * dev;
  const shareGtm = realistic.breakdown.gtmYear1 * gtm;
  const shareReg = realistic.breakdown.regulatory * regulatory;
  const base = shareDev + shareGtm + shareReg;
  // Scale by normalized weight 0..1
  return Math.round(base * normalizedWeight);
}

export function aggregateCosts(results: CalculationResults, matrix: NormalizedMatrix) {
  const perPersona: Record<string, number> = {};
  const perNeed: Record<string, number> = {};

  for (let i = 0; i < matrix.personas.length; i++) {
    for (let j = 0; j < matrix.needs.length; j++) {
      const w = matrix.weights[i]?.[j] ?? 0;
      const cost = estimateCellCost(results, matrix.needs[j], w);
      perPersona[matrix.personas[i]] = (perPersona[matrix.personas[i]] || 0) + cost;
      perNeed[matrix.needs[j]] = (perNeed[matrix.needs[j]] || 0) + cost;
    }
  }
  return { perPersona, perNeed };
}
