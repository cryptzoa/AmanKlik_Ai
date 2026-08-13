"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (pathname === href) e.preventDefault();
  };

  return (
    <Link
      href={href}
      prefetch={prefetch ?? true}
      onClick={handleClick}
      onNavigate={(event) => {
        if (pathname === href || href.startsWith("#")) return;
        event.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
