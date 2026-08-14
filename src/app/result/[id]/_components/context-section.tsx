export function ContextSection({ preview }: { preview: string }) {
  return (
    <section
      className="border-t border-line py-16"
      aria-labelledby="preview-heading"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        Konteks input
      </p>
      <h2 id="preview-heading" className="section-title mt-4">
        Konteks yang diperiksa
      </h2>
      <p className="mt-7 whitespace-pre-wrap break-words rounded-[18px] border-l-4 border-ai bg-surface p-6 text-sm leading-7 text-muted shadow-[10px_10px_0_var(--ai-soft)]">
        {preview}
      </p>
    </section>
  );
}
