// Vianeo export parsing utilities
// This module provides resilient, heuristic-based parsing of a Vianeo exported
// folder or single saved_resource.html file. Because formats can drift, the
// parser is defensive: it extracts candidate project blocks, normalizes text
// content, and exposes a minimal typed object for downstream mapping.

export interface VianeoProject {
	id: string;
	title: string;
	description?: string;
	tags?: string[];
	tasks?: { id: string; title: string; status?: string }[];
	rawFields: Record<string, string>; // original field label -> value
	sourceFiles: string[]; // which files contributed
	fileTypes?: Record<string, number>; // counts by extension
	diagnostics?: string[]; // lines flagged as potentially relevant (strategy, risk, milestones)
	assets?: { path: string; type: 'image' | 'text' | 'html' | 'json'; name: string; file?: File }[];
	needsMatrix?: NeedsMatrix; // Optional persona x need grid extracted from HTML
}

export interface NeedsMatrix {
	personas: string[]; // row labels
	needs: string[]; // column labels
	values: (string | number)[][]; // cells
	source?: string; // which file
}

/**
 * Parse a single saved_resource.html (or similar) export string.
 * The HTML often contains repeated panels / cards each representing a sprint
 * or project element. We attempt to identify blocks by data-* attributes or
 * recognizable class name patterns.
 */
export function parseSavedResourceHtml(html: string): VianeoProject[] {
	if (typeof DOMParser === 'undefined') {
		throw new Error('DOMParser not available (must run in browser context)');
	}
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

		const projects: VianeoProject[] = [];

	// Strategy 1: Look for elements with data-project-id
	const projectNodes = Array.from(doc.querySelectorAll('[data-project-id]'));
	if (projectNodes.length) {
		projectNodes.forEach((el, idx) => {
			const id = (el.getAttribute('data-project-id') || `p${idx}`).trim();
			const title = (el.querySelector('[data-project-title]')?.textContent || el.querySelector('h1, h2, h3')?.textContent || `Project ${idx + 1}`).trim();
			const description = (el.querySelector('[data-project-description]')?.textContent || '').trim() || undefined;
			const tags = Array.from(el.querySelectorAll('[data-tag], .tag, .badge'))
				.map(t => t.textContent?.trim())
				.filter(Boolean) as string[];
			const tasks = Array.from(el.querySelectorAll('[data-task-id]')).map(t => ({
				id: t.getAttribute('data-task-id') || '',
				title: (t.querySelector('[data-task-title]')?.textContent || t.textContent || '').trim(),
				status: t.getAttribute('data-task-status') || undefined,
			})).filter(t => t.title);

			const rawFields: Record<string, string> = {};
			// Collect label/value pairs (common pattern: label elements followed by value spans)
			Array.from(el.querySelectorAll('label')).forEach(label => {
				const txt = label.textContent?.trim();
				if (!txt) return;
				// nextElementSibling sometimes holds the value
				const val = label.nextElementSibling?.textContent?.trim();
				if (val) rawFields[txt] = val;
			});
					const needsMatrix = extractNeedsMatrixFromNode(el);
					projects.push({ id, title, description, tags, tasks, rawFields, sourceFiles: ['saved_resource.html'], needsMatrix });
		});
		return projects;
	}

	// Strategy 2: Fallback – treat the document as a single project
	const title = (doc.querySelector('title')?.textContent || doc.querySelector('h1, h2')?.textContent || 'Vianeo Project').trim();

	const rawFields: Record<string, string> = {};
	// Heuristic extraction: definition lists, table rows, or key:value patterns
	doc.querySelectorAll('dl').forEach(dl => {
		const dts = Array.from(dl.querySelectorAll('dt'));
		dts.forEach(dt => {
			const key = dt.textContent?.trim();
			const dd = dt.nextElementSibling;
			const val = dd?.textContent?.trim();
			if (key && val) rawFields[key] = val;
		});
	});
	doc.querySelectorAll('table').forEach(table => {
		Array.from(table.querySelectorAll('tr')).forEach(tr => {
			const cells = Array.from(tr.querySelectorAll('th,td')).map(c => c.textContent?.trim() || '');
			if (cells.length === 2 && cells[0] && cells[1]) {
				rawFields[cells[0]] = cells[1];
			}
		});
	});

	// Attempt to derive description from meta or first paragraph
	const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || doc.querySelector('p')?.textContent?.trim();

		projects.push({
		id: 'project-1',
		title,
		description: description?.slice(0, 500),
		tags: undefined,
		tasks: [],
		rawFields,
			sourceFiles: ['saved_resource.html'],
			needsMatrix: extractNeedsMatrixFromNode(doc.body || doc.documentElement),
	});
	return projects;
}

