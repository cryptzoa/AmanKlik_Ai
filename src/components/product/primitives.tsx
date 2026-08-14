type StatusTone = "info" | "loading" | "warning" | "error" | "success";

export function ProductSection({
  children,
  className = "",
  width = "wide",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "wide" | "task" | "reading";
}) {
  return (
    <section
      className={`product-section product-${width}-canvas ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="product-section-heading">
      <div>
        <p className="product-eyebrow text-ai">{eyebrow}</p>
        <h2 id={id} className="product-section-title text-balanced">
          {title}
        </h2>
      </div>
      {description ? <p className="product-section-copy">{description}</p> : null}
    </div>
  );
}

export function TaskSurface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`product-task-surface ${className}`.trim()}>{children}</div>
  );
}

export function StatusBand({
  children,
  tone = "info",
  role,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  role?: "alert" | "status";
}) {
  return (
    <div className="product-status-band" data-tone={tone} role={role}>
      <span className="product-status-band__mark" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function DarkChapter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`product-dark-chapter ${className}`.trim()}>
      <div className="product-container">{children}</div>
    </section>
  );
}

export function EmptyState({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="product-empty-state">
      <p className="product-eyebrow text-ai">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="product-empty-state__copy">{children}</div>
      {action ? <div className="product-empty-state__action">{action}</div> : null}
    </div>
  );
}
