export type IncidentType =
  | "money_transferred"
  | "unauthorized_transaction"
  | "credential_or_card_shared"
  | "suspicious_app_installed"
  | "account_or_number_lost"
  | "identity_data_shared"
  | "link_or_qr_opened"
  | "goods_released_fake_payment"
  | "unsure";

export type AffectedAsset =
  | "bank_or_wallet"
  | "email"
  | "whatsapp"
  | "marketplace"
  | "social_media"
  | "phone_number"
  | "device";

export type ResponseUrgency = "immediate" | "soon" | "monitor";

export type ResponseStep = {
  id: string;
  incidentTypes: IncidentType[];
  affectedAssets?: AffectedAsset[];
  requiresNoAffectedAsset?: boolean;
  urgency: ResponseUrgency;
  order: number;
  title: string;
  body: string;
  sourceTitle?: string;
  sourceUrl?: string;
};

export type ResponsePlan = {
  schemaVersion: 2;
  selectedIncidents: IncidentType[];
  selectedAssets: AffectedAsset[];
  immediate: ResponseStep[];
  soon: ResponseStep[];
  monitor: ResponseStep[];
  preserveEvidence: ResponseStep[];
  disclaimer: string;
};
