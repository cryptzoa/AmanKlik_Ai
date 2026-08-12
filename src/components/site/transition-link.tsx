"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, MouseEvent, AnchorHTMLAttributes } from "react";
import { useTransition } from "./transition-context";

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "data-active"?: string;
  "data-nav-link"?: boolean | string;
  "data-dropdown-item"?: boolean | string;
  "data-header-brand"?: boolean | string;
  "data-header-cta"?: boolean | string;
  prefetch?: boolean;
}

export function TransitionLink({ children, href, onClick, prefetch, ...props }: TransitionLinkProps) {
  const { navigate } = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleTransition = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    if (pathname === href || href.startsWith('#')) {
      if (pathname === href) {
        e.preventDefault();
      }
      return;
    }

    e.preventDefault();
    navigate(href);
  };

  const handleMouseEnter = () => {
    if (prefetch !== false && href && !href.startsWith('#')) {
      router.prefetch(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleTransition}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </a>
  );
}
