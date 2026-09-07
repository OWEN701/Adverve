"use client";

import type React from "react";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  /** "md" (default) for hero CTAs, "sm" for nav / inline */
  size?: "sm" | "md";
  type?: "button" | "submit";
  "aria-label"?: string;
  className?: string;
}

/**
 * Animated conic-gradient border CTA button.
 *
 * The source shipped its CSS as a Next.js `<style jsx>` block, which does
 * nothing in Vite — the styles now live in `src/index.css` under `.shiny-cta`
 * (class-scoped, retargeted to the cyan brand, size-adjustable via
 * `--shiny-pad-*` and `[data-size]`).
 */
export function ShinyButton({
  children,
  onClick,
  size = "md",
  type = "button",
  className = "",
  "aria-label": ariaLabel,
}: ShinyButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      data-size={size}
      aria-label={ariaLabel}
      className={`shiny-cta ${className}`}
    >
      <span>{children}</span>
    </button>
  );
}
