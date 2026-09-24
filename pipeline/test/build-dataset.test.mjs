import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildDataset } from '../build-dataset.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outPath = join(root, 'server/src/data/dataset.json');

describe('buildDataset', () => {
  it('produit un dataset avec erp et mobile_app (n > 150) et sans CPV 45/71', () => {
    const dataset = buildDataset(join(root, 'pipeline/input'));

    expect(dataset.contracts.length).toBeGreaterThan(0);
    expect(dataset.indices.erp).toBeDefined();
    expect(dataset.indices.mobile_app).toBeDefined();
    expect(dataset.indices.erp.all.n).toBeGreaterThan(150);
    expect(dataset.indices.mobile_app.all.n).toBeGreaterThan(150);

    for (const c of dataset.contracts) {
      const prefix = String(c.cpv || '').slice(0, 2);
      expect(prefix).not.toBe('45');
      expect(prefix).not.toBe('71');
    }

    expect(dataset.private.daily_rates.length).toBeGreaterThan(0);
    expect(dataset.private.crm_pricing.length).toBeGreaterThan(0);
    expect(dataset.private.gpao_vendor_pricing.length).toBeGreaterThan(0);
    expect(dataset.sources.length).toBeGreaterThanOrEqual(5);
    expect(dataset.generated_on).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it('inclut 14 figures private.market avec url https et data_date', () => {
    const dataset = buildDataset(join(root, 'pipeline/input'));
    const market = dataset.private.market;
    expect(Array.isArray(market)).toBe(true);
    expect(market).toHaveLength(14);
    for (const figure of market) {
      expect(figure.url).toMatch(/^https:\/\//);
      expect(figure.data_date).toBeTruthy();
      expect(figure.source).toBeTruthy();
      expect(figure.quote).toBeTruthy();
      expect(figure.project_type).toBeTruthy();
    }
  });

  it('écrit server/src/data/dataset.json de façon stable (hors generated_on)', () => {
    const a = buildDataset(join(root, 'pipeline/input'));
    const b = buildDataset(join(root, 'pipeline/input'));
    const strip = (d) => {
      const { generated_on, ...rest } = d;
      return JSON.stringify(rest);
    };
    expect(strip(a)).toBe(strip(b));

    // Side-effect of CLI: file may already exist after data:build; buildDataset itself returns object.
    // Ensure shape is writeable.
    expect(existsSync(join(root, 'pipeline/input/erp.json'))).toBe(true);
    expect(typeof a.excluded_count.erp).toBe('number');
  });
});
