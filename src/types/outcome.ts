export type ActionProgressState = "pending" | "completed" | "skipped";

export type ScanOutcomeVerdict = "prevented" | "confirmed_scam" | "legitimate" | "uncertain";
export type ScanOutcomeImpact = "none" | "data_shared" | "account_compromised" | "money_lost";

export type ScanOutcome = {
  verdict: ScanOutcomeVerdict;
  impact: ScanOutcomeImpact;
  updatedAt: string;
};
