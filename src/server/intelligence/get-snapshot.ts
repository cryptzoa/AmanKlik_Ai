import "server-only";

import { countRecentVerifiedOutcomes } from "@/db/repositories/outcome-repository";
import { listRecentIntelligenceSources } from "@/db/repositories/intelligence-repository";
import { buildIntelligenceSnapshot } from "@/lib/intelligence/build-snapshot";

export async function getIntelligenceSnapshot() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000);
  const [sources, outcomes] = await Promise.all([
    listRecentIntelligenceSources(since),
    countRecentVerifiedOutcomes(since),
  ]);
  return buildIntelligenceSnapshot(sources, outcomes.length);
}
