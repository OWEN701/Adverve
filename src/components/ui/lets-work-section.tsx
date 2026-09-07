"use client";

import type React from "react";

import { useState } from "react";
import { ArrowUpRight, Calendar } from "lucide-react";

/**
 * Colour tokens — the source component was written against a shadcn theme
 * (var(--foreground) / --background / --border, text-muted-foreground …) that
 * this project does not have. Mapped to the site's slate / cyan palette here.
 */
const ACCENT = "#22d3ee"; // cyan-400 — hover / active
const INK = "#f1f5f9"; // slate-100 — default text + icons
const ON_ACCENT = "#0f172a"; // slate-900 — text on an accent fill
const LINE = "#334155"; // slate-700 — hairlines

export interface LetsWorkTogetherProps {
  /** Where the "Book a call" button sends people */
  bookingUrl: string;
  /** Contact email shown under the headline */
  email: string;
  /** Small label above the headline */
  availabilityLabel?: string;
  className?: string;
}

export function LetsWorkTogether({
  bookingUrl,
  email,
  availabilityLabel = "Taking on new clients",
  className,
}: LetsWorkTogetherProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsClicked(true);

    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };

  const handleBookCall = () => {
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className={`flex min-h-screen items-center justify-center px-6 ${className ?? ""}`}
    >
      <div className="relative flex flex-col items-center gap-12">
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: showSuccess ? 1 : 0,
            transform: showSuccess ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          {/* Elegant heading */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-xs font-medium tracking-[0.3em] uppercase text-slate-400 transition-all duration-500"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "100ms",
              }}
            >
              Perfect
            </span>
            <h3
              className="text-3xl font-light tracking-tight text-slate-100 transition-all duration-500 sm:text-4xl"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "200ms",
              }}
            >
              Let's talk
            </h3>
          </div>

          {/* Book a call button */}
          <button
            onClick={handleBookCall}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative flex items-center gap-4 transition-all duration-500 cursor-pointer"
            style={{
              transform: showSuccess
                ? isButtonHovered
                  ? "translateY(0) scale(1.02)"
                  : "translateY(0) scale(1)"
                : "translateY(15px) scale(1)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "150ms",
            }}
          >
            {/* Left line */}
            <div
              className="h-px w-8 transition-all duration-500 sm:w-12"
              style={{
                backgroundColor: LINE,
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />

            {/* Button content */}
            <div
              className="relative flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 transition-all duration-500 sm:px-8 sm:py-4"
              style={{
                borderColor: isButtonHovered ? ACCENT : LINE,
                backgroundColor: isButtonHovered ? ACCENT : "transparent",
                boxShadow: isButtonHovered
                  ? "0 0 30px rgba(34,211,238,0.25), 0 10px 40px rgba(34,211,238,0.15)"
                  : "none",
              }}
            >
              <Calendar
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{ color: isButtonHovered ? ON_ACCENT : INK }}
              />
              <span
                className="text-sm font-medium tracking-wide transition-all duration-500 sm:text-base"
                style={{ color: isButtonHovered ? ON_ACCENT : INK }}
              >
                Book a call
              </span>
              <ArrowUpRight
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? ON_ACCENT : INK,
                  transform: isButtonHovered ? "translate(3px, -3px) scale(1.1)" : "translate(0, 0) scale(1)",
                }}
              />
            </div>

            {/* Right line */}
            <div
              className="h-px w-8 transition-all duration-500 sm:w-12"
              style={{
                backgroundColor: LINE,
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />
          </button>

          {/* Subtle subtext */}
          <span
            className="text-xs tracking-widest uppercase text-slate-500 transition-all duration-500"
            style={{
              transform: showSuccess ? "translateY(0)" : "translateY(10px)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "450ms",
            }}
          >
            30 min discovery call
          </span>
        </div>

        <div
          className="flex items-center gap-3 transition-all duration-500"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(-20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium tracking-widest uppercase text-slate-400">
            {availabilityLabel}
          </span>
        </div>

        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>)}
          style={{
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <h2
              className="relative text-center text-5xl font-light tracking-tight text-slate-100 sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(-40px) scale(0.95)" : "translateY(0) scale(1)",
              }}
            >
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  Let's work
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  <span className="text-slate-500">together</span>
                </span>
              </span>
            </h2>

            <div className="relative mt-4 flex size-16 items-center justify-center sm:size-20">
              <div
                className="pointer-events-none absolute inset-0 rounded-full border transition-all ease-out"
                style={{
                  borderColor: isClicked ? ACCENT : isHovered ? ACCENT : LINE,
                  backgroundColor: isClicked ? "transparent" : isHovered ? ACCENT : "transparent",
                  transform: isClicked ? "scale(3)" : isHovered ? "scale(1.1)" : "scale(1)",
                  opacity: isClicked ? 0 : 1,
                  transitionDuration: isClicked ? "700ms" : "500ms",
                }}
              />
              <ArrowUpRight
                className="size-6 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-7"
                style={{
                  transform: isClicked
                    ? "translate(100px, -100px) scale(0.5)"
                    : isHovered
                      ? "translate(2px, -2px)"
                      : "translate(0, 0)",
                  opacity: isClicked ? 0 : 1,
                  color: isHovered && !isClicked ? ON_ACCENT : INK,
                  transitionDuration: isClicked ? "600ms" : "500ms",
                }}
              />
            </div>
          </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:-left-16">
            <div
              className="h-px w-8 transition-all duration-500 sm:w-12"
              style={{
                backgroundColor: LINE,
                transform: isClicked ? "scaleX(0) translateX(-20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 sm:-right-16">
            <div
              className="h-px w-8 transition-all duration-500 sm:w-12"
              style={{
                backgroundColor: LINE,
                transform: isClicked ? "scaleX(0) translateX(20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
        </div>

        <div
          className="mt-8 flex flex-col items-center gap-4 text-center transition-all duration-500 delay-100"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Need outreach infrastructure built, or someone to own the backend? Tell us what's
            not working and we'll show you what to fix.
          </p>
          <a
            href={`mailto:${email}`}
            className="text-xs tracking-widest uppercase text-slate-500 transition-colors hover:text-cyan-400"
          >
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}
