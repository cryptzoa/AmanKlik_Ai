import { runAdversarialEvaluation } from "../src/lib/evaluation/adversarial-runner";

const summary = runAdversarialEvaluation();
console.log(JSON.stringify(summary, null, 2));
if (summary.failed > 0) process.exitCode = 1;
