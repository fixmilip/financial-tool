import { useState } from 'react';
import type { UserInputs, TechnologyType, Stage, Market, TeamStatus, RegulatoryEnvironment } from '../types/calculator';
import { TECHNOLOGY_GROUPS, MARKET_GROUPS, GEOGRAPHIC_LOCATIONS } from '../utils/coefficients';
import { ImportVianeo } from './ImportVianeo';

interface InputFormProps {
  onSubmit: (inputs: UserInputs) => void;
  onLoadExample?: (example: UserInputs) => void;
}

export default function InputForm({ onSubmit, onLoadExample }: InputFormProps) {
  const [formData, setFormData] = useState<Partial<UserInputs>>({});

  const stages: Stage[] = [
    'Concept (TRL 1-3)',
    'Prototype (TRL 4-6)',
    'Pilot (TRL 7-8)',
    'Market Ready (TRL 9)',
  ];

  const teamStatuses: TeamStatus[] = [
    'No team yet',
    'Partial team',
    'Full team assembled',
  ];

  const regulatoryEnvs: RegulatoryEnvironment[] = [
    'None',
    'Moderate',
    'Heavy (FDA/EPA level)',
  ];

  const isFormComplete = () => {
    return (
      formData.technologyType &&
      formData.currentStage &&
      formData.targetMarket &&
      formData.geographicLocation &&
      formData.teamStatus &&
      formData.regulatoryEnvironment
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormComplete()) {
      onSubmit(formData as UserInputs);
    }
  };

  const handleChange = (field: keyof UserInputs, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const examples = [
    {
      name: 'EdTech + K-12',
      data: {
        technologyType: 'EdTech/Learning Platform' as TechnologyType,
        currentStage: 'Prototype (TRL 4-6)' as Stage,
        targetMarket: 'K-12 Education Systems' as Market,
        geographicLocation: 'Austin',
        teamStatus: 'Partial team' as TeamStatus,
        regulatoryEnvironment: 'Moderate' as RegulatoryEnvironment,
      },
    },
    {
      name: 'Space Tech + Military',
      data: {
        technologyType: 'Space Technology' as TechnologyType,
        currentStage: 'Pilot (TRL 7-8)' as Stage,
        targetMarket: 'Military/Defense' as Market,
        geographicLocation: 'San Francisco Bay Area',
        teamStatus: 'Full team assembled' as TeamStatus,
        regulatoryEnvironment: 'Heavy (FDA/EPA level)' as RegulatoryEnvironment,
      },
    },
    {
      name: 'FinTech + SMB',
      data: {
        technologyType: 'FinTech/Financial Services' as TechnologyType,
        currentStage: 'Market Ready (TRL 9)' as Stage,
        targetMarket: 'Small Business B2B (<500 employees)' as Market,
        geographicLocation: 'Remote US',
        teamStatus: 'Full team assembled' as TeamStatus,
        regulatoryEnvironment: 'Moderate' as RegulatoryEnvironment,
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Innovation Investment Calculator</h1>
        <p className="text-gray-600 mb-8">
          Get an evidence-based estimate of your innovation investment requirements across 30 technology types and 33 market segments
        </p>

        {onLoadExample && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Start Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.name}
                  onClick={() => {
                    setFormData(example.data);
                    onLoadExample(example.data);
                  }}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Import from Vianeo</h2>
          <p className="text-sm text-gray-600 mb-3">Optionally import your Vianeo export folder or saved_resource.html to auto-generate a financial report.</p>
          <ImportVianeo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technology Type * <span className="text-gray-500 text-xs">(30 options across 6 groups)</span>
            </label>
            <select
              value={formData.technologyType || ''}
              onChange={(e) => handleChange('technologyType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select technology type...</option>
              {Object.entries(TECHNOLOGY_GROUPS).map(([groupName, technologies]) => (
                <optgroup key={groupName} label={groupName}>
                  {technologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Development Stage *
            </label>
            <select
              value={formData.currentStage || ''}
              onChange={(e) => handleChange('currentStage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select development stage...</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Market * <span className="text-gray-500 text-xs">(33 segments across 8 groups)</span>
            </label>
            <select
              value={formData.targetMarket || ''}
              onChange={(e) => handleChange('targetMarket', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select target market...</option>
              {Object.entries(MARKET_GROUPS).map(([groupName, markets]) => (
                <optgroup key={groupName} label={groupName}>
                  {markets.map((market) => (
                    <option key={market} value={market}>
                      {market}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geographic Location *
            </label>
            <select
              value={formData.geographicLocation || ''}
              onChange={(e) => handleChange('geographicLocation', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select location...</option>
              {GEOGRAPHIC_LOCATIONS.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name} (Cost Index: {location.index})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Status *
            </label>
            <select
              value={formData.teamStatus || ''}
              onChange={(e) => handleChange('teamStatus', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select team status...</option>
              {teamStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regulatory Environment *
            </label>
            <select
              value={formData.regulatoryEnvironment || ''}
              onChange={(e) => handleChange('regulatoryEnvironment', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select regulatory environment...</option>
              {regulatoryEnvs.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!isFormComplete()}
            className={`w-full py-3 px-6 rounded-md text-white font-medium transition-colors ${
              isFormComplete()
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Calculate Investment
          </button>
        </form>
      </div>
    </div>
  );
}
