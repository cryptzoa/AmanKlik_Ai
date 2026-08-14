"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { useEffect } from "react";
import { TransitionLink as Link } from "@/components/site/transition-link";

const BUTTON_SELECTOR =
  '.motion-button, .editorial-button, button:not([role="tab"])';
const RESET_DELAY = 620;

type MotionButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  dataHeroCta?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLElement>;
};

export function MotionArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="motion-button__icon"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path d="M3 10h13" />
      <path d="m10.5 4.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function MotionButton({
  arrow = false,
  children,
  className = "",
  dataHeroCta = false,
  disabled,
  href,
  onClick,
  type = "button",
}: MotionButtonProps) {
  const content = (
    <>
      <span className="motion-button__label">{children}</span>
      {arrow ? <MotionArrowIcon /> : null}
    </>
  );
  const classes = `motion-button editorial-button ${className}`.trim();

  if (href) {
    return (
      <Link
        aria-disabled={disabled || undefined}
        className={classes}
        data-hero-cta={dataHeroCta ? "" : undefined}
        href={href}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      data-hero-cta={dataHeroCta ? "" : undefined}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      type={type}
    >
      {content}
    </button>
  );
}

export function ButtonMotion(
  { selector = BUTTON_SELECTOR }: { selector?: string } = {},
) {
  useEffect(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const resetTimers = new WeakMap<HTMLElement, number>();
    const boundsByButton = new WeakMap<HTMLElement, DOMRect>();

    const findButton = (target: EventTarget | null) => {
      return target instanceof Element
        ? target.closest<HTMLElement>(selector)
        : null;
    };

    const handlePointerOver = (event: PointerEvent) => {
      const button = findButton(event.target);
      if (!button) return;
      const related = event.relatedTarget;
      if (related instanceof Node && button.contains(related)) return;

      const timer = resetTimers.get(button);
      if (timer) window.clearTimeout(timer);
      button.classList.remove("is-leaving");
      button.classList.add("is-hovering");
      boundsByButton.set(button, button.getBoundingClientRect());
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const button = findButton(event.target);
      if (!button) return;

      const bounds = boundsByButton.get(button) ?? button.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 5;
      button.style.setProperty("--button-magnet-x", `${x.toFixed(2)}px`);
      button.style.setProperty("--button-magnet-y", `${y.toFixed(2)}px`);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const button = findButton(event.target);
      if (!button) return;
      const related = event.relatedTarget;
      if (related instanceof Node && button.contains(related)) return;

      button.classList.remove("is-hovering");
      button.classList.add("is-leaving");
      button.style.setProperty("--button-magnet-x", "0px");
      button.style.setProperty("--button-magnet-y", "0px");
      boundsByButton.delete(button);

      const timer = window.setTimeout(() => {
        button.classList.remove("is-leaving");
      }, RESET_DELAY);
      resetTimers.set(button, timer);
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, [selector]);

  return null;
}
