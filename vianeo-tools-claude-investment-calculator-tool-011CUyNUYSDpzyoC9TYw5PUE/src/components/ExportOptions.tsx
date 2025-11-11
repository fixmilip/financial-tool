import { useState } from 'react';
import type { UserInputs, CalculationResults } from '../types/calculator';
import { generatePDF } from '../utils/pdfGenerator';
import { saveCalculation } from '../utils/storage';
import { calculateStagedFunding } from '../utils/calculations';

interface ExportOptionsProps {
  inputs: UserInputs;
  results: CalculationResults;
  onShowMethodology?: () => void;
}

export default function ExportOptions({ inputs, results, onShowMethodology }: ExportOptionsProps) {
  const [savedLink, setSavedLink] = useState<string>('');
  const [showLinkCopied, setShowLinkCopied] = useState(false);

  const handleDownloadPDF = () => {
    const stagedFunding = calculateStagedFunding(results);
    generatePDF(inputs, results, stagedFunding);
  };

  const handleSaveCalculation = () => {
    const id = saveCalculation(inputs, results);
    const link = `${window.location.origin}${window.location.pathname}?load=${id}`;
    setSavedLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(savedLink);
    setShowLinkCopied(true);
    setTimeout(() => setShowLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Export & Share</h2>

        <div className="space-y-4">
          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Download PDF Report
          </button>

          {/* Save calculation button */}
          <button
            onClick={handleSaveCalculation}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Calculation
          </button>

          {/* Shareable link */}
          {savedLink && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-2">
                Calculation saved! Share this link:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={savedLink}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  {showLinkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Methodology link */}
          {onShowMethodology && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onShowMethodology}
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Complete Methodology
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