/** Parse a collection of files from the Vianeo export folder. */
export async function parseVianeoFileList(files: FileList | File[]): Promise<VianeoProject[]> {
	const arr: File[] = Array.from(files as any);
	// Consider nested folders (webkitdirectory). We'll use both file name and relative path for heuristics.
	const getPath = (f: File) => (f as any).webkitRelativePath || f.name;
	const htmlFiles = arr.filter(f => /saved_resource/i.test(getPath(f)) || /\.(html?|htm)$/i.test(getPath(f)));
	const jsonFiles = arr.filter(f => /\.json$/i.test(getPath(f)) || /global[-_]?data/i.test(getPath(f)));
	const textFiles = arr.filter(f => /\.(txt|csv|md)$/i.test(getPath(f)));
		const imageFiles = arr.filter(f => /\.(png|jpe?g|webp|svg)$/i.test(getPath(f)));

	const projects: VianeoProject[] = [];

	// Parse HTML sources
	for (const f of htmlFiles) {
		try {
			const text = await f.text();
				const parsed = parseSavedResourceHtml(text);
			parsed.forEach(p => {
				// annotate source file
				if (!p.sourceFiles.includes(f.name)) p.sourceFiles.push(f.name);
					p.fileTypes = p.fileTypes || {};
					p.fileTypes['html'] = (p.fileTypes['html'] || 0) + 1;
					if (p.needsMatrix && !p.needsMatrix.source) p.needsMatrix.source = getPath(f);
				projects.push(p);
			});
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn('Failed to parse HTML file', f.name, err);
		}
	}

	// Parse JSON-like datasets (could contain structured project data)
		for (const f of jsonFiles) {
		try {
			const text = await f.text();
			const data = JSON.parse(text);
			if (Array.isArray(data)) {
				data.forEach((item, idx) => {
					if (item && typeof item === 'object') {
						const id = String(item.id || item.uuid || `${f.name}-${idx}`);
						const title = String(item.title || item.name || `Item ${idx + 1}`);
						const description = item.description ? String(item.description) : undefined;
						const rawFields: Record<string, string> = {};
						Object.entries(item).forEach(([k, v]) => {
							if (v == null) return;
							if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
								rawFields[k] = String(v);
							}
						});
						projects.push({ id, title, description, tags: undefined, tasks: [], rawFields, sourceFiles: [f.name] });
					}
				});
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn('Failed to parse JSON-like file', f.name, err);
		}
	}

		// Parse simple text files to enrich raw fields (keyword extraction)
		for (const f of textFiles) {
			try {
				const text = (await f.text()).slice(0, 5000); // cap for safety
				// Attach as a supplemental project if none exist yet
				if (projects.length === 0) {
					projects.push({
						id: 'project-text-1',
						title: 'Vianeo Project (text import)',
						description: undefined,
						tags: undefined,
						tasks: [],
						rawFields: { [getPath(f)]: text },
						sourceFiles: [getPath(f)],
							fileTypes: { [f.name.split('.').pop() || 'txt']: 1 },
							diagnostics: extractDiagnostics(text),
								assets: [],
					});
				} else {
					// Merge into first project to improve mapping corpus
					const p = projects[0];
					p.rawFields[getPath(f)] = text;
					if (!p.sourceFiles.includes(getPath(f))) p.sourceFiles.push(getPath(f));
						const ext = f.name.split('.').pop() || 'txt';
						p.fileTypes = p.fileTypes || {};
						p.fileTypes[ext] = (p.fileTypes[ext] || 0) + 1;
						p.diagnostics = Array.from(new Set([...(p.diagnostics || []), ...extractDiagnostics(text)]));
				}
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn('Failed to read text file', f.name, err);
			}
		}

				// Attach image assets to first project (common case: single project export)
				if (imageFiles.length) {
					if (projects.length === 0) {
						projects.push({
							id: 'project-assets-1',
							title: 'Vianeo Project',
							rawFields: {},
							sourceFiles: [],
							assets: [],
							diagnostics: [],
							fileTypes: {},
							tags: [],
							tasks: [],
						});
					}
					const p = projects[0];
					p.assets = p.assets || [];
					p.fileTypes = p.fileTypes || {};
					for (const img of imageFiles) {
						p.assets.push({ path: getPath(img), type: 'image', name: img.name, file: img });
						p.fileTypes['image'] = (p.fileTypes['image'] || 0) + 1;
						if (!p.sourceFiles.includes(getPath(img))) p.sourceFiles.push(getPath(img));
					}
				}

	// De-duplicate by id, preferring earlier entries
	const byId: Record<string, VianeoProject> = {};
	for (const p of projects) {
		if (!byId[p.id]) byId[p.id] = p;
	}
	return Object.values(byId);
}

