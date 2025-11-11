import type { UserInputs } from '../types/calculator';
import type { VianeoProject } from './vianeoParser';
import { normalize } from './vianeoParser';

// Keyword dictionaries for heuristic mapping
const TECHNOLOGY_KEYWORDS: Record<string, UserInputs['technologyType']> = {
	software: 'Software/SaaS Platform',
	saas: 'Software/SaaS Platform',
	ai: 'AI/Machine Learning',
	machine: 'AI/Machine Learning',
	biotech: 'Biotech/Pharmaceutical',
	pharma: 'Biotech/Pharmaceutical',
	medtech: 'Medical Devices/MedTech',
	device: 'Medical Devices/MedTech',
	robotics: 'Robotics/Automation',
	hardware: 'Hardware/Physical Product',
	iot: 'IoT/Connected Devices',
	energy: 'Clean Energy/Renewables',
	climate: 'Climate Tech/Carbon',
	nuclear: 'Nuclear/Advanced Nuclear',
	agriculture: 'AgriTech/Precision Agriculture',
	fintech: 'FinTech/Financial Services',
	blockchain: 'Blockchain/Web3',
};

const STAGE_KEYWORDS: Record<string, UserInputs['currentStage']> = {
	concept: 'Concept (TRL 1-3)',
	idea: 'Concept (TRL 1-3)',
	prototype: 'Prototype (TRL 4-6)',
	mvp: 'Prototype (TRL 4-6)',
	pilot: 'Pilot (TRL 7-8)',
	market: 'Market Ready (TRL 9)',
	production: 'Market Ready (TRL 9)',
};

const MARKET_KEYWORDS: Record<string, UserInputs['targetMarket']> = {
	enterprise: 'Large Enterprise (Fortune 1000)',
	fortune: 'Large Enterprise (Fortune 1000)',
	smb: 'Small Business B2B (<500 employees)',
	small: 'Small Business B2B (<500 employees)',
	government: 'Federal/National Government',
	defense: 'Military/Defense',
	hospital: 'Hospital Systems/Integrated Delivery',
	pharma: 'Pharmaceutical/Biotech Companies',
	insurance: 'Insurance/Payers',
	consumer: 'Mass Market Consumer (B2C)',
	retail: 'Mass Market Consumer (B2C)',
	marketplace: 'Two-Sided Marketplace',
	platform: 'Multi-Sided Platform',
	manufacturing: 'Manufacturing/Industrial',
	energy: 'Energy/Utilities',
	agriculture: 'Agriculture/Food Production',
};

const TEAM_KEYWORDS: Record<string, UserInputs['teamStatus']> = {
	'no team': 'No team yet',
	none: 'No team yet',
	partial: 'Partial team',
	core: 'Partial team',
	full: 'Full team assembled',
	complete: 'Full team assembled',
};

const REGULATORY_KEYWORDS: Record<string, UserInputs['regulatoryEnvironment']> = {
	fda: 'Heavy (FDA/EPA level)',
	epa: 'Heavy (FDA/EPA level)',
	hipaa: 'Moderate',
	moderate: 'Moderate',
	heavy: 'Heavy (FDA/EPA level)',
	none: 'None',
	low: 'None',
};

// Default fallback values (ensure deterministic mapping)
const DEFAULT_INPUTS: UserInputs = {
	technologyType: 'Software/SaaS Platform',
	currentStage: 'Prototype (TRL 4-6)',
	targetMarket: 'Mid-Market B2B (500-5000 employees)',
	geographicLocation: 'Remote US',
	teamStatus: 'Partial team',
	regulatoryEnvironment: 'None',
};

function matchFromDict(text: string, dict: Record<string, any>) {
	const n = normalize(text);
	for (const key of Object.keys(dict)) {
		if (n.includes(key)) return dict[key];
	}
	return undefined;
}

export function mapVianeoToUserInputs(project: VianeoProject): UserInputs {
	// Combine searchable corpus from title, description, tag list, plus rawFields values
	const corpusParts: string[] = [project.title, project.description || '', ...(project.tags || [])];
	Object.values(project.rawFields).forEach(v => corpusParts.push(v));
	const corpus = corpusParts.join(' \n ').toLowerCase();

	const technologyType = matchFromDict(corpus, TECHNOLOGY_KEYWORDS) || DEFAULT_INPUTS.technologyType;
	const currentStage = matchFromDict(corpus, STAGE_KEYWORDS) || DEFAULT_INPUTS.currentStage;
	const targetMarket = matchFromDict(corpus, MARKET_KEYWORDS) || DEFAULT_INPUTS.targetMarket;
	const teamStatus = matchFromDict(corpus, TEAM_KEYWORDS) || DEFAULT_INPUTS.teamStatus;
	const regulatoryEnvironment = matchFromDict(corpus, REGULATORY_KEYWORDS) || DEFAULT_INPUTS.regulatoryEnvironment;

	// Location heuristic: look for known city/region tokens -> we map to config list externally.
	let geographicLocation = DEFAULT_INPUTS.geographicLocation;
	if (/bay area|san francisco|silicon valley/.test(corpus)) geographicLocation = 'Bay Area';
	else if (/austin/.test(corpus)) geographicLocation = 'Austin';
	else if (/new york|nyc/.test(corpus)) geographicLocation = 'New York';
	else if (/london/.test(corpus)) geographicLocation = 'London';
	else if (/remote/.test(corpus)) geographicLocation = 'Remote US';

	return {
		technologyType,
		currentStage,
		targetMarket,
		geographicLocation,
		teamStatus,
		regulatoryEnvironment,
	};
}

