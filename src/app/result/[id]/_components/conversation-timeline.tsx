import type { ConversationResultData } from "@/types/analysis";

export function ConversationTimeline(
  { analysis }: { analysis?: ConversationResultData },
) {
  if (!analysis) return null;

  return (
    <section
      className="border-b border-line py-16"
      aria-labelledby="conversation-analysis-heading"
    >
      <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
            Konteks percakapan
          </p>
          <h2
            id="conversation-analysis-heading"
            className="mt-4 text-4xl font-semibold tracking-[-0.05em]"
          >
            Baca eskalasinya, bukan hanya satu pesan.
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted">
            {analysis.messageCount}{" "}
            pesan dibaca berdasarkan urutan. Potongan di bawah sudah disanitasi
            dan bukan salinan percakapan mentah.
          </p>
        </div>
        <div>
          <p className="rounded-[18px] border-l-4 border-ai bg-ai-soft p-5 text-sm leading-7">
            {analysis.progressionSummary}
          </p>
          <ol className="mt-6 grid gap-3">
            {analysis.timeline.map((item, index) => (
              <li
                key={item.messageId}
                className="grid gap-3 rounded-[16px] border border-line bg-surface p-5 sm:grid-cols-[52px_1fr_auto] sm:items-start"
              >
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-7 text-muted">
                  {item.redactedExcerpt || "Pesan tanpa preview."}
                </p>
                <span className="font-mono text-xs text-ai">
                  {item.signalIds.length} sinyal
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
