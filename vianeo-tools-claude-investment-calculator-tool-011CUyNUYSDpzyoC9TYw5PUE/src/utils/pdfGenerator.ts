import jsPDF from 'jspdf';
import type { UserInputs, CalculationResults, StagedFunding } from '../types/calculator';
import type { VianeoProject } from './vianeoParser';
import { normalizeMatrix, aggregateCosts } from './needsMatrix';
import { formatCurrency } from './calculations';

// Optionally pass a parsed Vianeo project (with needsMatrix) to embed matrix insights
export function generatePDF(inputs: UserInputs, results: CalculationResults, stagedFunding: StagedFunding, project?: VianeoProject): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Page 1: Executive Summary
  pdf.setFontSize(20);
  pdf.text('Innovation Investment Report', margin, 30);

  pdf.setFontSize(12);
  pdf.text('Executive Summary', margin, 50);

  pdf.setFontSize(10);
  let yPos = 60;

  // Inputs
  pdf.text(`Technology: ${inputs.technologyType}`, margin, yPos);
  yPos += 7;
  pdf.text(`Stage: ${inputs.currentStage}`, margin, yPos);
  yPos += 7;
  pdf.text(`Market: ${inputs.targetMarket}`, margin, yPos);
  yPos += 7;
  pdf.text(`Location: ${inputs.geographicLocation}`, margin, yPos);
  yPos += 7;
  pdf.text(`Team: ${inputs.teamStatus}`, margin, yPos);
  yPos += 7;
  pdf.text(`Regulatory: ${inputs.regulatoryEnvironment}`, margin, yPos);
  yPos += 15;

  // Realistic scenario
  const realisticScenario = results.scenarios[1]; // Realistic is middle scenario
  pdf.setFontSize(14);
  pdf.text('Recommended Investment: ' + formatCurrency(realisticScenario.total), margin, yPos);
  yPos += 10;
  pdf.setFontSize(10);
  pdf.text(`Timeline: ${realisticScenario.timeline} months`, margin, yPos);
  yPos += 7;
  pdf.text(`Break-even: ${realisticScenario.breakEven} months`, margin, yPos);
  yPos += 7;
  pdf.text(`Confidence Range: ${formatCurrency(results.confidenceInterval.min)} - ${formatCurrency(results.confidenceInterval.max)}`, margin, yPos);

  // Page 2: Full Breakdown
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Investment Breakdown', margin, 30);

  yPos = 45;
  pdf.setFontSize(10);

  results.scenarios.forEach((scenario) => {
    pdf.setFontSize(12);
    pdf.text(scenario.name, margin, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.text(`Total: ${formatCurrency(scenario.total)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Development: ${formatCurrency(scenario.breakdown.development)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Regulatory: ${formatCurrency(scenario.breakdown.regulatory)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Go-to-Market (3yr): ${formatCurrency(scenario.breakdown.gtm)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Risk Buffer: ${formatCurrency(scenario.breakdown.riskBuffer)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Timeline: ${scenario.timeline} months`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Break-even: ${scenario.breakEven} months`, margin + 5, yPos);
    yPos += 12;
  });

  // Page 3: Staged Funding
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Staged Funding Model', margin, 30);

  yPos = 45;
  stagedFunding.phases.forEach((phase) => {
    pdf.setFontSize(12);
    pdf.text(`${phase.name}`, margin, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.text(`Investment: ${formatCurrency(phase.investment)} (${phase.percentage}%)`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Duration: ${phase.duration} months`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Objective: ${phase.objective}`, margin + 5, yPos);
    yPos += 6;
    const milestone = pdf.splitTextToSize(`Milestone: ${phase.keyMilestone}`, pageWidth - 2 * margin - 5);
    pdf.text(milestone, margin + 5, yPos);
    yPos += 6 * milestone.length;
    const gate = pdf.splitTextToSize(`Decision Gate: ${phase.decisionGate}`, pageWidth - 2 * margin - 5);
    pdf.text(gate, margin + 5, yPos);
    yPos += 6 * gate.length + 10;
  });

  // Page 4: Methodology
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Methodology', margin, 30);

  pdf.setFontSize(10);
  yPos = 45;
  pdf.text('This calculator uses validated industry data including:', margin, yPos);
  yPos += 8;
  pdf.text('• 30 technology types across 6 major categories', margin + 5, yPos);
  yPos += 6;
  pdf.text('• 33 market segments across 8 industry groups', margin + 5, yPos);
  yPos += 6;
  pdf.text('• Geographic cost modifiers for 20+ locations', margin + 5, yPos);
  yPos += 6;
  pdf.text('• Regulatory environment assessments', margin + 5, yPos);
  yPos += 6;
  pdf.text('• Historical project data from 100+ implementations', margin + 5, yPos);
  yPos += 10;
  pdf.text('Core Formula:', margin, yPos);
  yPos += 6;
  pdf.text('TOTAL = (DEVELOPMENT + REGULATORY + GTM) × (1 + 0.40)', margin + 5, yPos);
  yPos += 10;
  pdf.text('For complete methodology, visit:', margin, yPos);
  yPos += 6;
  pdf.text('github.com/therealchandlerbing/vianeo-tools', margin, yPos);

  // Page 5: Needs Matrix (if available)
  if (project?.needsMatrix) {
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('Needs Qualification Matrix', margin, 30);
    pdf.setFontSize(10);
    yPos = 42;
    const m = project.needsMatrix;
    const norm = normalizeMatrix(m.personas, m.needs, m.values);
    const agg = aggregateCosts(results, norm);
    pdf.text(`Scale detected: ${norm.scale}`, margin, yPos); yPos += 6;
    // Top 5 costly needs
    const needEntries = Object.entries(agg.perNeed).sort((a,b)=>b[1]-a[1]).slice(0,5);
    pdf.text('Top Needs (cost estimate):', margin, yPos); yPos += 6;
    needEntries.forEach(([need, cost]) => { pdf.text(`• ${need}: $${cost.toLocaleString()}`, margin+4, yPos); yPos += 5; });
    yPos += 4;
    // Persona aggregate costs
    pdf.text('Persona Aggregate Costs:', margin, yPos); yPos += 6;
    Object.entries(agg.perPersona).forEach(([persona, cost]) => { pdf.text(`• ${persona}: $${cost.toLocaleString()}`, margin+4, yPos); yPos += 5; });
    yPos += 6;
    pdf.text('Matrix (weights 0..1):', margin, yPos); yPos += 6;
    // Render a compact grid (truncate if too large)
    const colWidth = Math.min(30, (pageWidth - margin*2) / (norm.needs.length + 1));
    // Header row
    pdf.setFontSize(8);
    pdf.text('Persona', margin, yPos);
    norm.needs.forEach((n,i) => { pdf.text(n.slice(0,10), margin + colWidth*(i+1), yPos); });
    yPos += 4;
    for (let r=0; r<norm.personas.length && yPos < 270; r++) {
      pdf.text(norm.personas[r].slice(0,10), margin, yPos);
      for (let c=0; c<norm.needs.length; c++) {
        const w = norm.weights[r][c];
        pdf.text(String(Math.round(w*100)/100), margin + colWidth*(c+1), yPos);
      }
      yPos += 4;
    }
    yPos += 4;
    pdf.setFontSize(8);
    pdf.text('Weights derived from numeric/categorical scale; costs allocated across development, GTM, regulatory drivers.', margin, yPos);
  }

  // Footer
  pdf.setFontSize(8);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pdf.internal.pageSize.getHeight() - 10);

  // Download
  pdf.save('innovation-investment-report.pdf');
}
