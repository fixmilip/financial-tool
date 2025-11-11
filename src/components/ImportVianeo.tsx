import React, { useState } from 'react';
import { parseSavedResourceHtml, parseVianeoFileList, type VianeoProject } from '../utils/vianeoParser';
import { mapVianeoToUserInputs } from '../utils/vianeoMapper';
// For Vianeo imports, use the multiplier-aware engine so geo/team/regulatory influence totals
import { calculateInvestment, calculateStagedFunding } from '../utils/calculator';
import { generatePDF } from '../utils/pdfGenerator';
import { normalizeMatrix, aggregateCosts } from '../utils/needsMatrix';

// no-op helper removed; PDF generator triggers download internally

export const ImportVianeo: React.FC = () => {
  const [projects, setProjects] = useState<VianeoProject[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [cellCosts, setCellCosts] = useState<number[][]>([]);
  const [showCostHeatmap, setShowCostHeatmap] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErrors([]);
    try {
      // If multiple files (folder upload), parse the set; otherwise parse single HTML
      setStatus('Reading input...');
      if (files.length > 1) {
        setStatus('Parsing Vianeo folder...');
        const parsed = await parseVianeoFileList(files);
        setProjects(parsed);
        setStatus(`Found ${parsed.length} project(s) from folder.`);
      } else {
        const f = files[0];
        if (/\.(html?|json)$/i.test(f.name)) {
          const text = await f.text();
          const isHtml = /\.(html?)$/i.test(f.name) || /<html|<head|<body/i.test(text);
          const parsed = isHtml ? parseSavedResourceHtml(text) : await parseVianeoFileList([f]);
          setProjects(parsed);
          setStatus(`Found ${parsed.length} project(s).`);
        } else {
          setStatus('Unsupported file type. Please select saved_resource.html or the entire folder.');
        }
      }
    } catch (err: any) {
  setErrors((prev: string[]) => [...prev, `Parse error: ${err?.message || String(err)}`]);
      setStatus('Failed to parse input. See errors.');
    }
  }

  // Calculate cost heatmap for matrix
  const calculateCostHeatmap = () => {
    if (!projects[0]?.needsMatrix) return;

    try {
      const inputs = mapVianeoToUserInputs(projects[0]);
      const res = calculateInvestment(inputs);
      const norm = normalizeMatrix(
        projects[0].needsMatrix.personas,
        projects[0].needsMatrix.needs,
        projects[0].needsMatrix.values
      );

      const realistic = res.scenarios.find((s: any) => s.name === 'Realistic') || res.scenarios[1];
      const costs: number[][] = [];

      for (let i = 0; i < norm.personas.length; i++) {
        costs[i] = [];
        for (let j = 0; j < norm.needs.length; j++) {
          const w = norm.weights[i]?.[j] ?? 0;
          const needLabel = norm.needs[j];
          const sNeed = needLabel.toLowerCase();
          let devW = 0.5, gtmW = 0.4, regW = 0.1;
          if (/regulat|compliance|approval|certif|fda|epa|hipaa|gdpr/.test(sNeed)) {
            devW = 0.2; gtmW = 0.1; regW = 0.7;
          } else if (/market|sales|pricing|acquisition|demand|distribution|channel|brand|marketing/.test(sNeed)) {
            devW = 0.2; gtmW = 0.7; regW = 0.1;
          } else if (/tech|product|prototype|mvp|build|engineering|performance|scal(ing|ability)|feature/.test(sNeed)) {
            devW = 0.7; gtmW = 0.2; regW = 0.1;
          }
          const base = realistic.breakdown.development * devW + realistic.breakdown.gtmYear1 * gtmW + realistic.breakdown.regulatory * regW;
          costs[i][j] = Math.round(base * w);
        }
      }

      setCellCosts(costs);
      setShowCostHeatmap(true);
    } catch (err: any) {
      setErrors(prev => [...prev, `Heatmap error: ${err?.message || String(err)}`]);
    }
  };

  async function runAndExportAll() {
    if (!projects.length) {
      setStatus('No projects to process.');
      return;
    }

    setProgress({ done: 0, total: projects.length });
    setStatus('Calculating and exporting...');
    const newErrors: string[] = [];

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      try {
        const inputs = mapVianeoToUserInputs(p);
  const results = calculateInvestment(inputs);
  const realistic = results.scenarios.find((s: any) => s.name === 'Realistic') || results.scenarios[1];
  const staged = calculateStagedFunding(realistic);
  // This generator triggers browser download directly, pass project for Needs Matrix page
  generatePDF(inputs, results, staged, p);
      } catch (err: any) {
        const msg = `Project "${p.title}" failed: ${err?.message || String(err)}`;
        newErrors.push(msg);
        // keep going with remaining projects
      } finally {
        setProgress((prev: { done: number; total: number } | null) => prev ? { ...prev, done: prev.done + 1 } : { done: i + 1, total: projects.length });
      }
    }

    if (newErrors.length) setErrors((prev: string[]) => [...prev, ...newErrors]);
    setStatus('Processing finished.');
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Import Vianeo export</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm">Select saved_resource.html or JSON:</label>
        <input type="file" accept=".html,.htm,.json" onChange={onFile} />
        <label className="text-sm mt-2">Or import the entire exported folder:</label>
  {/* Folder upload (Chrome/Edge/Safari). We cast to any to allow non-standard webkitdirectory prop safely. */}
  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
  <input type="file" onChange={onFile} multiple {...({ webkitdirectory: '' } as any)} />
      </div>
      {status && <p className="mt-2 text-sm">{status}</p>}

      {errors.length > 0 && (
        <div className="mt-2 text-sm text-red-600">
          <strong>Errors:</strong>
          <ul>
              {errors.map((e: string, idx: number) => <li key={idx}>{e}</li>)}
          </ul>
        </div>
      )}

      {projects.length > 0 && (
        <>
          <div className="mt-4">
            <h4 className="font-medium">Detected projects</h4>
            <ul className="list-disc ml-5">
              {projects.map((p) => (
                <li key={p.id} className="mb-1">
                  <strong>{p.title}</strong> — {p.description ? `${p.description.slice(0, 120)}${p.description.length>120?'…':''}` : 'No description'} ({p.tags?.join(', ') || 'no tags'}) — tasks: {p.tasks?.length ?? 0}
                    {p.fileTypes && (
                      <div className="text-xs text-gray-500 mt-1">
                        File types: {Object.entries(p.fileTypes).map(([ext, count]) => `${ext}:${count}`).join(' ')}
                      </div>
                    )}
                    {p.assets?.length ? (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {p.assets.slice(0, 8).map((a) => {
                            if (a.type === 'image' && a.file) {
                              const url = URL.createObjectURL(a.file);
                              return (
                                <div key={a.path} className="relative group">
                                  <img
                                    src={url}
                                    alt={a.name}
                                    className="w-20 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 cursor-pointer transition-all"
                                    onLoad={() => URL.revokeObjectURL(url)}
                                    onClick={() => setSelectedImage(url)}
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                    {a.name}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                          {p.assets.length > 8 && (
                            <span className="text-xs text-gray-400 self-center">
                              +{p.assets.length - 8} more images
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null}
                    {p.diagnostics?.length ? (
                      <details className="mt-2 text-xs">
                        <summary className="cursor-pointer text-blue-600">Diagnostics (signals)</summary>
                        <ul className="list-disc ml-4 max-h-40 overflow-auto">
                          {p.diagnostics.map((d,i) => <li key={i}>{d}</li>)}
                        </ul>
                      </details>
                    ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Needs Qualification Matrix with Cost Heatmap */}
          {projects[0]?.needsMatrix && (
            <div className="mt-6 p-6 border-2 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="text-xl font-bold text-gray-900">Needs Qualification Matrix</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Source: {projects[0].needsMatrix?.source || 'embedded'}
                  </p>
                </div>
                <button
                  onClick={calculateCostHeatmap}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {showCostHeatmap ? 'Refresh' : 'Show'} Cost Heatmap
                </button>
              </div>

              {showCostHeatmap && cellCosts.length > 0 && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                  <h6 className="font-semibold text-sm text-gray-900 mb-2">Legend:</h6>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
                      <span>Low Cost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded"></div>
                      <span>Medium Cost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 border border-orange-300 rounded"></div>
                      <span>High Cost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 border border-red-300 rounded"></div>
                      <span>Very High Cost</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-auto max-h-96 border-2 rounded-lg bg-white shadow-inner">
                <table className="min-w-full text-xs border-collapse">
                  <thead className="sticky top-0 bg-gray-100 shadow-sm z-10">
                    <tr>
                      <th className="p-3 text-left border-2 border-gray-300 font-bold">Persona</th>
                      {projects[0].needsMatrix.needs.map((n, i) => (
                        <th key={i} className="p-3 text-left border-2 border-gray-300 font-bold">{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects[0].needsMatrix.personas.map((persona, rIdx) => (
                      <tr key={rIdx} className="hover:bg-blue-50 transition-colors">
                        <td className="p-3 border-2 border-gray-300 font-semibold bg-gray-50">{persona}</td>
                        {projects[0].needsMatrix?.values[rIdx].map((val, cIdx) => {
                          const cost = showCostHeatmap && cellCosts[rIdx]?.[cIdx] !== undefined
                            ? cellCosts[rIdx][cIdx]
                            : 0;

                          // Calculate max cost for color scaling
                          const maxCost = showCostHeatmap && cellCosts.length > 0
                            ? Math.max(...cellCosts.flat())
                            : 1;

                          const intensity = cost / maxCost;
                          let bgColor = 'bg-white';
                          let borderColor = 'border-gray-200';

                          if (showCostHeatmap && intensity > 0) {
                            if (intensity >= 0.75) {
                              bgColor = 'bg-red-100';
                              borderColor = 'border-red-300';
                            } else if (intensity >= 0.5) {
                              bgColor = 'bg-orange-100';
                              borderColor = 'border-orange-300';
                            } else if (intensity >= 0.25) {
                              bgColor = 'bg-yellow-100';
                              borderColor = 'border-yellow-300';
                            } else {
                              bgColor = 'bg-green-100';
                              borderColor = 'border-green-300';
                            }
                          }

                          return (
                            <td
                              key={cIdx}
                              className={`p-3 border-2 ${borderColor} ${bgColor} cursor-pointer hover:shadow-lg hover:scale-105 transition-all relative group`}
                              onClick={() => {
                                try {
                                  const inputs = mapVianeoToUserInputs(projects[0]);
                                  const res = calculateInvestment(inputs);
                                  const norm = normalizeMatrix(projects[0].needsMatrix!.personas, projects[0].needsMatrix!.needs, projects[0].needsMatrix!.values);
                                  const w = norm.weights[rIdx]?.[cIdx] ?? 0;
                                  const estimate = (() => {
                                    const realistic = res.scenarios.find((s: any) => s.name === 'Realistic') || res.scenarios[1];
                                    const needLabel = projects[0].needsMatrix!.needs[cIdx];
                                    const sNeed = needLabel.toLowerCase();
                                    let devW = 0.5, gtmW = 0.4, regW = 0.1;
                                    if (/regulat|compliance|approval|certif|fda|epa|hipaa|gdpr/.test(sNeed)) { devW=0.2; gtmW=0.1; regW=0.7; }
                                    else if (/market|sales|pricing|acquisition|demand|distribution|channel|brand|marketing/.test(sNeed)) { devW=0.2; gtmW=0.7; regW=0.1; }
                                    else if (/tech|product|prototype|mvp|build|engineering|performance|scal(ing|ability)|feature/.test(sNeed)) { devW=0.7; gtmW=0.2; regW=0.1; }
                                    const base = realistic.breakdown.development*devW + realistic.breakdown.gtmYear1*gtmW + realistic.breakdown.regulatory*regW;
                                    return Math.round(base * w);
                                  })();
                                  // eslint-disable-next-line no-alert
                                  alert(`Estimated incremental cost to act on need "${projects[0].needsMatrix?.needs[cIdx]}" for persona "${persona}": $${estimate.toLocaleString()}`);
                                } catch (err: any) {
                                  setErrors(prev => [...prev, `Matrix estimate error: ${err?.message || String(err)}`]);
                                }
                              }}
                            >
                              <div className="font-medium">{String(val)}</div>
                              {showCostHeatmap && cost > 0 && (
                                <div className="text-xs font-bold text-gray-700 mt-1">
                                  ${(cost / 1000).toFixed(0)}K
                                </div>
                              )}
                              <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                                Click for details
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
                  onClick={() => {
                    try {
                      const inputs = mapVianeoToUserInputs(projects[0]);
                      const res = calculateInvestment(inputs);
                      const norm = normalizeMatrix(projects[0].needsMatrix!.personas, projects[0].needsMatrix!.needs, projects[0].needsMatrix!.values);
                      const agg = aggregateCosts(res, norm);
                      // eslint-disable-next-line no-console
                      console.log('Needs Matrix scale:', norm.scale);
                      console.log('Aggregate cost per Persona:', agg.perPersona);
                      console.log('Aggregate cost per Need:', agg.perNeed);
                      // eslint-disable-next-line no-alert
                      alert('Aggregates printed to console: per Persona and per Need');
                    } catch (err: any) {
                      setErrors(prev => [...prev, `Aggregation error: ${err?.message || String(err)}`]);
                    }
                  }}
                >
                  View Aggregate Costs
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
                  onClick={() => {
                    setShowCostHeatmap(false);
                    setCellCosts([]);
                  }}
                >
                  Hide Heatmap
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button onClick={runAndExportAll} className="btn btn-primary">Generate Reports for all</button>
            <button onClick={async () => {
              try {
                const inputs = mapVianeoToUserInputs(projects[0]);
                const res = calculateInvestment(inputs);
                // eslint-disable-next-line no-console
                console.log('Preview results', res);
                  // Persona need cost highlight example (simple illustration):
                  // We estimate acting on "Need X" for "Persona Y" as 5% of Realistic development + 10% of GTM Year1.
                  const realistic = res.scenarios.find((s: any) => s.name === 'Realistic') || res.scenarios[1];
                  const needCost = Math.round((realistic.breakdown.development * 0.05) + (realistic.breakdown.gtmYear1 * 0.10));
                  console.log('Example Need X / Persona Y estimated cost:', needCost);
                alert('Preview printed to console.');
              } catch (err: any) {
                setErrors(prev => [...prev, `Preview error: ${err?.message || String(err)}`]);
              }
            }} className="btn">Preview first</button>
          </div>

          {progress && (
            <div className="mt-3 text-sm">{progress.done} / {progress.total} exported</div>
          )}
        </>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              Close ×
            </button>
            <img
              src={selectedImage}
              alt="Vianeo export"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportVianeo;