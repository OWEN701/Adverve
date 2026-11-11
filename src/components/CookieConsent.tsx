import { useEffect, useState } from 'react';

const CONSENT_KEY = 'adverve-analytics-consent';

type Choice = 'granted' | 'denied';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/**
 * GA4 loads with Consent Mode defaulting to "denied" (see index.html), so no
 * analytics cookies are set until the visitor accepts here. A previous choice
 * is re-applied on load and the banner stays hidden.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === 'granted') {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    } else if (choice === null) {
      setVisible(true);
    }
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // storage blocked — the choice still applies for this page view
    }
    window.gtag?.('consent', 'update', { analytics_storage: choice });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl sm:right-auto"
    >
      <p className="text-sm leading-relaxed text-slate-300">
        We use analytics cookies (Google Analytics) to see which pages are useful. Nothing is set
        unless you accept.{' '}
        <a href="/privacy/" className="text-cyan-400 underline-offset-2 hover:underline">
          Privacy policy
        </a>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => decide('granted')}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
        >
          Accept
        </button>
        <button
          onClick={() => decide('denied')}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
