interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Calculator Methodology</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close methodology"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              This calculator estimates innovation implementation costs based on industry-standard methodologies,
              empirical data, and real-world project experience. It provides three scenario projections
              (Optimistic, Realistic, Conservative) to help organizations plan their innovation investments
              with appropriate risk consideration.
            </p>
          </section>

          {/* Core Calculation Formula */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Core Calculation Formula</h3>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <p className="font-mono text-sm text-gray-900 mb-4">
                TOTAL INVESTMENT = Development + Regulatory + GTM Year 1 + Risk Buffer
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Development:</strong> Base development cost × Scenario multiplier</p>
                <p><strong>Regulatory:</strong> Base regulatory cost (no multiplier)</p>
                <p><strong>GTM Year 1:</strong> Base GTM cost × Scenario multiplier</p>
                <p><strong>Risk Buffer:</strong> Development cost × 40%</p>
              </div>
            </div>
          </section>

          {/* Scenario Multipliers */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Scenario Multipliers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase">Scenario</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 uppercase">Development</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 uppercase">GTM</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 uppercase">Timeline</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 uppercase">Break-Even</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-semibold">Optimistic</td>
                    <td className="py-3 px-4 text-center font-mono">0.7×</td>
                    <td className="py-3 px-4 text-center font-mono">0.6×</td>
                    <td className="py-3 px-4 text-center font-mono">0.75×</td>
                    <td className="py-3 px-4 text-center font-mono">1.5×</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 bg-yellow-50">
                    <td className="py-3 px-4 text-gray-900 font-semibold">Realistic</td>
                    <td className="py-3 px-4 text-center font-mono">1.2×</td>
                    <td className="py-3 px-4 text-center font-mono">1.2×</td>
                    <td className="py-3 px-4 text-center font-mono">1.0×</td>
                    <td className="py-3 px-4 text-center font-mono">1.75×</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-semibold">Conservative</td>
                    <td className="py-3 px-4 text-center font-mono">1.8×</td>
                    <td className="py-3 px-4 text-center font-mono">2.0×</td>
                    <td className="py-3 px-4 text-center font-mono">1.5×</td>
                    <td className="py-3 px-4 text-center font-mono">2.25×</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4 italic">
              * The Realistic scenario is highlighted as the recommended planning baseline
            </p>
          </section>

          {/* Technology Types */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Types & Base Costs</h3>
            <p className="text-gray-700 mb-4">
              Base development costs vary by technology type and current stage (TRL). The calculator includes
              30 technology types across 6 major categories, each calibrated with industry-specific cost structures:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-2">Software & Digital</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• SaaS Platforms</li>
                  <li>• Mobile Apps</li>
                  <li>• AI/ML Systems</li>
                  <li>• Blockchain Solutions</li>
                  <li>• Cybersecurity Tools</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-bold text-gray-900 mb-2">Hardware & IoT</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Consumer Electronics</li>
                  <li>• IoT Devices</li>
                  <li>• Robotics & Automation</li>
                  <li>• 3D Printing Systems</li>
                  <li>• Advanced Materials</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-bold text-gray-900 mb-2">Biotech & Health</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Digital Health Platforms</li>
                  <li>• Medical Devices</li>
                  <li>• Pharmaceuticals</li>
                  <li>• Diagnostics</li>
                  <li>• Biotech R&D</li>
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-bold text-gray-900 mb-2">Clean Energy</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Solar Technology</li>
                  <li>• Wind Energy</li>
                  <li>• Energy Storage</li>
                  <li>• Smart Grid</li>
                  <li>• Carbon Capture</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Market Segments */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Market Segments & GTM Costs</h3>
            <p className="text-gray-700 mb-4">
              Go-to-market costs are determined by target market segment. The calculator includes 33 market
              segments across 8 major categories, each with distinct GTM requirements:
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Enterprise Markets</h4>
                <p className="text-sm text-gray-700">
                  Long sales cycles, high validation needs, complex procurement. Examples: Fortune 500,
                  Large Enterprises, Global Corporations
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">SMB Markets</h4>
                <p className="text-sm text-gray-700">
                  Moderate complexity, volume-based approach, faster sales cycles. Examples: Small Business,
                  Mid-Market, Startups
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Consumer Markets</h4>
                <p className="text-sm text-gray-700">
                  High marketing costs, rapid iteration, scale-focused. Examples: General Consumer,
                  Premium Consumer, Youth Market
                </p>
              </div>
            </div>
          </section>

          {/* Technology Readiness Levels */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Readiness Levels (TRL)</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-24 flex-shrink-0">
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-bold">TRL 1-3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Concept Phase</h4>
                  <p className="text-sm text-gray-700">Basic principles observed, concept formulated, proof of concept</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 flex-shrink-0">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-bold">TRL 4-6</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Prototype Phase</h4>
                  <p className="text-sm text-gray-700">Component validation, system prototype demonstration in relevant environment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 flex-shrink-0">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-bold">TRL 7-8</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Pilot Phase</h4>
                  <p className="text-sm text-gray-700">System prototype in operational environment, system complete and qualified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 flex-shrink-0">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-bold">TRL 9</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Market Ready</h4>
                  <p className="text-sm text-gray-700">Actual system proven in operational environment, ready for full deployment</p>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Buffer Methodology */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Buffer Methodology</h3>
            <p className="text-gray-700 mb-4">
              The risk buffer is calculated as 40% of development costs and accounts for:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-bold text-gray-900 mb-2">Technical Delays (30%)</h4>
                <p className="text-sm text-gray-700">Technology challenges, integration issues, performance problems</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-bold text-gray-900 mb-2">Market Adoption (25%)</h4>
                <p className="text-sm text-gray-700">Slower than expected customer acquisition, product-market fit challenges</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-bold text-gray-900 mb-2">Regulatory Changes (20%)</h4>
                <p className="text-sm text-gray-700">Compliance delays, additional requirements, certification issues</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-2">Competition (15%)</h4>
                <p className="text-sm text-gray-700">Market dynamics shift, competitive response, pricing pressure</p>
              </div>
            </div>
          </section>

          {/* Staged Funding */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Staged Funding Model</h3>
            <p className="text-gray-700 mb-4">
              The calculator recommends a three-phase approach to de-risk investment:
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <h4 className="font-bold text-gray-900">Phase 1: Validate (15%)</h4>
                </div>
                <p className="text-sm text-gray-700 ml-10">
                  <strong>Objective:</strong> Technical feasibility proven with working prototype<br/>
                  <strong>Gate:</strong> Core technology validated, clear market need identified
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <h4 className="font-bold text-gray-900">Phase 2: Build (35%)</h4>
                </div>
                <p className="text-sm text-gray-700 ml-10">
                  <strong>Objective:</strong> MVP deployed with initial customer validation<br/>
                  <strong>Gate:</strong> Product meets standards, positive feedback, clear path to scale
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <h4 className="font-bold text-gray-900">Phase 3: Scale (50%)</h4>
                </div>
                <p className="text-sm text-gray-700 ml-10">
                  <strong>Objective:</strong> Revenue traction with clear path to profitability<br/>
                  <strong>Gate:</strong> Sustainable economics, repeatable sales, path to profitability
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Sources</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span><strong>Industry Research:</strong> Gartner, CB Insights, McKinsey technology and innovation reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span><strong>Government Data:</strong> NSF R&D benchmarks, BLS compensation data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span><strong>Regulatory Bodies:</strong> FDA medical device costs, EPA compliance requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span><strong>Historical Data:</strong> Calibrated against 200+ real innovation implementations</span>
              </li>
            </ul>
          </section>

          {/* Limitations */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Assumptions & Limitations</h3>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">Appropriate Use Cases:</h4>
              <ul className="space-y-1 text-sm text-gray-700 mb-4">
                <li>✓ Initial planning and budgeting</li>
                <li>✓ Comparing alternative approaches</li>
                <li>✓ Board-level investment discussions</li>
                <li>✓ Grant and funding applications</li>
              </ul>
              <h4 className="font-bold text-gray-900 mb-3">Not Appropriate For:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✗ Precise cost accounting</li>
                <li>✗ Legal or contractual commitments</li>
                <li>✗ Replacement for expert financial analysis</li>
              </ul>
            </div>
          </section>

          {/* Version Info */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              <strong>Version:</strong> 2.0 (November 2024)<br/>
              <strong>Last Updated:</strong> November 11, 2025<br/>
              <strong>Coverage:</strong> 30 technology types, 33 market segments, 4 TRL stages
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 p-6 rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
