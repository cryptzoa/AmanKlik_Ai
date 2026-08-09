import { INCIDENT_LABELS, RESPONSE_CATALOG } from "@/lib/response/catalog";
import type { IncidentType, ResponsePlan, ResponseStep } from "@/lib/response/types";

const DISCLAIMER = "AmanKlik memberikan panduan awal, bukan layanan darurat, bank, penegak hukum, atau jaminan pemulihan. Hubungi penyedia terkait melalui kanal resmi yang kamu cari sendiri.";

function uniqueIncidents(incidents: IncidentType[]): IncidentType[] {
  return [...new Set(incidents)].filter((incident) => incident in INCIDENT_LABELS);
}

function deduplicateSteps(incidents: IncidentType[]): ResponseStep[] {
  const selected = new Set(incidents);
  const byId = new Map<string, ResponseStep>();

  for (const step of RESPONSE_CATALOG) {
    if (step.incidentTypes.some((incident) => selected.has(incident))) byId.set(step.id, step);
  }

  return [...byId.values()].sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}

export function buildResponsePlan(incidents: IncidentType[]): ResponsePlan {
  const selectedIncidents = uniqueIncidents(incidents);
  const steps = deduplicateSteps(selectedIncidents);

  return {
    schemaVersion: 1,
    selectedIncidents,
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
