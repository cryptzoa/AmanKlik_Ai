import type { AdversarialCaseResult } from "@/lib/evaluation/adversarial-runner";

function formatFamilyName(family: string): string {
  return family.replaceAll("_", " ");
}

function CaseStatus({ passed }: { passed: boolean }) {
  return (
    <strong
      className={`font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
        passed ? "text-safe" : "text-risk"
      }`}
    >
      {passed ? "PASS" : "REVIEW"}
    </strong>
  );
}

export function CaseMatrixSection(
  { cases }: { cases: AdversarialCaseResult[] },
) {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="case-matrix-title">
      <div className="flex flex-col gap-5 border-b border-[var(--line-strong)] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ai">
            Case matrix
          </p>
          <h2
            id="case-matrix-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
          >
            Kegagalan tidak disembunyikan.
          </h2>
        </div>
        <code className="w-fit break-all rounded-full bg-surface px-3 py-2 text-xs text-muted">
          pnpm eval:adversarial
        </code>
      </div>

      {cases.length === 0 ? (
        <div className="product-empty-state" role="status">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            0 kasus
          </p>
          <h2>Belum ada kasus adversarial</h2>
          <p className="product-empty-state__copy">
            Snapshot valid, tetapi belum menyediakan kasus yang dapat diperiksa.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 hidden overflow-x-auto rounded-[24px] border border-line bg-surface lg:block">
            <table className="w-full min-w-[820px] table-fixed border-collapse text-left text-sm">
              <caption className="sr-only">
                Hasil seluruh fixture adversarial dalam urutan snapshot
              </caption>
              <thead className="bg-ink text-surface">
                <tr>
                  <th scope="col" className="w-[15%] p-4 font-semibold">ID</th>
                  <th scope="col" className="w-[17%] p-4 font-semibold">Family</th>
                  <th scope="col" className="w-[25%] p-4 font-semibold">Expected</th>
                  <th scope="col" className="w-[25%] p-4 font-semibold">Detected</th>
                  <th scope="col" className="w-[8%] p-4 text-right font-semibold">Score</th>
                  <th scope="col" className="w-[10%] p-4 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item) => (
                  <tr key={item.id} className="border-t border-line align-top">
                    <th
                      scope="row"
                      className="break-words p-4 font-mono text-xs font-semibold [overflow-wrap:anywhere]"
                    >
                      {item.id}
                    </th>
                    <td className="break-words p-4 capitalize [overflow-wrap:anywhere]">
                      {formatFamilyName(item.family)}
                    </td>
                    <td className="break-words p-4 leading-6 text-muted [overflow-wrap:anywhere]">
                      {item.expected}
                    </td>
                    <td className="break-words p-4 leading-6 text-muted [overflow-wrap:anywhere]">
                      {item.detectedCategories.join(", ") || "Tidak ada"}
                    </td>
                    <td className="p-4 text-right font-mono tabular-nums">
                      {item.score}
                    </td>
                    <td className="p-4 text-right">
                      <CaseStatus passed={item.passed} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ol
            className="mt-8 grid gap-3 lg:hidden"
            aria-label="Daftar kasus adversarial"
          >
            {cases.map((item) => (
              <li
                key={item.id}
                className="rounded-[18px] border border-[var(--line-strong)] bg-surface p-5"
              >
                <article aria-labelledby={`mobile-case-${item.id}`}>
                  <div className="flex items-start justify-between gap-5">
                    <h3
                      id={`mobile-case-${item.id}`}
                      className="break-words font-mono text-sm font-semibold [overflow-wrap:anywhere]"
                    >
                      {item.id}
                    </h3>
                    <CaseStatus passed={item.passed} />
                  </div>
                  <p className="mt-2 break-words text-sm capitalize text-muted [overflow-wrap:anywhere]">
                    {formatFamilyName(item.family)}
                  </p>
                  <dl className="mt-5 grid gap-4 text-sm">
                    <div className="grid gap-1">
                      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        Expected
                      </dt>
                      <dd className="break-words leading-6 [overflow-wrap:anywhere]">
                        {item.expected}
                      </dd>
                    </div>
                    <div className="grid gap-1">
                      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        Detected
                      </dt>
                      <dd className="break-words leading-6 [overflow-wrap:anywhere]">
                        {item.detectedCategories.join(", ") || "Tidak ada"}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        Score
                      </dt>
                      <dd className="font-mono text-xl font-semibold tabular-nums">
                        {item.score}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
