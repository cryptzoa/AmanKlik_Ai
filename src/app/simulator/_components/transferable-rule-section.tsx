export function TransferableRuleSection({ rule }: { rule: string }) {
  return (
    <section
      className="border-b border-line py-8"
      aria-labelledby="transferable-rule-title"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">
        Aturan yang dibawa pulang
      </p>
      <h3
        id="transferable-rule-title"
        className="mt-3 max-w-3xl text-2xl font-semibold leading-snug"
      >
        {rule}
      </h3>
    </section>
  );
}
