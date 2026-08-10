import { CURATED_ADVISORIES } from "@/lib/intelligence/catalog";
import type { AnalysisResult, InputType, RiskLevel } from "@/types/analysis";
import type { IntelligenceSnapshot } from "@/types/intelligence";

type IntelligenceSource = {
  sessionId: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  result: AnalysisResult;
};

const MINIMUM_GROUP_SIZE = 3;

export function buildIntelligenceSnapshot(
  sources: IntelligenceSource[],
  verifiedOutcomes: number,
  now = new Date(),
): IntelligenceSnapshot {
  const uniqueSessionCount = new Set(sources.map((source) => source.sessionId)).size;
  const categoryCounts = new Map<string, { label: string; sessions: Set<string> }>();
  const inputSessions = new Map<InputType, Set<string>>();
  const riskSessions = new Map<RiskLevel, Set<string>>();

  for (const source of sources) {
    const inputGroup = inputSessions.get(source.inputType) ?? new Set<string>();
    inputGroup.add(source.sessionId);
    inputSessions.set(source.inputType, inputGroup);
    const riskGroup = riskSessions.get(source.riskLevel) ?? new Set<string>();
    riskGroup.add(source.sessionId);
    riskSessions.set(source.riskLevel, riskGroup);
    const seen = new Set<string>();
    for (const signal of source.result.indicators) {
      if (seen.has(signal.category)) continue;
      seen.add(signal.category);
      const current = categoryCounts.get(signal.category) ?? { label: signal.label, sessions: new Set<string>() };
      current.sessions.add(source.sessionId);
      categoryCounts.set(signal.category, current);
    }
  }

  const trends = [...categoryCounts.entries()]
    .filter(([, value]) => value.sessions.size >= MINIMUM_GROUP_SIZE)
    .sort((left, right) => right[1].sessions.size - left[1].sessions.size || left[1].label.localeCompare(right[1].label, "id-ID"))
    .slice(0, 8)
    .map(([id, value]) => ({
      id,
      label: value.label,
      count: value.sessions.size,
      share: uniqueSessionCount ? Math.round((value.sessions.size / uniqueSessionCount) * 100) : 0,
    }));

  return {
    generatedAt: now.toISOString(),
    windowDays: 30,
    minimumGroupSize: MINIMUM_GROUP_SIZE,
    observedScans: uniqueSessionCount >= MINIMUM_GROUP_SIZE ? sources.length : 0,
    verifiedOutcomes: verifiedOutcomes >= MINIMUM_GROUP_SIZE ? verifiedOutcomes : 0,
    riskDistribution: [...riskSessions.entries()]
      .filter(([, sessions]) => sessions.size >= MINIMUM_GROUP_SIZE)
      .map(([riskLevel, sessions]) => ({ riskLevel, count: sessions.size })),
    inputDistribution: [...inputSessions.entries()]
      .filter(([, sessions]) => sessions.size >= MINIMUM_GROUP_SIZE)
      .map(([inputType, sessions]) => ({ inputType, count: sessions.size })),
    trends,
    advisories: CURATED_ADVISORIES,
    privacyNote: `Statistik hanya ditampilkan untuk pola yang muncul pada minimal ${MINIMUM_GROUP_SIZE} sesi anonim berbeda. Pesan, screenshot, URL lengkap, nomor, dan identitas tidak masuk snapshot.`,
  };
}
