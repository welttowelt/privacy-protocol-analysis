#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const dataPath = path.join(docsDir, 'data.js');
const indexPath = path.join(docsDir, 'index.html');

function loadData() {
  const code = fs.readFileSync(dataPath, 'utf8');
  return vm.runInNewContext(
    `${code}
;({ sourceRefs, fullProjects, fullFootnotes, glanceProjects, glanceFootnotes, definitions, fullColumnTerms, glanceColumnHelp });`,
    {},
    { filename: dataPath }
  );
}

function isSafeHttpUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidTick(value) {
  return value === true || value === false || value === 'partial';
}

function footnoteIdSet(footnotes) {
  return new Set(Object.keys(footnotes).map(Number));
}

function expect(condition, message, errors) {
  if (!condition) errors.push(message);
}

function validateFootnotes(label, footnotes, sourceRefs, errors, usedSources) {
  const ids = Object.keys(footnotes).map(Number).sort((a, b) => a - b);
  ids.forEach((id, index) => {
    expect(Number.isInteger(id) && id > 0, `${label} footnote id is invalid: ${id}`, errors);
    expect(id === index + 1, `${label} footnotes should be sequential; expected ${index + 1}, found ${id}`, errors);

    const note = footnotes[id];
    expect(note && typeof note === 'object' && !Array.isArray(note), `${label} footnote ${id} should use sourced(text, sources)`, errors);
    expect(typeof note?.text === 'string' && note.text.trim().length > 0, `${label} footnote ${id} is missing text`, errors);
    expect(Array.isArray(note?.sources) && note.sources.length > 0, `${label} footnote ${id} is missing sources`, errors);

    for (const sourceId of note?.sources || []) {
      usedSources.add(sourceId);
      expect(Boolean(sourceRefs[sourceId]), `${label} footnote ${id} references unknown source "${sourceId}"`, errors);
    }
  });
}

function validateProjects(label, projects, expectedTicks, footnotes, errors) {
  const footnoteIds = footnoteIdSet(footnotes);

  expect(Array.isArray(projects) && projects.length > 0, `${label} projects should be a non-empty array`, errors);

  projects.forEach((project, rowIndex) => {
    expect(typeof project.name === 'string' && project.name.trim().length > 0, `${label} row ${rowIndex + 1} is missing a name`, errors);
    expect(Array.isArray(project.ticks), `${label} ${project.name || rowIndex + 1} is missing ticks`, errors);
    expect(project.ticks?.length === expectedTicks, `${label} ${project.name || rowIndex + 1} has ${project.ticks?.length || 0} ticks; expected ${expectedTicks}`, errors);

    project.ticks?.forEach((tick, colIndex) => {
      expect(isValidTick(tick), `${label} ${project.name} column ${colIndex + 1} has invalid tick "${tick}"`, errors);
      if (tick === 'partial') {
        expect(Boolean(project.fnMap?.[colIndex]), `${label} ${project.name} column ${colIndex + 1} is partial without a footnote`, errors);
      }
    });

    for (const [colIndexRaw, footnoteIdRaw] of Object.entries(project.fnMap || {})) {
      const colIndex = Number(colIndexRaw);
      const footnoteId = Number(footnoteIdRaw);
      expect(Number.isInteger(colIndex) && colIndex >= 0 && colIndex < expectedTicks, `${label} ${project.name} has invalid fnMap column ${colIndexRaw}`, errors);
      expect(Number.isInteger(footnoteId) && footnoteIds.has(footnoteId), `${label} ${project.name} column ${colIndexRaw} references missing footnote ${footnoteIdRaw}`, errors);
    }
  });
}

function validateVersionFiles(errors) {
  const data = fs.readFileSync(dataPath, 'utf8');
  const versionFiles = fs.readdirSync(docsDir)
    .filter((name) => /^data_v\d+\.js$/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

  expect(versionFiles.length > 0, 'No cache-busted data_v*.js files found', errors);

  for (const file of versionFiles) {
    const filePath = path.join(docsDir, file);
    expect(fs.readFileSync(filePath, 'utf8') === data, `${file} is not in sync with docs/data.js`, errors);
  }

  const latest = versionFiles[versionFiles.length - 1];
  const index = fs.readFileSync(indexPath, 'utf8');
  expect(index.includes(`<script src="${latest}"></script>`), `docs/index.html should load latest data file ${latest}`, errors);
}

function main() {
  const errors = [];
  const usedSources = new Set();
  const data = loadData();

  expect(data.fullColumnTerms.length === 17, `fullColumnTerms has ${data.fullColumnTerms.length} entries; expected 17`, errors);
  expect(data.glanceColumnHelp.length === 6, `glanceColumnHelp has ${data.glanceColumnHelp.length} entries; expected 6`, errors);

  const definitionTerms = new Set(data.definitions.flatMap((group) => group.entries.map((entry) => entry.term)));
  for (const term of data.fullColumnTerms) {
    expect(definitionTerms.has(term), `Missing definition for "${term}"`, errors);
  }

  validateProjects('Full grid', data.fullProjects, data.fullColumnTerms.length, data.fullFootnotes, errors);
  validateProjects('At a glance', data.glanceProjects, data.glanceColumnHelp.length, data.glanceFootnotes, errors);

  expect(data.fullProjects.length === data.glanceProjects.length, 'Full grid and at-a-glance row counts differ', errors);
  data.fullProjects.forEach((project, index) => {
    expect(data.glanceProjects[index]?.name === project.name, `Row ${index + 1} differs between grids: "${project.name}" vs "${data.glanceProjects[index]?.name}"`, errors);
  });

  validateFootnotes('Full grid', data.fullFootnotes, data.sourceRefs, errors, usedSources);
  validateFootnotes('At a glance', data.glanceFootnotes, data.sourceRefs, errors, usedSources);

  for (const [sourceId, source] of Object.entries(data.sourceRefs)) {
    expect(typeof source.label === 'string' && source.label.trim().length > 0, `Source "${sourceId}" is missing a label`, errors);
    expect(isSafeHttpUrl(source.url), `Source "${sourceId}" must use an absolute http(s) URL`, errors);
    expect(usedSources.has(sourceId), `Source "${sourceId}" is defined but not used`, errors);
  }

  validateVersionFiles(errors);

  if (errors.length) {
    console.error(`Validation failed with ${errors.length} issue(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`Validated ${data.fullProjects.length} protocols, ${data.fullColumnTerms.length} full-grid properties, ${data.glanceColumnHelp.length} glance properties, ${Object.keys(data.sourceRefs).length} sources.`);
}

main();
