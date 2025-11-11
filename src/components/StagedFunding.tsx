import type { StagedFunding, FundingPhase } from '../types/calculator';
import { formatCurrency } from '../utils/calculations';

interface StagedFundingDisplayProps {
  stagedFunding: StagedFunding;
  onBack: () => void;
}

function PhaseCard({ phase, index }: { phase: FundingPhase; index: number }) {
  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-600' },
    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-600' },
  ];

  const color = colors[index] || colors[0];

  return (
    <div className={`${color.bg} ${color.border} border-2 rounded-lg p-6 relative`}>
      {/* Phase number badge */}
      <div className={`absolute -top-3 -left-3 w-8 h-8 ${color.badge} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
        {index + 1}
      </div>

      <h3 className={`text-xl font-bold ${color.text} mb-4`}>{phase.name}</h3>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Investment</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(phase.investment)}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Duration</div>
          <div className="text-xl font-bold text-gray-900">
            {phase.duration} months
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Objective</div>
          <p className="text-sm text-gray-600">{phase.objective}</p>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Key Milestone</div>
          <p className="text-sm text-gray-600">{phase.keyMilestone}</p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Decision Gate
          </div>
          <p className="text-sm text-gray-600">{phase.decisionGate}</p>
        </div>
      </div>
    </div>
  );
}

export default function StagedFundingDisplay({ stagedFunding, onBack }: StagedFundingDisplayProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Staged Funding Model</h1>
        <p className="text-xl text-gray-600">
          De-risk your investment with a phased approach
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-2">Total Investment</div>
          <div className="text-4xl font-bold text-blue-700">
            {formatCurrency(stagedFunding.totalInvestment)}
          </div>
          <div className="text-sm text-gray-600 mt-2">Across all 3 phases</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-2">Total Timeline</div>
          <div className="text-4xl font-bold text-green-700">
            {stagedFunding.totalDuration} months
          </div>
          <div className="text-sm text-gray-600 mt-2">From start to completion</div>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="mb-12">
        <div className="relative">
          {/* Timeline line (desktop only) */}
          <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200 hidden lg:block" />

          {/* Phase cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stagedFunding.phases.map((phase, index) => (
              <PhaseCard key={phase.name} phase={phase} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Why Stage Your Investment?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-900">Reduce Risk</span>
            </div>
            <p className="text-sm text-gray-600">
              Validate assumptions before committing full capital
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium text-gray-900">Track Progress</span>
            </div>
            <p className="text-sm text-gray-600">
              Clear milestones to measure success at each stage
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-900">Optimize Capital</span>
            </div>
            <p className="text-sm text-gray-600">
              Deploy resources efficiently as you de-risk
            </p>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          ← Back to Results
        </button>
      </div>
    </div>
  );
}
