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
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.assets.slice(0,6).map(a => {
                          if (a.type === 'image' && a.file) {
                            const url = URL.createObjectURL(a.file);
                            return <img key={a.path} src={url} alt={a.name} className="w-16 h-16 object-cover rounded border" onLoad={() => URL.revokeObjectURL(url)} />;
                          }
                          return null;
                        })}
                        {p.assets.length > 6 && <span className="text-xs text-gray-400">+{p.assets.length-6} more</span>}
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

          {/* Needs Qualification Matrix */}
          {projects[0]?.needsMatrix && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h5 className="font-semibold mb-2">Needs Qualification Matrix</h5>
              <p className="text-xs text-gray-600 mb-3">Source: {projects[0].needsMatrix?.source || 'embedded'} — Click a cell to estimate incremental cost.</p>
              <div className="overflow-auto max-h-80 border rounded bg-white">
                <table className="min-w-full text-xs">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="p-2 text-left border">Persona</th>
                      {projects[0].needsMatrix.needs.map((n, i) => (
                        <th key={i} className="p-2 text-left border">{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects[0].needsMatrix.personas.map((persona, rIdx) => (
                      <tr key={rIdx} className="hover:bg-blue-50">
                        <td className="p-2 border font-medium">{persona}</td>
                        {projects[0].needsMatrix?.values[rIdx].map((val, cIdx) => (
                          <td
                            key={cIdx}
                            className="p-2 border cursor-pointer"
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
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs text-gray-700">
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white"
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
                >Compute aggregate costs</button>
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
    </div>
  );
};

export default ImportVianeo;