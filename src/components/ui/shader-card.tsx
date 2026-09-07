"use client";

import type { ReactNode } from "react";
import { Warp } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Brand-tuned Warp palettes — dark slate base with cyan / blue accents, one
 * subtle hue shift per card so a grid of them reads as a set, not a copy.
 */
const PALETTES: string[][] = [
  ["hsl(222, 47%, 7%)", "hsl(205, 88%, 20%)", "hsl(190, 95%, 42%)", "hsl(215, 60%, 12%)"],
  ["hsl(222, 47%, 7%)", "hsl(213, 84%, 22%)", "hsl(199, 96%, 46%)", "hsl(220, 55%, 12%)"],
  ["hsl(220, 45%, 8%)", "hsl(198, 86%, 19%)", "hsl(185, 92%, 40%)", "hsl(210, 58%, 13%)"],
  ["hsl(224, 48%, 7%)", "hsl(216, 82%, 21%)", "hsl(200, 96%, 44%)", "hsl(222, 52%, 12%)"],
  ["hsl(221, 46%, 8%)", "hsl(202, 85%, 20%)", "hsl(192, 94%, 43%)", "hsl(214, 56%, 12%)"],
];

export interface ShaderCardProps {
  /** Picks the palette + pattern variation (wraps around) */
  index?: number;
  children: ReactNode;
  className?: string;
}

/**
 * A card with a slow, low-key animated WebGL shader background (Warp) behind a
 * dark scrim. Content sits on top and stays fully legible. Respects
 * prefers-reduced-motion — falls back to a static gradient with no canvas.
 */
export default function ShaderCard({ index = 0, children, className }: ShaderCardProps) {
  const reduceMotion = useReducedMotion();
  const colors = PALETTES[index % PALETTES.length];
  const shape = index % 2 === 0 ? ("checks" as const) : ("stripes" as const);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-700",
        "transition-all duration-300 hover:border-cyan-500 hover:-translate-y-2",
        "hover:shadow-2xl hover:shadow-cyan-500/20",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {reduceMotion ? (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            }}
          />
        ) : (
          <Warp
            style={{ height: "100%", width: "100%" }}
            proportion={0.4}
            softness={1.1}
            distortion={0.1}
            swirl={0.5}
            swirlIterations={8}
            shape={shape}
            shapeScale={0.06}
            scale={1}
            rotation={0}
            speed={0.26}
            colors={colors}
          />
        )}
      </div>

      <div className="relative z-10 h-full bg-slate-950/80 p-8">{children}</div>
    </div>
  );
}
