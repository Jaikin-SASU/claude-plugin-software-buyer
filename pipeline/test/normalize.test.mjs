import { describe, expect, it } from 'vitest';
import { cleanObject, departmentFromPostal, normalizeMarket } from '../lib/normalize.mjs';

describe('cleanObject', () => {
  it('décode les entités HTML', () => {
    expect(cleanObject('MISSION D&#8217;ASSISTANCE &amp; SUIVI &quot;ERP&quot;')).toBe(
      'MISSION D’ASSISTANCE & SUIVI "ERP"',
    );
  });

  it('remplace ?uvre et oeuvre par œuvre', () => {
    expect(cleanObject('Mise en ?uvre du plan')).toBe('Mise en œuvre du plan');
    expect(cleanObject('MISE EN OEUVRE JUMEAU')).toBe('MISE EN ŒUVRE JUMEAU');
    expect(cleanObject('maitrise d\'oeuvre')).toBe("maitrise d'œuvre");
  });

  it('supprime U+FFFD et collapse les espaces', () => {
    expect(cleanObject('Hébergement\uFFFD  maintenance   ERP')).toBe(
      'Hébergement maintenance ERP',
    );
  });

  it('ne remplace pas un ? hors motif ?uvre', () => {
    expect(cleanObject('Lot n°2 : question ? réponse')).toBe('Lot n°2 : question ? réponse');
  });
});

describe('departmentFromPostal', () => {
  it('extrait les 2 premiers chiffres d’un code postal', () => {
    expect(departmentFromPostal('77090')).toBe('77');
    expect(departmentFromPostal('75001')).toBe('75');
  });

  it('accepte un code département déjà à 2 chiffres', () => {
    expect(departmentFromPostal('77')).toBe('77');
    expect(departmentFromPostal('91')).toBe('91');
  });

  it('gère la Corse 2A / 2B', () => {
    expect(departmentFromPostal('20000')).toBe('2A');
    expect(departmentFromPostal('20167')).toBe('2A');
    expect(departmentFromPostal('20200')).toBe('2B');
    expect(departmentFromPostal('20600')).toBe('2B');
  });

  it('retourne null pour un code invalide', () => {
    expect(departmentFromPostal('FR')).toBeNull();
    expect(departmentFromPostal('')).toBeNull();
    expect(departmentFromPostal(null)).toBeNull();
    expect(departmentFromPostal(undefined)).toBeNull();
  });
});

describe('normalizeMarket', () => {
  it('normalise un marché DECP JSON', () => {
    const raw = {
      id: '2024S06604',
      objet: 'Acquisition d’un logiciel ERP',
      montant: 400000,
      dureemois: 48,
      offresrecues: '3',
      codecpv: '48331000-7',
      datenotification: '2024-07-29',
      acheteur_id: '28750005200082',
      titulaire_id_1: '48902249100018',
      lieuexecution_code: '77090',
      nature: 'CREATION',
      _source: 'decp-2022-marches-valides',
    };
    expect(normalizeMarket(raw, 'erp')).toEqual({
      id: '2024S06604',
      project_type: 'erp',
      object: 'Acquisition d’un logiciel ERP',
      amount_eur: 400000,
      duration_months: 48,
      offers_received: 3,
      cpv: '48331000-7',
      notified_on: '2024-07-29',
      buyer_siret: '28750005200082',
      holder_siret: '48902249100018',
      department: '77',
      nature: 'creation',
      source_dataset: 'decp-2022-marches-valides',
    });
  });

  it('parse "MQ NC" en offers_received null', () => {
    const raw = {
      id: 'x',
      objet: 'test',
      montant: 1000,
      dureemois: 12,
      offresrecues: 'MQ NC',
      codecpv: '48000000-8',
      datenotification: '2024-01-01',
      acheteur_id: '1',
      _source: 'decp',
    };
    expect(normalizeMarket(raw, 'erp').offers_received).toBeNull();
  });

  it('nature absente → unknown', () => {
    const raw = {
      id: 'y',
      objet: 'test',
      montant: 1000,
      dureemois: 12,
      codecpv: '48000000-8',
      datenotification: '2024-01-01',
      acheteur_id: '1',
      _source: 'decp',
    };
    expect(normalizeMarket(raw, 'digital_transformation').nature).toBe('unknown');
  });

  it('normalise une ligne digital_twin CSV', () => {
    const row = {
      id: '202626001',
      date_notification: '2026-03-18',
      acheteur: 'SYNDICAT MIXTE',
      montant_eur: '69550',
      duree_mois: '21',
      famille: 'territoire',
      objet: 'jumeau numérique',
      source_dataset: 'decp-2022-marches-valides',
      releve: '2026-09-20',
    };
    const n = normalizeMarket(row, 'digital_twin');
    expect(n.project_type).toBe('digital_twin');
    expect(n.amount_eur).toBe(69550);
    expect(n.duration_months).toBe(21);
    expect(n.notified_on).toBe('2026-03-18');
    expect(n.object).toBe('jumeau numérique');
    expect(n.source_dataset).toBe('decp-2022-marches-valides');
  });

  it('nettoie l’objet lors de la normalisation', () => {
    const raw = {
      id: 'z',
      objet: 'Mise en ?uvre  d&#8217;un plan&amp;suite',
      montant: 1000,
      dureemois: 12,
      codecpv: '48000000-8',
      datenotification: '2024-01-01',
      acheteur_id: '1',
      _source: 'decp',
    };
    expect(normalizeMarket(raw, 'erp').object).toBe("Mise en œuvre d’un plan&suite");
  });
});
