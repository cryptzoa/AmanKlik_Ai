import "server-only";

import { listRecentIntelligenceSources } from "@/db/repositories/intelligence-repository";
import { buildIntelligenceSnapshot } from "@/lib/intelligence/build-snapshot";

export async function getIntelligenceSnapshot() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000);
  const sources = await listRecentIntelligenceSources(since);
  return buildIntelligenceSnapshot(sources);
}