// Utility to quickly sanitize raw text for keyword matching
export function normalize(value: string): string {
	return value.toLowerCase();
}

// Extract lines that may carry strategic / stage / regulatory signals
function extractDiagnostics(text: string): string[] {
	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	const interesting = lines.filter(l => /risk|milestone|strategy|regulat|team|market|geo|timeline|roadmap|deployment|ecosystem|network/i.test(l));
	return interesting.slice(0, 50); // cap list
}

// Heuristic: find a table that looks like a persona x needs matrix
function extractNeedsMatrixFromNode(root: ParentNode | Element | Document): NeedsMatrix | undefined {
	const tables = Array.from((root as Element).querySelectorAll?.('table') || []);
	if (!tables.length) return undefined;
	// prefer larger grids
	let best: HTMLTableElement | null = null;
	let bestScore = 0;
	for (const t of tables) {
		const rows = Array.from(t.querySelectorAll('tr'));
		if (rows.length < 3) continue; // need header + at least 2 personas
		const colsCount = Math.max(...rows.map(r => r.querySelectorAll('th,td').length));
		const score = rows.length * colsCount;
		if (colsCount >= 3 && score > bestScore) { best = t as HTMLTableElement; bestScore = score; }
	}
	if (!best) return undefined;

	const rows = Array.from(best.querySelectorAll('tr'));
	if (!rows.length) return undefined;
	const headerCellsAll = Array.from(rows[0].querySelectorAll('th,td'));
	const headerTexts = headerCellsAll.map(c => (c.textContent || '').trim());

	// Determine persona column index
	let personaCol = 0;
	for (let i = 0; i < headerTexts.length; i++) {
		const h = headerTexts[i].toLowerCase();
		if (/^persona$|user|segment|role/.test(h)) { personaCol = i; break; }
	}

	// Determine needs labels from headers excluding persona column; synthesize if missing
	const needs: string[] = [];
	for (let i = 0; i < headerTexts.length; i++) {
		if (i === personaCol) continue;
		const label = headerTexts[i]?.trim();
		needs.push(label || `Need ${needs.length + 1}`);
	}

	const personas: string[] = [];
	const values: (string | number)[][] = [];
	for (let r = 1; r < rows.length; r++) {
		const cells = Array.from(rows[r].querySelectorAll('th,td'));
		if (!cells.length) continue;
		const persona = (cells[personaCol]?.textContent || '').trim();
		if (!persona) continue;
		personas.push(persona);
		const rowVals: (string | number)[] = [];
		for (let c = 0, idx = 0; c < cells.length; c++) {
			if (c === personaCol) continue;
			const txt = (cells[c].textContent || '').trim();
			const num = parseFloat(txt.replace(/[^0-9.\-]/g, ''));
			rowVals.push(!isNaN(num) ? num : txt);
			idx++;
		}
		values.push(rowVals);
	}

	// If header row didn't actually carry needs (all blank), try fallback: assume first column personas and generate needs by column count
	const hasAnyNeedLabel = needs.some(n => n && n.toLowerCase() !== 'persona');
	if ((!hasAnyNeedLabel || !needs.length) && values[0]) {
		const cols = values[0].length;
		for (let i = 0; i < cols; i++) needs[i] = needs[i] || `Need ${i + 1}`;
	}

	if (!needs.length || !personas.length) return undefined;
	const targetCols = needs.length;
	values.forEach(row => { if (row.length > targetCols) row.length = targetCols; while (row.length < targetCols) row.push(''); });
	return { personas, needs, values };
}

