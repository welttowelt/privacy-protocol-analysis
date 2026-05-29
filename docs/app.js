// === Render grids ===

// Column 10 of the full grid ("Scalable private transactions") renders a
// per-protocol metric subtext under the tick. All other cells are plain ticks.
const SCALABLE_COL_IDX = 10;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function getTickLabel(tick) {
  if (tick === true) return 'full support';
  if (tick === 'partial') return 'partial support';
  return 'not supported';
}

function getColumnTerm(isFull, colIdx) {
  const item = isFull ? fullColumnTerms[colIdx] : glanceColumnHelp[colIdx];
  if (!item) return `Column ${colIdx + 1}`;
  return typeof item === 'string' ? item : item.term;
}

function getFootnoteNumber(fnMap, colIdx) {
  const num = Number(fnMap?.[colIdx]);
  return Number.isInteger(num) && num > 0 ? num : null;
}

function isSafeHttpUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function renderTickInner(tick, fnMap, colIdx, gridKind) {
  const fnNum = getFootnoteNumber(fnMap, colIdx);
  const fnPrefix = gridKind === 'glance' ? 'glance' : 'full';
  const sup = fnNum ? `<sup><a class="footnote-link" href="#fn-${fnPrefix}-${fnNum}" aria-label="Footnote ${fnNum}">${fnNum}</a></sup>` : '';
  const footnoteClass = fnNum ? ' tick-with-footnote' : '';
  const footnoteData = fnNum ? ` data-fn="${fnNum}"` : '';
  if (tick === true) {
    return `<span class="tick-full${footnoteClass}"${footnoteData}>\u2713${sup}</span>`;
  } else if (tick === "partial") {
    return `<span class="tick-partial${footnoteClass}"${footnoteData}>(&#x2713;)${sup}</span>`;
  }
  return `<span class="tick-dash${footnoteClass}"${footnoteData}>\u2013${sup}</span>`;
}

function renderTick(tick, fnMap, colIdx, metric, gridKind) {
  const inner = renderTickInner(tick, fnMap, colIdx, gridKind);
  if (metric) {
    return `<div class="tick-with-metric">${inner}<div class="tick-metric">${metric}</div></div>`;
  }
  return inner;
}

function renderProtocolName(project) {
  const badge = project.status ? `<span class="protocol-status">${escapeHtml(project.status)}</span>` : '';
  return `${escapeHtml(project.name)}${badge}`;
}

function renderGrid(projects, bodyId, isFull) {
  const tbody = document.getElementById(bodyId);
  const gridKind = isFull ? 'full' : 'glance';
  tbody.innerHTML = projects.map((p, rowIdx) => {
    const classes = [
      p.highlight ? 'highlight' : '',
      p.status ? `status-${p.status}` : '',
    ].filter(Boolean).join(' ');
    const cls = classes ? ` class="${classes}"` : '';
    const cells = p.ticks.map((t, i) => {
      const metric = (isFull && i === SCALABLE_COL_IDX && p.scalable) ? p.scalable : null;
      const fnNum = getFootnoteNumber(p.fnMap, i);
      const term = getColumnTerm(isFull, i);
      const ariaParts = [`${p.name}: ${term}: ${getTickLabel(t)}`];
      if (metric) ariaParts.push(`metric ${metric}`);
      if (fnNum) ariaParts.push(`footnote ${fnNum}`);
      return `<td aria-label="${escapeAttribute(ariaParts.join(', '))}">${renderTick(t, p.fnMap || {}, i, metric, gridKind)}</td>`;
    }).join('');
    return `<tr${cls}><td class="sticky-col protocol-name">${renderProtocolName(p)}</td>${cells}</tr>`;
  }).join('');
}

// Always render from the data file so the tables stay in sync.
// Pass isFull=true for the property grid so the scalability metric subtext
// appears on the Scalable column; glance grid gets plain ticks.
renderGrid(fullProjects, 'full-grid-body', true);
renderGrid(glanceProjects, 'glance-grid-body', false);

// === Tabs ===
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    document.getElementById('tab-full').classList.toggle('hidden', target !== 'full');
    document.getElementById('tab-glance').classList.toggle('hidden', target !== 'glance');
  });
});

// === Footnotes ===
function getFootnoteText(note) {
  return typeof note === 'string' ? note : note.text;
}

function renderFootnoteSources(note) {
  if (typeof note === 'string' || !note.sources?.length) return '';
  const links = note.sources.map(id => {
    const source = sourceRefs[id];
    if (!source || !isSafeHttpUrl(source.url)) return '';
    return `<a href="${escapeAttribute(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a>`;
  }).filter(Boolean).join(' <span aria-hidden="true">\u00b7</span> ');
  if (!links) return '';
  return `<div class="footnote-sources"><span>Sources:</span> ${links}</div>`;
}

function renderFootnotes(footnotes, containerId, prefix) {
  const container = document.getElementById(containerId);
  const sorted = Object.keys(footnotes).map(Number).sort((a, b) => a - b);
  container.innerHTML = sorted.map(n => {
    const note = footnotes[n];
    return `<div class="footnote-item" id="fn-${prefix}-${n}"><div class="footnote-copy"><sup><a href="#fn-${prefix}-${n}">${n}</a></sup><span>${escapeHtml(getFootnoteText(note))}</span></div>${renderFootnoteSources(note)}</div>`;
  }).join('');
}

