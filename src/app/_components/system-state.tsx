import type { ReactNode, Ref } from "react";

import styles from "./system-state.module.css";

type SystemStateProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: ReactNode;
  secondaryAction?: ReactNode;
  headingRef?: Ref<HTMLHeadingElement>;
};

export { styles as systemStateStyles };

export function SystemState({
  code,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  headingRef,
}: SystemStateProps) {
  return (
    <main className={styles.shell} aria-labelledby="system-state-title">
      <section className={styles.panel}>
        <div className={styles.marker} aria-hidden="true">
          <span>{code}</span>
          <span>Status sistem</span>
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1
            id="system-state-title"
            ref={headingRef}
            tabIndex={headingRef ? -1 : undefined}
          >
            {title}
          </h1>
          <p className={styles.description}>{description}</p>

          <div className={styles.actions}>
            {primaryAction}
            {secondaryAction}
          </div>
        </div>

        <p className={styles.boundary}>
          Detail internal tidak ditampilkan untuk menjaga keamanan.
        </p>
      </section>
    </main>
  );
}
