// === Render grids ===

function renderTick(tick, fnMap, colIdx) {
  if (tick === true) {
    return '<span class="tick-full">\u2713</span>';
  } else if (tick === "partial") {
    const fnNum = fnMap[colIdx];
    const sup = fnNum ? `<sup>${fnNum}</sup>` : '';
    return `<span class="tick-partial" data-fn="${fnNum || ''}">(&#x2713;)${sup}</span>`;
  }
  return '<span class="tick-dash">\u2013</span>';
}

function renderGrid(projects, bodyId) {
  const tbody = document.getElementById(bodyId);
  tbody.innerHTML = projects.map((p, rowIdx) => {
    const cls = p.highlight ? ' class="highlight"' : '';
    const cells = p.ticks.map((t, i) =>
      `<td>${renderTick(t, p.fnMap, i)}</td>`
    ).join('');
    return `<tr${cls}><td class="sticky-col protocol-name">${p.name}</td>${cells}</tr>`;
  }).join('');
}

// Only render if tbody is empty (static HTML already has rows for SEO)
if (!document.getElementById('full-grid-body').children.length)
  renderGrid(fullProjects, 'full-grid-body');
if (!document.getElementById('glance-grid-body').children.length)
  renderGrid(glanceProjects, 'glance-grid-body');

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
function renderFootnotes(footnotes, containerId) {
  const container = document.getElementById(containerId);
  const sorted = Object.keys(footnotes).map(Number).sort((a, b) => a - b);
  container.innerHTML = sorted.map(n => {
    return `<div class="footnote-item"><sup>${n}</sup>${footnotes[n]}</div>`;
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
const tooltip = document.getElementById('tooltip');
const allFootnotes = { ...fullFootnotes, ...glanceFootnotes };

document.addEventListener('mouseover', (e) => {
  const partial = e.target.closest('.tick-partial');
  if (!partial) return;
  const fnNum = parseInt(partial.dataset.fn);
  const text = allFootnotes[fnNum];
  if (!text) return;
  tooltip.textContent = text;
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

const fullShareText = `Privacy Protocol Grid — 10 protocols, 17 properties, all sourced.\n\nWho\u2019s building what in crypto privacy.\n\n${siteUrl}`;
const glanceShareText = `Privacy Protocols at a Glance — 10 protocols, 6 properties that matter most.\n\n${siteUrl}`;

document.getElementById('share-full-twitter').href =
  'https://x.com/intent/tweet?text=' + encodeURIComponent(fullShareText);
document.getElementById('share-glance-twitter').href =
  'https://x.com/intent/tweet?text=' + encodeURIComponent(glanceShareText);
