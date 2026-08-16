import {
  AFFECTED_ASSET_LABELS,
  affectedAssetsForIncidents,
  INCIDENT_LABELS,
  OFFICIAL_SOURCE_HOSTS,
  RESPONSE_CATALOG,
} from "@/lib/response/catalog";
import type { AffectedAsset, IncidentType, ResponsePlan, ResponseStep } from "@/lib/response/types";

const DISCLAIMER = "AmanKlik memberikan panduan awal, bukan layanan darurat, bank, penegak hukum, atau jaminan pemulihan. Hubungi penyedia melalui aplikasi, nomor, atau situs resmi yang kamu cari sendiri.";

function uniqueIncidents(incidents: IncidentType[]): IncidentType[] {
  const unique = [...new Set(incidents)].filter((incident) => incident in INCIDENT_LABELS);
  const concreteIncidents = unique.filter((incident) => incident !== "unsure");

  return concreteIncidents.length ? concreteIncidents : unique;
}

function uniqueAssets(assets: AffectedAsset[]): AffectedAsset[] {
  return [...new Set(assets)].filter((asset) => asset in AFFECTED_ASSET_LABELS);
}

function sourceIsAllowlisted(step: ResponseStep): boolean {
  if (!step.sourceUrl && !step.sourceTitle) return true;
  if (!step.sourceUrl || !step.sourceTitle) return false;

  try {
    const url = new URL(step.sourceUrl);
    return url.protocol === "https:" && OFFICIAL_SOURCE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function stepMatchesAssets(step: ResponseStep, selectedAssets: Set<AffectedAsset>): boolean {
  if (step.requiresNoAffectedAsset) return selectedAssets.size === 0;
  if (!step.affectedAssets?.length) return true;
  return step.affectedAssets.some((asset) => selectedAssets.has(asset));
}

function deduplicateSteps(incidents: IncidentType[], assets: AffectedAsset[]): ResponseStep[] {
  const selectedIncidents = new Set(incidents);
  const selectedAssets = new Set(assets);
  const byId = new Map<string, ResponseStep>();

  for (const step of RESPONSE_CATALOG) {
    const matchesIncident = step.incidentTypes.some((incident) => selectedIncidents.has(incident));
    if (matchesIncident && stepMatchesAssets(step, selectedAssets) && sourceIsAllowlisted(step)) {
      byId.set(step.id, step);
    }
  }

  return [...byId.values()].sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}

export function buildResponsePlan(incidents: IncidentType[], assets: AffectedAsset[] = []): ResponsePlan {
  const selectedIncidents = uniqueIncidents(incidents);
  const relevantAssets = new Set(affectedAssetsForIncidents(selectedIncidents));
  const selectedAssets = uniqueAssets(assets).filter((asset) => relevantAssets.has(asset));
  const steps = deduplicateSteps(selectedIncidents, selectedAssets);

  return {
    schemaVersion: 2,
    selectedIncidents,
    selectedAssets,
    immediate: steps.filter((step) => step.urgency === "immediate"),
    soon: steps.filter((step) => step.urgency === "soon"),
    monitor: steps.filter((step) => step.urgency === "monitor"),
    preserveEvidence: steps.filter((step) => step.id === "preserve-evidence"),
    disclaimer: DISCLAIMER,
  };
}

export function labelForIncident(incident: IncidentType): string {
  return INCIDENT_LABELS[incident];
}

export function labelForAsset(asset: AffectedAsset): string {
  return AFFECTED_ASSET_LABELS[asset];
}
