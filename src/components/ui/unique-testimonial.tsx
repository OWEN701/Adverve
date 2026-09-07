"use client";

import { useState } from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export interface Testimonial {
  id?: string | number;
  quote: string;
  /** Person's name (shown on the avatar pill) */
  name: string;
  /** Small line under the quote, e.g. "Website Design client" */
  role?: string;
  /** 1–2 letters for the avatar */
  initials: string;
  /** Tailwind gradient classes for the avatar, e.g. "from-cyan-500 to-blue-600" */
  gradient: string;
}

export interface TestimonialsProps {
  testimonials: Testimonial[];
  /** Show a small 5-star row above the quote (default true) */
  showStars?: boolean;
}

export function Testimonials({ testimonials, showStars = true }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0]?.quote ?? "");
  const [displayedRole, setDisplayedRole] = useState(testimonials[0]?.role ?? "");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (testimonials.length === 0) return null;

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote);
      setDisplayedRole(testimonials[index].role ?? "");
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      {showStars && (
        <div className="flex items-center gap-1" aria-label="Rated 5 out of 5 stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-amber-400 text-sm" aria-hidden="true">
              ★
            </span>
          ))}
        </div>
      )}

      {/* Quote Container */}
      <div className="relative px-8">
        <span className="absolute -left-2 -top-6 text-7xl font-serif text-white/[0.08] select-none pointer-events-none">
          "
        </span>

        <p
          className={cn(
            "text-2xl md:text-3xl font-light text-white text-center max-w-lg leading-relaxed transition-all duration-[400ms] ease-out",
            isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
          )}
        >
          {displayedQuote}
        </p>

        <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-white/[0.08] select-none pointer-events-none">
          "
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-2">
        {/* Role text */}
        <p
          className={cn(
            "min-h-[1rem] text-xs text-slate-400 tracking-[0.2em] uppercase transition-all duration-500 ease-out",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          )}
        >
          {displayedRole}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index && !isActive;
            const showName = isActive || isHovered;

            return (
              <button
                key={testimonial.id ?? testimonial.name}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`Show testimonial from ${testimonial.name}`}
                aria-pressed={isActive}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-white shadow-lg" : "bg-transparent hover:bg-slate-800",
                  showName ? "pr-4 pl-2 py-2" : "p-0.5",
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white",
                    testimonial.gradient,
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isActive ? "ring-2 ring-slate-900/20" : "ring-0",
                    !isActive && "hover:scale-105",
                  )}
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap block",
                        "transition-colors duration-300",
                        isActive ? "text-slate-900" : "text-slate-100",
                      )}
                    >
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
