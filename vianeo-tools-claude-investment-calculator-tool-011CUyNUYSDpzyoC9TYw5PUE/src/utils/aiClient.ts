// Minimal AI client abstraction for optional Claude integration.
// This keeps core flows heuristic-first; AI is an enhancement when enabled.

export type AIInputsMapping = {
  technologyType?: string;
  currentStage?: string;
  targetMarket?: string;
  teamStatus?: string;
  regulatoryEnvironment?: string;
  geographicLocation?: string;
  rationale?: string; // brief explanation
};

export type AINeedsMatrixRefinement = {
  personas: string[];
  needs: string[];
  values: (string | number)[][];
  notes?: string[]; // any clarifications or inferred scales
};

// Feature flag from Vite env: define VITE_CLAUDE_API_KEY and optionally VITE_CLAUDE_MODEL
const CLAUDE_API_KEY = (import.meta as any).env?.VITE_CLAUDE_API_KEY as string | undefined;
const CLAUDE_MODEL = ((import.meta as any).env?.VITE_CLAUDE_MODEL as string | undefined) || 'claude-3-5-sonnet-latest';

export const aiEnabled = Boolean(CLAUDE_API_KEY);

function hashText(text: string): string {
  // Simple hash for caching
  let h = 0;
  for (let i = 0; i < text.length; i++) { h = (h << 5) - h + text.charCodeAt(i); h |= 0; }
  return String(h >>> 0);
}

// Naive localStorage cache to reduce spend during iteration
function getCache<T>(key: string): T | undefined {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : undefined; } catch { return undefined; }
}
function setCache<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// Classify project free text into calculator inputs
export async function classifyInputsFromText(text: string): Promise<AIInputsMapping | null> {
  if (!aiEnabled || !CLAUDE_API_KEY) return null;
  const key = `ai:inputs:${CLAUDE_MODEL}:${hashText(text).slice(0,8)}`;
  const hit = getCache<AIInputsMapping>(key); if (hit) return hit;
  const prompt = `You are mapping innovation project text to fixed dropdowns used by a financial calculator. Return concise JSON fields only.
Fields: technologyType, currentStage, targetMarket, teamStatus, regulatoryEnvironment, geographicLocation, rationale.
Use values that are common business terms (e.g., "+AI platform", "Prototype", "Healthcare", "Founding team", "Highly regulated", "Bay Area").
Text:\n${text.slice(0, 6000)}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 400,
      temperature: 0.2,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.content?.[0]?.text || '';
  try {
    const json = JSON.parse(content);
    setCache(key, json);
    return json as AIInputsMapping;
  } catch {
    return { rationale: content } as AIInputsMapping;
  }
}

// Ask AI to clarify/standardize a messy needs matrix (labels, scale hints)
export async function refineNeedsMatrix(textSummary: string, matrix: { personas: string[]; needs: string[]; values: (string|number)[][]; }): Promise<AINeedsMatrixRefinement | null> {
  if (!aiEnabled || !CLAUDE_API_KEY) return null;
  const key = `ai:matrix:${CLAUDE_MODEL}:${hashText(JSON.stringify(matrix)).slice(0,8)}`;
  const hit = getCache<AINeedsMatrixRefinement>(key); if (hit) return hit;
  const prompt = `Given a persona x need matrix and brief project context, normalize labels and infer scale. Return JSON with possibly adjusted personas/needs/values and 1-3 short notes. Keep numeric values numeric.
Context:\n${textSummary.slice(0, 1200)}\nMatrix JSON:\n${JSON.stringify(matrix).slice(0, 8000)}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 800,
      temperature: 0.2,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.content?.[0]?.text || '';
  try {
    const json = JSON.parse(content);
    setCache(key, json);
    return json as AINeedsMatrixRefinement;
  } catch {
    return null;
  }
}

// Note: Wire these helpers in guarded by aiEnabled to prevent accidental spend.