renderFootnotes(fullFootnotes, 'footnotes-full-list', 'full');
renderFootnotes(glanceFootnotes, 'footnotes-glance-list', 'glance');

const totalFn = Object.keys(fullFootnotes).length + Object.keys(glanceFootnotes).length;
document.getElementById('footnote-count').textContent = `(${totalFn})`;

// === Definitions ===
const defList = document.getElementById('definitions-list');
defList.innerHTML = definitions.map(group => {
  const entries = group.entries.map(e =>
    `<div class="def-entry"><strong>${escapeHtml(e.term)}</strong><p>${escapeHtml(e.def)}</p></div>`
  ).join('');
  return `<div class="def-category">${escapeHtml(group.category)}</div>${entries}`;
}).join('');

function getDefinition(term) {
  for (const group of definitions) {
    const match = group.entries.find(entry => entry.term === term);
    if (match) return match.def;
  }
  return '';
}

function attachHeaderTooltips(tableId, terms) {
  const headers = document.querySelectorAll(`#${tableId} .header-row th:not(.sticky-col)`);
  headers.forEach((header, idx) => {
    const item = terms[idx];
    if (!item) return;
    const term = typeof item === 'string' ? item : item.term;
    const help = typeof item === 'string' ? getDefinition(term) : item.def;
    if (!help) return;
    header.classList.add('has-column-help');
    header.dataset.columnHelp = help;
    header.setAttribute('aria-label', `${term}: ${help}`);
    header.tabIndex = 0;
    header.insertAdjacentHTML('beforeend', '<span class="column-help-dot" aria-hidden="true">?</span>');
  });
}

attachHeaderTooltips('full-grid', fullColumnTerms);
attachHeaderTooltips('glance-grid', glanceColumnHelp);

// === Tooltips ===
// Full grid and glance grid reuse some footnote numbers to
// reference different text. Look up from the correct table based on which
// grid the tick belongs to, otherwise tooltips for overlapping numbers
// would show the wrong footnote.
const tooltip = document.getElementById('tooltip');

function getTooltipText(target) {
  const header = target.closest('[data-column-help]');
  if (header) return header.dataset.columnHelp;

  const footnoted = target.closest('.tick-with-footnote');
  if (!footnoted) return '';
  const fnNum = parseInt(footnoted.dataset.fn);
  if (!fnNum) return '';
  const footnotes = footnoted.closest('.glance-grid') ? glanceFootnotes : fullFootnotes;
  const note = footnotes[fnNum];
  return note ? getFootnoteText(note) : '';
}

function positionTooltipNearElement(element) {
  const rect = element.getBoundingClientRect();
  const x = Math.min(rect.left + 12, window.innerWidth - tooltip.offsetWidth - 16);
  const y = Math.min(rect.bottom + 8, window.innerHeight - tooltip.offsetHeight - 16);
  tooltip.style.left = Math.max(16, x) + 'px';
  tooltip.style.top = Math.max(16, y) + 'px';
}

document.addEventListener('mouseover', (e) => {
  const text = getTooltipText(e.target);
  if (!text) return;
  tooltip.textContent = text;
  tooltip.classList.add('visible');
});

document.addEventListener('focusin', (e) => {
  const text = getTooltipText(e.target);
  if (!text) return;
  tooltip.textContent = text;
  tooltip.classList.add('visible');
  positionTooltipNearElement(e.target);
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('.footnote-link');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  const details = target.closest('details');
  if (details) {
    details.open = true;
  }
});

document.addEventListener('mousemove', (e) => {
  if (!tooltip.classList.contains('visible')) return;
  const x = Math.min(e.clientX + 12, window.innerWidth - tooltip.offsetWidth - 16);
  const y = Math.min(e.clientY + 12, window.innerHeight - tooltip.offsetHeight - 16);
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
});

document.addEventListener('mouseout', (e) => {
  const tooltipTarget = e.target.closest('[data-column-help], .tick-with-footnote');
  if (tooltipTarget) tooltip.classList.remove('visible');
});

document.addEventListener('focusout', (e) => {
  const tooltipTarget = e.target.closest('[data-column-help], .tick-with-footnote');
  if (tooltipTarget) tooltip.classList.remove('visible');
});

// === Twitter/X share links ===
const siteUrl = 'https://privacygrid.dev/';
const fullProtocolCount = fullProjects.length;
const fullPropertyCount = fullProjects[0]?.ticks.length || 0;
const glancePropertyCount = glanceProjects[0]?.ticks.length || 0;

const fullShareText = `Privacy Protocol Grid — ${fullProtocolCount} protocols, ${fullPropertyCount} properties, sources listed in footnotes.\n\nWho\u2019s building what in crypto privacy.\n\n${siteUrl}`;
const glanceShareText = `Privacy Protocols at a Glance — ${fullProtocolCount} protocols, ${glancePropertyCount} high-signal properties.\n\n${siteUrl}`;

document.getElementById('share-full-twitter').href =
  'https://x.com/intent/tweet?text=' + encodeURIComponent(fullShareText);
document.getElementById('share-glance-twitter').href =
  'https://x.com/intent/tweet?text=' + encodeURIComponent(glanceShareText);
