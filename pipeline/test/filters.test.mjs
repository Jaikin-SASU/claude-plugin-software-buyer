import { describe, expect, it } from 'vitest';
import { filterMarkets } from '../lib/filters.mjs';

function market(overrides = {}) {
  return {
    id: 'm1',
    project_type: 'erp',
    object: 'Logiciel ERP',
    amount_eur: 100_000,
    duration_months: 12,
    offers_received: 2,
    cpv: '48331000-7',
    notified_on: '2024-01-01',
    buyer_siret: '123',
    holder_siret: null,
    department: '75',
    nature: 'creation',
    source_dataset: 'decp',
    ...overrides,
  };
}

describe('filterMarkets', () => {
  it('exclut les CPV travaux (45*) et ingénierie (71*)', () => {
    const clim = market({
      id: 'clim',
      object: 'MAINTENANCE GENIE CLIMATIQUE ERP',
      cpv: '45331000-6',
      amount_eur: 50_000,
    });
    const ok = market({ id: 'ok', cpv: '48331000-7' });
    const inge = market({ id: 'inge', cpv: '71310000-4', amount_eur: 80_000 });

    const { kept, excluded } = filterMarkets([clim, ok, inge]);

    expect(kept.map((m) => m.id)).toEqual(['ok']);
    expect(excluded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'clim', reason: expect.stringMatching(/cpv|45/i) }),
        expect.objectContaining({ id: 'inge', reason: expect.stringMatching(/cpv|71/i) }),
      ]),
    );
  });

  it('exclut les montants non finis ou ≤ 0', () => {
    const bad = [
      market({ id: 'zero', amount_eur: 0 }),
      market({ id: 'neg', amount_eur: -10 }),
      market({ id: 'nan', amount_eur: Number.NaN }),
      market({ id: 'inf', amount_eur: Infinity }),
    ];
    const { kept, excluded } = filterMarkets(bad);
    expect(kept).toHaveLength(0);
    expect(excluded).toHaveLength(4);
    for (const e of excluded) {
      expect(e.reason).toMatch(/montant/i);
    }
  });

  it('dédoublonne sur (id, montant)', () => {
    const a = market({ id: 'dup', amount_eur: 100_000 });
    const b = market({ id: 'dup', amount_eur: 100_000, object: 'copie' });
    const c = market({ id: 'dup', amount_eur: 200_000 });
    const { kept, excluded } = filterMarkets([a, b, c]);
    expect(kept).toHaveLength(2);
    expect(kept.map((m) => m.amount_eur).sort()).toEqual([100_000, 200_000]);
    expect(excluded).toEqual([
      expect.objectContaining({ id: 'dup', reason: expect.stringMatching(/doublon/i) }),
    ]);
  });

  it('dédoublonne les modifications DECP (même type/siret/montant/objet, ids et dates différents)', () => {
    const original = market({
      id: '2023S01000',
      object: 'Acquisition d’un logiciel ERP métier',
      amount_eur: 250_000,
      buyer_siret: '12345678900012',
      notified_on: '2023-06-15',
    });
    const republished = market({
      id: '2023S01000-0100',
      object: 'Acquisition d\'un logiciel ERP métier!!!',
      amount_eur: 250_000,
      buyer_siret: '12345678900012',
      notified_on: '2024-06-15',
    });
    const other = market({
      id: 'other',
      object: 'Autre logiciel',
      amount_eur: 250_000,
      buyer_siret: '12345678900012',
      notified_on: '2023-01-01',
    });

    const { kept, excluded } = filterMarkets([republished, other, original]);

    expect(kept.map((m) => m.id).sort()).toEqual(['2023S01000', 'other']);
    expect(excluded).toEqual([
      expect.objectContaining({
        id: '2023S01000-0100',
        reason: 'duplicate-modification',
      }),
    ]);
  });

  it('garde le marché le plus ancien (notified_on minimal) en cas de modification', () => {
    const early = market({
      id: 'a-0100',
      object: 'Maintenance SAP',
      amount_eur: 80_000,
      buyer_siret: '999',
      notified_on: '2022-01-10',
    });
    const late = market({
      id: 'a',
      object: 'Maintenance SAP',
      amount_eur: 80_000,
      buyer_siret: '999',
      notified_on: '2023-01-10',
    });
    const { kept, excluded } = filterMarkets([late, early]);
    expect(kept).toHaveLength(1);
    expect(kept[0].id).toBe('a-0100');
    expect(excluded[0].reason).toBe('duplicate-modification');
  });

  it('exclut les faux positifs ERP (CPV 33/63 et motifs objet)', () => {
    const defibrillateur = market({
      id: 'defib',
      object:
        'Fourniture et pose de défibrillateurs, accesoires, consommables, maintenance pour les bâtiments ERP des membres du groupement',
      cpv: '33182100-0',
      amount_eur: 40_000,
    });
    const secours = market({
      id: 'secours',
      object: 'Maintenance des moyens de secours (ERP / ERT)',
      cpv: '50413200-5',
      amount_eur: 30_000,
    });
    const deplacements = market({
      id: 'depl',
      object: 'Plateforme de gestion intégrée des déplacements professionnels',
      cpv: '63510000-7',
      amount_eur: 20_000,
    });
    const cpv33 = market({
      id: 'med',
      object: 'Fourniture de matériel médical divers',
      cpv: '33100000-1',
      amount_eur: 15_000,
    });
    const vraiErp = market({
      id: 'vrai',
      object: 'Acquisition d’un logiciel ERP',
      cpv: '48331000-7',
      amount_eur: 100_000,
    });

    const { kept, excluded } = filterMarkets([
      defibrillateur,
      secours,
      deplacements,
      cpv33,
      vraiErp,
    ]);

    expect(kept.map((m) => m.id)).toEqual(['vrai']);
    expect(excluded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'defib', reason: 'erp-building-false-positive' }),
        expect.objectContaining({ id: 'secours', reason: 'erp-building-false-positive' }),
        expect.objectContaining({ id: 'depl', reason: 'erp-building-false-positive' }),
        expect.objectContaining({ id: 'med', reason: 'erp-building-false-positive' }),
      ]),
    );
  });

  it('n’applique pas les faux positifs ERP aux autres project_type', () => {
    const twin = market({
      id: 'twin',
      project_type: 'digital_twin',
      object: 'Fourniture et pose de défibrillateurs pour bâtiments ERP',
      cpv: '33182100-0',
      amount_eur: 40_000,
    });
    const { kept, excluded } = filterMarkets([twin]);
    expect(kept).toHaveLength(1);
    expect(excluded).toHaveLength(0);
  });
});
