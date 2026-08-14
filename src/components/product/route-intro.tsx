type RouteIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  annotation?: React.ReactNode;
  pattern?: "task" | "analysis" | "reading";
  children?: React.ReactNode;
};

export function RouteIntro({
  eyebrow,
  title,
  description,
  annotation,
  pattern = "task",
  children,
}: RouteIntroProps) {
  return (
    <section className="product-intro" data-intro-pattern={pattern}>
      <div className="product-container">
        <div className="product-intro__grid">
          <div className="min-w-0">
            <p className="product-eyebrow">{eyebrow}</p>
            <h1 className="product-page-title text-balanced">{title}</h1>
          </div>
          {annotation ? (
            <aside className="product-intro__annotation">{annotation}</aside>
          ) : null}
        </div>
        <div className="product-intro__footer">
          <p className="product-lead">{description}</p>
          {children ? <div className="product-intro__meta">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
