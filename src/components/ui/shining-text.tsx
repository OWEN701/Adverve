"use client";

import { motion } from "motion/react";

/**
 * Animated shimmer text — a light sweep travels across the letters on a loop.
 * Handy for "thinking…" / loading states.
 *
 * Note: rendered as a <span> (the source used <h1>; a shimmer label is not a
 * page heading, and an <h1> here would break document outline / a11y).
 */
export function ShiningText({ text }: { text: string }) {
  return (
    <motion.span
      className="inline-block bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-normal text-transparent"
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}
