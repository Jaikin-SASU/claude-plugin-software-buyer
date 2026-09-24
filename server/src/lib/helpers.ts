import {
  PROJECT_TYPES,
  type ProjectType,
  type UnsupportedProjectType,
} from "./types.js";

export function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function isProjectType(value: string): value is ProjectType {
  return (PROJECT_TYPES as readonly string[]).includes(value);
}

export function unsupportedProjectType(
  projectType: string,
): UnsupportedProjectType {
  return {
    message: `no reliable dataset for this project type (${projectType})`,
    available_project_types: PROJECT_TYPES,
  };
}

export function clampLimit(limit: number | undefined, fallback: number): number {
  const raw = limit === undefined ? fallback : Math.trunc(limit);
  if (!Number.isFinite(raw) || raw < 1) return fallback;
  return Math.min(raw, 10);
}

export function buyerLink(siret: string | null): string | null {
  if (!siret) return null;
  return `https://annuaire-entreprises.data.gouv.fr/etablissement/${siret}`;
}
