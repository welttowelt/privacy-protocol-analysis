// === Render grids ===

// Column 10 of the full grid ("Scalable private transactions") renders a
// per-protocol metric subtext under the tick. All other cells are plain ticks.
const SCALABLE_COL_IDX = 10;

function renderTickInner(tick, fnMap, colIdx) {
  if (tick === true) {
    return '<span class="tick-full">\u2713</span>';
  } else if (tick === "partial") {
    const fnNum = fnMap[colIdx];
    const sup = fnNum ? `<sup>${fnNum}</sup>` : '';
    return `<span class="tick-partial" data-fn="${fnNum || ''}">(&#x2713;)${sup}</span>`;
  }
  return '<span class="tick-dash">\u2013</span>';
}

function renderTick(tick, fnMap, colIdx, metric) {
  const inner = renderTickInner(tick, fnMap, colIdx);
  if (metric) {
    return `<div class="tick-with-metric">${inner}<div class="tick-metric">${metric}</div></div>`;
  }
  return inner;
}

function renderProtocolName(project) {
  const badge = project.status ? `<span class="protocol-status">${project.status}</span>` : '';
  return `${project.name}${badge}`;
}

function renderGrid(projects, bodyId, isFull) {
  const tbody = document.getElementById(bodyId);
  tbody.innerHTML = projects.map((p, rowIdx) => {
    const classes = [
      p.highlight ? 'highlight' : '',
      p.status ? `status-${p.status}` : '',
    ].filter(Boolean).join(' ');
    const cls = classes ? ` class="${classes}"` : '';
    const cells = p.ticks.map((t, i) => {
      const metric = (isFull && i === SCALABLE_COL_IDX && p.scalable) ? p.scalable : null;
      return `<td>${renderTick(t, p.fnMap, i, metric)}</td>`;
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
    if (!source) return '';
    return `<a href="${source.url}" target="_blank" rel="noopener">${source.label}</a>`;
  }).filter(Boolean).join(' <span aria-hidden="true">\u00b7</span> ');
  if (!links) return '';
  return `<div class="footnote-sources"><span>Sources:</span> ${links}</div>`;
}

function renderFootnotes(footnotes, containerId) {
  const container = document.getElementById(containerId);
  const sorted = Object.keys(footnotes).map(Number).sort((a, b) => a - b);
  container.innerHTML = sorted.map(n => {
    const note = footnotes[n];
    return `<div class="footnote-item"><div class="footnote-copy"><sup>${n}</sup><span>${getFootnoteText(note)}</span></div>${renderFootnoteSources(note)}</div>`;
  }).join('');
}

renderFootnotes(fullFootnotes, 'footnotes-full-list');
renderFootnotes(glanceFootnotes, 'footnotes-glance-list');

const totalFn = Object.keys(fullFootnotes).length + Object.keys(glanceFootnotes).length;
document.getElementById('footnote-count').textContent = `(${totalFn})`;

// === Definitions ===
const defList = document.getElementById('definitions-list');
defList.innerHTML = definitions.map(group => {
  const entries = group.entries.map(e =>
    `<div class="def-entry"><strong>${e.term}</strong><p>${e.def}</p></div>`
  ).join('');
  return `<div class="def-category">${group.category}</div>${entries}`;
}).join('');

// === Tooltip on partial ticks ===
// Full grid and glance grid reuse the same footnote numbers (1–17) to
// reference different text. Look up from the correct table based on which
// grid the tick belongs to, otherwise tooltips for overlapping numbers
// would show the wrong footnote.
const tooltip = document.getElementById('tooltip');

document.addEventListener('mouseover', (e) => {
  const partial = e.target.closest('.tick-partial');
  if (!partial) return;
  const fnNum = parseInt(partial.dataset.fn);
  if (!fnNum) return;
  const footnotes = partial.closest('.glance-grid') ? glanceFootnotes : fullFootnotes;
  const note = footnotes[fnNum];
  if (!note) return;
  tooltip.textContent = getFootnoteText(note);
  tooltip.classList.add('visible');
});

document.addEventListener('mousemove', (e) => {
  if (!tooltip.classList.contains('visible')) return;
  const x = Math.min(e.clientX + 12, window.innerWidth - tooltip.offsetWidth - 16);
  const y = Math.min(e.clientY + 12, window.innerHeight - tooltip.offsetHeight - 16);
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
});

document.addEventListener('mouseout', (e) => {
  const partial = e.target.closest('.tick-partial');
  if (partial) tooltip.classList.remove('visible');
});

// === Twitter/X share links ===
const siteUrl = 'https://privacygrid.dev/';
const fullProtocolCount = fullProjects.length;
const fullPropertyCount = fullProjects[0]?.ticks.length || 0;
const glancePropertyCount = glanceProjects[0]?.ticks.length || 0;

const fullShareText = `Privacy Protocol Grid — ${fullProtocolCount} protocols, ${fullPropertyCount} properties, sources listed in footnotes.\n\nWho\u2019s building what in crypto privacy.\n\n${siteUrl}`;
const glanceShareText = `Privacy Protocols at a Glance — ${fullProtocolCount} protocols, ${glancePropertyCount} properties that matter most.\n\n${siteUrl}`;

document.getElementById('share-full-twitter').href =
  'https://x.com/intent/tweet?text=' + encodeURIComponent(fullShareText);
document.getElementById('share-glance-twitter').href =
  'https://x.com/intent/tweet?text=' + encodeURIComponent(glanceShareText);
