import { EVALUATION_TEXT_FIXTURES } from "../src/lib/demo/evaluation-fixtures";
import { getAiClient } from "../src/server/ai";
import { env } from "../src/lib/env";
import { analyzeUrl } from "../src/server/url/analyzer";
import { detectMessageSignals } from "../src/server/risk/signals";
import { fuseRisk } from "../src/server/risk/engine";

if (!process.argv.includes("--confirm-live")) {
  console.error("Live evaluation requires --confirm-live and synthetic fixtures only.");
  process.exit(1);
}

if (env.AI_MODE !== "live" || !env.GEMINI_API_KEY) {
  console.error("Live evaluation requires AI_MODE=live and GEMINI_API_KEY.");
  process.exit(1);
}

const ai = getAiClient();
const startedAt = Date.now();
let completed = 0;
let failed = 0;

for (const fixture of EVALUATION_TEXT_FIXTURES) {
  try {
    const signals = detectMessageSignals(fixture.text);
    const url = [...fixture.text.matchAll(/https?:\/\/[^\s<>]+/gi)][0]?.[0];
    const urlAnalysis = url ? analyzeUrl(url) : null;
    const analysis = await ai.analyzeText({ normalizedText: fixture.text, deterministicSignals: signals, urlAnalysis, knowledge: [] });
    fuseRisk({ inputType: "text", ruleSignals: signals, urlSignals: urlAnalysis?.signals, urlScore: urlAnalysis?.structuralScore, aiSignals: analysis.result.indicators.map((item, index) => ({ id: `live-${fixture.id}-${index}`, category: item.category, source: "ai", label: item.label, severity: item.severity, explanation: item.explanation })), semanticRisk: analysis.result.semanticRisk, aiAvailable: true });
    completed += 1;
  } catch (error) {
    failed += 1;
    console.error(`${fixture.id}: ${error instanceof Error ? error.message : "provider failure"}`);
  }
}

console.log(JSON.stringify({ mode: "live", completed, failed, durationMs: Date.now() - startedAt, note: "Synthetic smoke only; not a universal accuracy claim." }, null, 2));
if (failed > 0) process.exitCode = 1;
