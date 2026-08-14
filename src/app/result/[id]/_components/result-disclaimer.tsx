export function ResultDisclaimer({ children }: { children: string }) {
  return (
    <aside
      role="note"
      className="border-t border-line py-10 text-sm leading-6 text-muted"
    >
      {children}
    </aside>
  );
}
