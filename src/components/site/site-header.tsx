"use client";

import { TransitionLink as Link } from "@/components/site/transition-link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionArrowIcon } from "@/components/ui/animated-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const primaryNavigation = [
  ["/scan", "Periksa"],
  ["/respond", "Tindakan"],
  ["/simulator", "Latihan"],
] as const;

const secondaryNavigation = [
  ["/investigate", "Investigasi", "Bandingkan bukti"],
  ["/learn", "Pelajari", "Kenali polanya"],
  ["/history", "Riwayat", "Lihat pemeriksaan"],
] as const;

const navigation = [
  ...primaryNavigation.map(([href, label]) => [href, label]),
  ...secondaryNavigation.map(([href, label]) => [href, label]),
] as const;

function routeIsActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

function RollingLabel({ children }: { children: string }) {
  return (
    <span
      data-label={children}
      className="relative block overflow-hidden leading-[1.2] after:absolute after:left-0 after:top-full after:block after:content-[attr(data-label)] after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navitem:after:-translate-y-full"
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navitem:-translate-y-full">
        {children}
      </span>
    </span>
  );
}

export function SiteHeader({ variant }: { variant: "landing" | "interior" }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const moreDetailsRef = useRef<HTMLDetailsElement>(null);
  const morePopoverRef = useRef<HTMLElement>(null);
  const moreIsAnimatingRef = useRef(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMobileMenuOpen) return;

      const currentScrollY = window.scrollY;
      const header = headerRef.current;

      if (!header) return;

      if (window.innerWidth < 1024) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.style.transform = "translateY(-100%)";
        } else if (currentScrollY < lastScrollY) {
          header.style.transform = "translateY(0)";
        }
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (headerRef.current) {
        headerRef.current.style.transform = "translateY(0)";
      }
    } else {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  useGSAP(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    const bg = menu.querySelector("[data-menu-bg]");
    const links = gsap.utils.toArray("[data-menu-link]", menu);
    const footer = menu.querySelector("[data-menu-footer]");
    const reduceMotion = typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(menu, { display: isMobileMenuOpen ? "block" : "none" });
      gsap.set([bg, ...links, footer], { clearProps: "all" });
      setIsMenuClosing(false);
      return;
    }

    if (isMobileMenuOpen) {
      setIsMenuClosing(false);
      gsap.set(menu, { display: "block" });
      const tl = gsap.timeline();

      tl.fromTo(bg, {
        clipPath: "circle(0% at calc(100% - 40px) 40px)",
        opacity: 1,
      }, {
        clipPath: "circle(150% at calc(100% - 40px) 40px)",
        duration: 0.7,
        ease: "power3.inOut",
      })
        .fromTo(links, { y: 80, opacity: 0, rotateZ: 5 }, {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "expo.out",
        }, "-=0.4")
        .fromTo(footer, { opacity: 0, y: 20 }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.4");
    } else {
      if (gsap.getProperty(menu, "display") !== "none") {
        setIsMenuClosing(true);
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(menu, { display: "none" });
            setIsMenuClosing(false);
          },
        });
        tl.to(links, {
          y: -40,
          opacity: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.in",
        })
          .to(footer, { opacity: 0, duration: 0.2 }, "<")
          .to(bg, {
            clipPath: "circle(0% at calc(100% - 40px) 40px)",
            duration: 0.6,
            ease: "power3.inOut",
          }, "-=0.2");
      }
    }
  }, { dependencies: [isMobileMenuOpen], scope: mobileMenuRef });

  const handleMoreToggle = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const details = moreDetailsRef.current;
    const popover = morePopoverRef.current;
    if (!details || !popover || moreIsAnimatingRef.current) return;

    const reduceMotion = typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      details.open = !details.open;
      return;
    }

    const intro = popover.querySelector<HTMLElement>("[data-dropdown-intro]");
    const items = gsap.utils.toArray<HTMLElement>(
      "[data-dropdown-item]",
      popover,
    );

    gsap.killTweensOf([popover, intro, ...items]);
    moreIsAnimatingRef.current = true;

    if (!details.open) {
      details.open = true;

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          moreIsAnimatingRef.current = false;
          gsap.set([popover, intro, ...items], { clearProps: "all" });
        },
      });
      timeline
        .fromTo(
          popover,
          {
            autoAlpha: 0,
            clipPath: "inset(0 0 100% 0 round 28px)",
            scale: 0.96,
            transformOrigin: "top center",
            y: -12,
          },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0 round 28px)",
            duration: 0.52,
            scale: 1,
            y: 0,
          },
        )
        .fromTo(
          intro,
          { autoAlpha: 0, y: -6 },
          { autoAlpha: 1, duration: 0.32, y: 0 },
          "-=0.3",
        )
        .fromTo(
          items,
          { autoAlpha: 0, y: -10 },
          {
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.055,
            y: 0,
          },
          "-=0.25",
        );
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        details.open = false;
        moreIsAnimatingRef.current = false;
        gsap.set([popover, intro, ...items], { clearProps: "all" });
      },
    });
    timeline
      .to([...items].reverse(), {
        autoAlpha: 0,
        duration: 0.18,
        stagger: 0.025,
        y: -6,
      })
      .to(
        intro,
        { autoAlpha: 0, duration: 0.15, y: -4 },
        "<",
      )
      .to(
        popover,
        {
          autoAlpha: 0,
          clipPath: "inset(0 0 100% 0 round 28px)",
          duration: 0.3,
          scale: 0.97,
          transformOrigin: "top center",
          y: -10,
        },
        "-=0.08",
      );
  };

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const shell = headerRef.current?.querySelector("[data-header-shell]");
    if (!shell) return;

    gsap.fromTo(
      shell,
      {
        force3D: true,
        y: -16,
      },
      {
        clearProps: "transform,willChange",
        duration: 0.72,
        ease: "power3.out",
        force3D: true,
        onStart: () => gsap.set(shell, { willChange: "transform" }),
        y: 0,
      },
    );

    const desktopNav = headerRef.current?.querySelector<HTMLElement>(
      "[data-desktop-nav]",
    );
    const navCursor = desktopNav?.querySelector<HTMLElement>(
      "[data-nav-cursor]",
    );
    const navItems = desktopNav
      ? gsap.utils.toArray<HTMLElement>("[data-nav-link]", desktopNav)
      : [];
    const activeItem = navItems.find((item) =>
      item.dataset.active === "true"
    ) ?? null;
    let hoveredItem: HTMLElement | null = null;

    const moveCursor = (item: HTMLElement, immediate = false) => {
      if (!navCursor || !desktopNav) return;
      const itemBounds = item.getBoundingClientRect();
      const navBounds = desktopNav.getBoundingClientRect();
      if (itemBounds.width === 0) return;

      gsap.killTweensOf(navCursor);
      gsap.to(navCursor, {
        duration: immediate ? 0 : 0.48,
        ease: "power3.out",
        opacity: 1,
        width: itemBounds.width,
        x: itemBounds.left - navBounds.left,
      });
    };
    const resetCursor = () => {
      if (!navCursor) return;
      hoveredItem = null;
      gsap.killTweensOf(navCursor);

      if (activeItem) {
        moveCursor(activeItem);
        return;
      }

      gsap.to(navCursor, {
        duration: 0.22,
        ease: "power2.out",
        opacity: 0,
      });
    };

    if (activeItem) {
      moveCursor(activeItem, true);
    }

    const navCleanups = navItems.map((item) => {
      const handleEnter = () => {
        hoveredItem = item;
        moveCursor(item);
      };
      item.addEventListener("pointerenter", handleEnter);
      return () => item.removeEventListener("pointerenter", handleEnter);
    });
    const handleDocumentPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !desktopNav?.contains(target)) {
        resetCursor();
      }
    };

    desktopNav?.addEventListener("pointerleave", resetCursor);
    document.addEventListener("pointerover", handleDocumentPointerOver, true);
    window.addEventListener("blur", resetCursor);

    const cta = headerRef.current?.querySelector<HTMLElement>(
      "[data-header-cta]",
    );
    const handleCtaMove = (event: PointerEvent) => {
      if (!cta) return;
      const bounds = cta.getBoundingClientRect();
      gsap.to(cta, {
        duration: 0.4,
        ease: "power3.out",
        x: (event.clientX - bounds.left - bounds.width / 2) * 0.1,
        y: (event.clientY - bounds.top - bounds.height / 2) * 0.16,
      });
    };
    const resetCta = () => {
      if (!cta) return;
      gsap.to(cta, {
        duration: 0.65,
        ease: "elastic.out(1, 0.45)",
        x: 0,
        y: 0,
      });
    };
    const handleResize = () => {
      const targetItem = hoveredItem ?? activeItem;
      if (targetItem) moveCursor(targetItem, true);
    };

    cta?.addEventListener("pointermove", handleCtaMove);
    cta?.addEventListener("pointerleave", resetCta);
    window.addEventListener("resize", handleResize);

    if (variant === "landing") {
      const updateHeaderMode = () => {
        shell.setAttribute(
          "data-header-mode",
          window.scrollY > 8 ? "scrolled" : "top",
        );
      };

      updateHeaderMode();
      window.addEventListener("scroll", updateHeaderMode, { passive: true });

      return () => {
        navCleanups.forEach((cleanup) => cleanup());
        desktopNav?.removeEventListener("pointerleave", resetCursor);
        document.removeEventListener(
          "pointerover",
          handleDocumentPointerOver,
          true,
        );
        window.removeEventListener("blur", resetCursor);
        cta?.removeEventListener("pointermove", handleCtaMove);
        cta?.removeEventListener("pointerleave", resetCta);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", updateHeaderMode);
      };
    }

    return () => {
      navCleanups.forEach((cleanup) => cleanup());
      desktopNav?.removeEventListener("pointerleave", resetCursor);
      document.removeEventListener(
        "pointerover",
        handleDocumentPointerOver,
        true,
      );
      window.removeEventListener("blur", resetCursor);
      cta?.removeEventListener("pointermove", handleCtaMove);
      cta?.removeEventListener("pointerleave", resetCta);
      window.removeEventListener("resize", handleResize);
    };
  }, { scope: headerRef, dependencies: [pathname, variant] });

  const secondaryIsActive = secondaryNavigation.some(([href]) =>
    routeIsActive(pathname, href)
  );
  const baseHeaderClass = variant === "landing"
    ? "pointer-events-none fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-5 sm:py-4 transition-transform duration-300 ease-out"
    : "pointer-events-none sticky inset-x-0 top-0 z-50 bg-transparent px-3 py-3 sm:px-5 sm:py-4 transition-transform duration-300 ease-out";

  const headerClassName = `${baseHeaderClass} ${
    (!isMobileMenuOpen && !isMenuClosing)
      ? "mix-blend-difference lg:mix-blend-normal"
      : "mix-blend-normal"
  }`;

  return (
    <>
      <header
        ref={headerRef}
        data-site-header={variant === "landing" ? "" : undefined}
        data-shell-header={variant === "interior" ? "" : undefined}
        className={headerClassName}
      >
        <div
          data-header-shell
          data-header-mode={variant === "landing" ? "top" : "scrolled"}
          className="site-header-shell pointer-events-auto relative z-50 isolate mx-auto flex min-h-16 max-w-[1280px] items-center justify-between gap-3 rounded-full lg:border lg:border-black/[0.08] lg:bg-[rgba(255,254,250,0.88)] p-2 lg:shadow-[0_10px_36px_rgba(17,17,17,0.07)] lg:backdrop-blur-xl"
        >
          <Link
            data-header-brand
            className="flex min-w-0 items-center rounded-full px-3 sm:px-4 text-white lg:text-ink"
            href="/"
            aria-label="AmanKlik AI — Beranda"
          >
            <span className="text-[15px] font-semibold leading-none tracking-[-0.035em]">
              Aman<span className="text-white lg:text-ai">Klik</span>
            </span>
          </Link>

          <nav
            data-desktop-nav
            className="relative hidden items-center gap-0.5 rounded-full bg-black/[0.04] p-1 text-[14px] font-medium tracking-[-0.015em] lg:flex"
            aria-label="Navigasi utama"
          >
            <span
              data-nav-cursor
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-white opacity-0 shadow-[0_3px_12px_rgba(17,17,17,0.08)]"
            />
            {primaryNavigation.map(([href, label]) => {
              const active = routeIsActive(pathname, href);

              return (
                <Link
                  key={href}
                  data-nav-link
                  data-active={active ? "true" : undefined}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={`group/navitem relative z-10 flex min-h-10 items-center rounded-full px-[18px] transition-colors duration-300 ${
                    active ? "text-ai" : "text-ink/60 hover:text-ai"
                  }`}
                  href={href}
                >
                  <RollingLabel>{label}</RollingLabel>
                </Link>
              );
            })}

            <details ref={moreDetailsRef} className="group relative">
              <summary
                data-nav-link
                data-active={secondaryIsActive ? "true" : undefined}
                aria-label="Lainnya"
                onClick={handleMoreToggle}
                className={`group/navitem relative z-10 flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full px-[18px] transition-colors duration-300 [&::-webkit-details-marker]:hidden ${
                  secondaryIsActive ? "text-ai" : "text-ink/60 hover:text-ai"
                }`}
              >
                <RollingLabel>Lainnya</RollingLabel>
                <span
                  className="text-[11px] transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </summary>
              <nav
                ref={morePopoverRef}
                className="site-nav-popover absolute right-0 top-[calc(100%+18px)] w-[390px] overflow-hidden rounded-[28px] border border-white/10 bg-ink p-3 text-surface shadow-[0_24px_70px_rgba(17,17,17,0.28)]"
                aria-label="Navigasi tambahan"
              >
                <div
                  data-dropdown-intro
                  className="flex items-center justify-between px-4 pb-3 pt-2"
                >
                  <p className="text-[11px] font-medium tracking-[-0.01em] text-white/45">
                    Menu lainnya
                  </p>
                </div>
                <div className="grid gap-1">
                  {secondaryNavigation.map(
                    ([href, label, description]) => {
                      const active = routeIsActive(pathname, href);

                      return (
                        <Link
                          key={href}
                          data-dropdown-item
                          aria-label={label}
                          aria-current={active ? "page" : undefined}
                          className={`group/link grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-3 rounded-[20px] px-4 transition-colors ${
                            active
                              ? "bg-ai text-white"
                              : "text-white/72 hover:bg-white/10 hover:text-white"
                          }`}
                          href={href}
                          prefetch={href === "/history" ? false : undefined}
                        >
                          <span>
                            <span className="block text-[15px] font-medium tracking-[-0.025em]">
                              {label}
                            </span>
                            <span className="mt-1 block text-xs font-normal opacity-55">
                              {description}
                            </span>
                          </span>
                          <span
                            className="text-lg transition-transform group-hover/link:translate-x-1"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </Link>
                      );
                    },
                  )}
                </div>
              </nav>
            </details>
          </nav>

          <div className="flex items-center gap-2">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-overlay"
              className="group relative flex size-11 lg:hidden cursor-pointer items-center justify-center rounded-full shadow-md outline-none focus:outline-none [-webkit-tap-highlight-color:transparent] bg-white lg:bg-ink"
            >
              <div className="relative h-[10px] w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full transition-transform duration-300 ease-out origin-center bg-ink lg:bg-white ${
                    isMobileMenuOpen ? "translate-y-[4.25px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 bottom-0 h-[1.5px] w-full transition-transform duration-300 ease-out origin-center bg-ink lg:bg-white ${
                    isMobileMenuOpen ? "-translate-y-[4.25px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>

            <Link
              data-header-cta
              aria-label="Periksa"
              className="motion-button group/navitem hidden min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium tracking-[-0.015em] text-white shadow-[0_8px_22px_rgba(17,17,17,0.16)] sm:flex"
              href="/scan"
            >
              <span className="motion-button__label">Periksa</span>
              <MotionArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <div
        id="mobile-navigation-overlay"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        aria-hidden={!isMobileMenuOpen && !isMenuClosing}
        className="fixed inset-0 z-40 hidden min-h-[100dvh] overflow-y-auto overscroll-contain lg:hidden"
      >
        <div data-menu-bg className="absolute inset-0 bg-ink" />

        <div className="relative flex min-h-[100dvh] flex-col px-6 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32">
          <nav
            aria-label="Navigasi seluler"
            className="flex flex-1 flex-col justify-center gap-4 py-6 sm:gap-5"
          >
            {navigation.map(([href, label]) => {
              const active = routeIsActive(pathname, href);
              return (
                <div key={href} className="overflow-hidden">
                  <Link
                    data-menu-link
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block text-[clamp(2.35rem,11vw,4rem)] font-bold leading-[0.9] tracking-[-0.065em] transition-colors ${
                      active ? "text-ai" : "text-white hover:text-white/80"
                    }`}
                  >
                    {label}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div
            data-menu-footer
            className="mt-auto flex flex-col items-start gap-5 border-t border-white/10 pt-6 text-sm text-white/50 sm:gap-7 sm:pt-8"
          >
            <Link
              href="/scan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-ink font-semibold text-lg hover:bg-ai hover:text-white transition-colors"
            >
              Mulai Periksa
              <span className="text-xl leading-none">→</span>
            </Link>
            <span>AmanKlik AI © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </>
  );
}
