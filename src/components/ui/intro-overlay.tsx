"use client";

import { useEffect, useState } from "react";
import PathDrawingPortfolioHero from "./path-drawing-portfolio-hero";

const SEEN_KEY = "adverve-intro-seen";
/** How long the drawn name holds before it starts fading out */
const HOLD_MS = 1500;
/** Fade-out duration */
const FADE_MS = 700;

type Phase = "play" | "fade" | "done";

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Visitors arriving from a campaign link (cold email, ads) go straight to the page */
function isCampaignTraffic(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    return ["utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid", "li_fat_id"].some((k) =>
      params.has(k),
    );
  } catch {
    return false;
  }
}

function shouldSkip(): boolean {
  return alreadySeen() || prefersReducedMotion() || isCampaignTraffic();
}

/**
 * Full-screen path-drawn "Adverve" shown once per browser session on first
 * load, then it fades to reveal the site. A refresh in the same session skips
 * it; a new session, reduced-motion or a campaign link shows the site
 * immediately. Any click, key, scroll or touch dismisses it early.
 */
export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>(() => (shouldSkip() ? "done" : "play"));

  useEffect(() => {
    if (shouldSkip()) {
      setPhase("done");
      return;
    }

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // private mode — the intro simply plays again next load
    }

    document.body.style.overflow = "hidden";
    // Both timers are scheduled up front so the play -> fade transition never
    // cancels the pending fade -> done step (that would leave the overlay
    // mounted, invisible, forever).
    const toFade = window.setTimeout(() => setPhase("fade"), HOLD_MS);
    const toDone = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, HOLD_MS + FADE_MS);

    const skip = () => {
      clearTimeout(toFade);
      clearTimeout(toDone);
      setPhase("done");
      document.body.style.overflow = "";
    };
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    skipEvents.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));

    return () => {
      clearTimeout(toFade);
      clearTimeout(toDone);
      skipEvents.forEach((e) => window.removeEventListener(e, skip));
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] bg-slate-950 transition-opacity ease-out ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <PathDrawingPortfolioHero
        brand="Adverve"
        eyebrow="B2B Outreach Infrastructure"
        tagline="Outreach systems that book meetings."
        fromColor="#22d3ee"
        toColor="#3b82f6"
        showScrollCue={false}
        drawDurationSec={1.1}
        loopDraw={false}
      />
    </div>
  );
}
