'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'blackjack-calc-age-confirmed';

// Client-only overlay, shown once per browser (localStorage-gated). Deliberately
// does NOT block server-rendered content underneath — crawlers and no-JS clients see
// the full page; this is a UX/compliance gate for human visitors, not an SEO cloak.
// Required before any affiliate wiring per the build plan (ASA CAP Code Section 16
// for GB, standard practice for US casino affiliate program approval).
export function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(STORAGE_KEY) !== 'yes') {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function confirm() {
    window.localStorage.setItem(STORAGE_KEY, 'yes');
    setVisible(false);
  }

  function decline() {
    window.location.href = 'https://www.google.com';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6, 12, 9, 0.92)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Age confirmation"
    >
      <div className="surface p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-3">Are you 21 or older?</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          This site covers blackjack math and, in some regions, links to licensed
          gambling operators. You must be 21+ in the US or 18+ elsewhere to continue.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="btn-primary" onClick={confirm}>
            Yes, I'm old enough
          </button>
          <button
            className="surface px-4 py-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
            onClick={decline}
          >
            No, take me back
          </button>
        </div>
      </div>
    </div>
  );
}
