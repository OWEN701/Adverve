"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Calendar, Check } from "lucide-react";

/**
 * Contact / booking section. The booking calendar is embedded inline so a
 * visitor who clicks "Book a call" anywhere on the page lands straight on open
 * slots — no click-to-reveal step and no new tab. The iframe only loads once
 * the section is near the viewport, so it costs nothing on first paint.
 */

export interface LetsWorkTogetherProps {
  /** Booking page, embedded inline and linked as a fallback */
  bookingUrl: string;
  /** Contact email shown under the calendar */
  email: string;
  /** Small label above the headline */
  availabilityLabel?: string;
  className?: string;
}

const REASSURANCES = [
  "30 minutes, no pitch deck",
  "No commitment",
  "Reply within 24 hours",
  "You leave with a fix list either way",
];

export function LetsWorkTogether({
  bookingUrl,
  email,
  availabilityLabel = "Taking on new clients",
  className,
}: LetsWorkTogetherProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [loadCalendar, setLoadCalendar] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setLoadCalendar(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadCalendar(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className={`px-4 py-20 sm:px-6 lg:px-8 ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium tracking-widest uppercase text-slate-400">
            {availabilityLabel}
          </span>
        </div>

        <div className="space-y-4">
          <h2
            id="contact-heading"
            className="text-4xl font-light tracking-tight text-slate-100 sm:text-5xl md:text-6xl"
          >
            Book a 30-minute <span className="text-slate-500">outreach review</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-300">
            Tell me what you're running today and what's not working. You'll leave with a clear
            list of what to build or fix, whether or not we work together.
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
          {REASSURANCES.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <Check className="size-4 text-cyan-400" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl shadow-cyan-500/10">
          {loadCalendar ? (
            <iframe
              src={bookingUrl}
              title="Book a 30-minute outreach review with Owen"
              loading="lazy"
              className="block h-[720px] w-full"
            />
          ) : (
            <div className="flex h-[720px] items-center justify-center bg-slate-900 text-slate-500">
              <Calendar className="size-6" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 text-sm text-slate-400 sm:flex-row sm:gap-6">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-400"
          >
            Calendar not loading? Open it in a new tab
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <span className="hidden text-slate-600 sm:inline" aria-hidden="true">
            ·
          </span>
          <a href={`mailto:${email}`} className="transition-colors hover:text-cyan-400">
            Or email {email}
          </a>
        </div>
      </div>
    </section>
  );
}
