"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryNavigation = [
  ["/scan", "Scan"],
  ["/respond", "Action"],
  ["/simulator", "Latihan"],
] as const;

const secondaryNavigation = [
  ["/investigate", "Kasus"],
  ["/learn", "Learn"],
  ["/history", "History"],
] as const;

const navigation = [...primaryNavigation, ...secondaryNavigation] as const;

function routeIsActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader({ variant }: { variant: "landing" | "interior" }) {
  const pathname = usePathname();
  const secondaryIsActive = secondaryNavigation.some(([href]) => routeIsActive(pathname, href));
  const headerClassName = variant === "landing"
    ? "fixed inset-x-0 top-0 z-50 border-b border-transparent px-4 py-4 sm:px-8 lg:px-12"
    : "sticky inset-x-0 top-0 z-50 border-b border-line bg-canvas/90 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-12";

  return (
    <header
      data-site-header={variant === "landing" ? "" : undefined}
      data-shell-header={variant === "interior" ? "" : undefined}
      className={headerClassName}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <Link className="font-mono text-sm font-bold uppercase tracking-[0.18em]" href="/">AmanKlik AI</Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Navigasi utama">
          {primaryNavigation.map(([href, label]) => {
            const active = routeIsActive(pathname, href);

            return (
              <Link
                key={href}
                aria-current={active ? "page" : undefined}
                className={"relative py-1 transition after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-ink after:transition-transform " + (active ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100")}
                href={href}
              >
                {label}
              </Link>
            );
          })}
          <details className="group relative">
            <summary className={"cursor-pointer list-none py-1 transition [&::-webkit-details-marker]:hidden " + (secondaryIsActive ? "text-ink" : "text-muted hover:text-ink")}>Lainnya +</summary>
            <nav className="absolute right-0 top-9 grid min-w-48 gap-1 border border-line bg-surface p-2 shadow-[8px_8px_0_rgba(17,17,17,0.12)]" aria-label="Navigasi tambahan">
              {secondaryNavigation.map(([href, label]) => {
                const active = routeIsActive(pathname, href);

                return (
                  <Link
                    key={href}
                    aria-current={active ? "page" : undefined}
                    className={"min-h-11 px-3 py-3 text-sm font-semibold " + (active ? "bg-ai-soft text-ai" : "hover:bg-canvas")}
                    href={href}
                    prefetch={href === "/history" ? false : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </details>
        </nav>
        <div className="flex items-center gap-2">
          <details className="group relative md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">Menu</summary>
            <nav className="absolute right-0 top-14 grid min-w-48 gap-1 border border-line bg-surface p-2 shadow-[8px_8px_0_rgba(17,17,17,0.12)]" aria-label="Navigasi seluler">
              {navigation.map(([href, label]) => {
                const active = routeIsActive(pathname, href);

                return (
                  <Link
                    key={href}
                    aria-current={active ? "page" : undefined}
                    className={"min-h-11 px-3 py-3 text-sm font-semibold " + (active ? "bg-ai-soft text-ai" : "hover:bg-canvas")}
                    href={href}
                    prefetch={href === "/history" ? false : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </details>
          <Link className="hidden min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai sm:inline-flex" href="/scan">Cek pesan</Link>
        </div>
      </div>
    </header>
  );
}
