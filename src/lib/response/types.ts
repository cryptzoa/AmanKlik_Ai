export type IncidentType =
  | "money_transferred"
  | "otp_or_pin_shared"
  | "password_shared"
  | "link_opened"
  | "personal_data_shared"
  | "remote_access_installed"
  | "account_access_lost";

export type ResponseUrgency = "immediate" | "soon" | "monitor";

export type ResponseStep = {
  id: string;
  incidentTypes: IncidentType[];
  urgency: ResponseUrgency;
  order: number;
  title: string;
  body: string;
  sourceTitle?: string;
  sourceUrl?: string;
};

export type ResponsePlan = {
  schemaVersion: 1;
  selectedIncidents: IncidentType[];
  immediate: ResponseStep[];
  soon: ResponseStep[];
  monitor: ResponseStep[];
  preserveEvidence: ResponseStep[];
  disclaimer: string;
};
