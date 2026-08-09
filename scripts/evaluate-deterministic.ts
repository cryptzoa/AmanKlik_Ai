import { formatEvaluationReport, runDeterministicEvaluation } from "../src/lib/evaluation/runner";

const summary = runDeterministicEvaluation();
console.log(formatEvaluationReport(summary));

if (summary.urlNetworkCalls !== 0 || summary.failed > 0) process.exitCode = 1;
