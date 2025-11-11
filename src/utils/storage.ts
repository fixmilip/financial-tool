import type { UserInputs, CalculationResults } from '../types/calculator';

interface SavedCalculation {
  id: string;
  timestamp: number;
  inputs: UserInputs;
  results: CalculationResults;
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function saveCalculation(inputs: UserInputs, results: CalculationResults): string {
  const id = generateUniqueId();
  const saved: SavedCalculation = {
    id,
    timestamp: Date.now(),
    inputs,
    results,
  };

  const existing = getSavedCalculations();
  existing.push(saved);
  localStorage.setItem('calculations', JSON.stringify(existing));

  return id;
}

export function loadCalculation(id: string): SavedCalculation | null {
  const saved = getSavedCalculations();
  return saved.find(calc => calc.id === id) || null;
}

export function getSavedCalculations(): SavedCalculation[] {
  const stored = localStorage.getItem('calculations');
  return stored ? JSON.parse(stored) : [];
}
