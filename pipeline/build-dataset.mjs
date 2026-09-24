/**
 * Construit server/src/data/dataset.json à partir de pipeline/input/.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { normalizeMarket } from './lib/normalize.mjs';
import { filterMarkets } from './lib/filters.mjs';
import { computeIndices } from './lib/indices.mjs';

const DECP_URL = 'https://data.economie.gouv.fr/explore/dataset/decp-v3-marches-valides/';
const LICENCE = 'Etalab 2.0';

const PROJECT_TYPES = [
  'erp',
  'mobile_app',
  'digital_transformation',
  'gpao_mes',
  'digital_twin',
];

/**
 * Parse CSV minimal (pas de guillemets imbriqués complexes nécessaires ici).
 * @param {string} text
 * @returns {Array<Record<string, string>>}
 */
export function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    for (let i = 0; i < headers.length; i++) {
      row[headers[i]] = cells[i] ?? '';
    }
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === 'object') {
    const sorted = {};
    for (const k of Object.keys(value).sort()) {
      sorted[k] = sortKeysDeep(value[k]);
    }
    return sorted;
  }
  return value;
}

function contractSortKey(c) {
  return `${c.project_type}\0${c.id}\0${c.amount_eur}`;
}

function groupByNature(markets) {
  const groups = new Map();
  for (const m of markets) {
    const nat = m.nature || 'unknown';
    if (!groups.has(nat)) groups.set(nat, []);
    groups.get(nat).push(m);
  }
  const by_nature = {};
  for (const nat of [...groups.keys()].sort()) {
    by_nature[nat] = computeIndices(groups.get(nat));
  }
  return by_nature;
}

function loadJsonMarkets(inputDir, basename, projectType) {
  const path = join(inputDir, `${basename}.json`);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const collected_on = data.releve || data.releve_collecte || null;
  const markets = (data.marches || []).map((m) => normalizeMarket(m, projectType));
  return { markets, collected_on, dataset: basename };
}

function loadTwinCsv(inputDir) {
  const path = join(inputDir, 'digital_twin.csv');
  const rows = parseCsv(readFileSync(path, 'utf8'));
  const collected_on = rows[0]?.releve || null;
  const markets = rows.map((r) => normalizeMarket(r, 'digital_twin'));
  return { markets, collected_on, dataset: 'digital_twin' };
}

function loadPrivateCsv(inputDir, filename) {
  return parseCsv(readFileSync(join(inputDir, filename), 'utf8'));
}

/**
 * @param {string} inputDir
 * @returns {Array<Record<string, unknown>>}
 */
function loadPrivateMarket(inputDir) {
  const path = join(inputDir, 'private_prices.json');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  return Array.isArray(data.figures) ? data.figures : [];
}

/**
 * @param {string} inputDir
 */
export function buildDataset(inputDir) {
  const sources = [];
  const allKept = [];
  const excluded_count = {};
  const indices = {};

  const loaders = {
    erp: () => loadJsonMarkets(inputDir, 'erp', 'erp'),
    mobile_app: () => loadJsonMarkets(inputDir, 'mobile_app', 'mobile_app'),
    digital_transformation: () =>
      loadJsonMarkets(inputDir, 'digital_transformation', 'digital_transformation'),
    gpao_mes: () => loadJsonMarkets(inputDir, 'gpao_mes', 'gpao_mes'),
    digital_twin: () => loadTwinCsv(inputDir),
  };

  for (const project_type of PROJECT_TYPES) {
    const { markets, collected_on, dataset } = loaders[project_type]();
    sources.push({
      project_type,
      dataset,
      collected_on,
      licence: LICENCE,
      url: DECP_URL,
    });

    const { kept, excluded } = filterMarkets(markets);
    excluded_count[project_type] = excluded.length;
    allKept.push(...kept);
    indices[project_type] = {
      all: computeIndices(kept),
      by_nature: groupByNature(kept),
    };
  }

  const contracts = [...allKept].sort((a, b) =>
    contractSortKey(a).localeCompare(contractSortKey(b)),
  );

  const private_ = {
    daily_rates: loadPrivateCsv(inputDir, 'daily_rates_freework.csv'),
    crm_pricing: loadPrivateCsv(inputDir, 'crm_pricing.csv'),
    gpao_vendor_pricing: loadPrivateCsv(inputDir, 'gpao_vendor_pricing.csv'),
    market: loadPrivateMarket(inputDir),
  };

  const dataset = sortKeysDeep({
    generated_on: new Date().toISOString(),
    sources,
    contracts,
    indices,
    excluded_count,
    private: private_,
  });

  // Restaurer generated_on en tête logique (sortKeysDeep l'a trié) — OK, clés triées.
  return dataset;
}

function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const inputDir = join(root, 'pipeline/input');
  const outPath = join(root, 'server/src/data/dataset.json');
  const dataset = buildDataset(inputDir);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outPath} (${dataset.contracts.length} contracts)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
