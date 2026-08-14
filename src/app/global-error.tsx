"use client";

import { useEffect, useRef } from "react";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <html lang="id">
      <head>
        <title>AmanKlik belum dapat dimuat</title>
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; background: #f7f6f2; color: #111; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          main { min-height: 100svh; display: grid; place-items: center; padding: clamp(1rem, 4vw, 4rem); }
          section { width: min(100%, 58rem); border: 1px solid rgba(17, 17, 17, .42); background: #fffefa; padding: clamp(1.5rem, 7vw, 5rem); }
          p:first-child { margin: 0; color: #bf2721; font: 600 .6875rem/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .17em; text-transform: uppercase; }
          h1 { margin: 1.25rem 0 0; max-width: 12ch; font-size: clamp(2.65rem, 8vw, 6.5rem); font-weight: 650; letter-spacing: -.07em; line-height: .9; outline: none; text-wrap: balance; }
          h1:focus-visible { outline: 3px solid #635bff; outline-offset: .35rem; }
          .description { max-width: 58ch; margin: 1.5rem 0 0; color: #5f5c55; font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.7; }
          .actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
          button, a { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #111; border-radius: 999px; padding: .75rem 1.25rem; font: 700 .875rem/1 ui-sans-serif, system-ui, sans-serif; text-decoration: none; cursor: pointer; }
          button { background: #111; color: #fffefa; }
          a { background: #fffefa; color: #111; }
          button:hover { background: #635bff; border-color: #635bff; }
          a:hover { color: #635bff; border-color: #635bff; }
          button:focus-visible, a:focus-visible { outline: 3px solid #635bff; outline-offset: 3px; }
          .boundary { margin: 2.5rem 0 0; border-top: 1px solid rgba(17, 17, 17, .18); padding-top: 1rem; color: #6f6c65; font: 600 .6875rem/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; }
          @media (max-width: 480px) { button, a { width: 100%; } }
        `}</style>
      </head>
      <body>
        <main aria-labelledby="global-error-title">
          <section>
            <p>Kesalahan sistem</p>
            <h1 id="global-error-title" ref={headingRef} tabIndex={-1}>
              AmanKlik belum dapat dimuat.
            </h1>
            <p className="description">
              Aplikasi berhenti sebelum antarmuka tersedia. Coba muat ulang,
              atau buka scanner melalui jalur langsung.
            </p>
            <div className="actions">
              <button onClick={retry} type="button">
                Muat ulang aplikasi
              </button>
              <a href="/scan">Buka scanner</a>
            </div>
            <p className="boundary">
              Detail internal tidak ditampilkan untuk menjaga keamanan.
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
