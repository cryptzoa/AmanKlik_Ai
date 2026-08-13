"use client";

import Link from "next/link";
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

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.currentTarget.target === "_blank" ||
      event.currentTarget.hasAttribute("download")
    ) return;

    const currentUrl = new URL(window.location.href);
    const destinationUrl = new URL(event.currentTarget.href);
    if (destinationUrl.origin !== currentUrl.origin) return;

    const currentRoute = `${currentUrl.pathname}${currentUrl.search}`;
    const destinationRoute = `${destinationUrl.pathname}${destinationUrl.search}`;
    if (currentRoute === destinationRoute) {
      if (!destinationUrl.hash || destinationUrl.hash === currentUrl.hash) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
    navigate(`${destinationRoute}${destinationUrl.hash}`);
  };

  return (
    <Link
      href={href}
      prefetch={prefetch ?? true}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
