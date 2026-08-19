'use client';

import { useEffect, useState } from 'react';
import type { OfferResult } from '@/lib/offers/types';

// Standalone, clearly-labeled affiliate placement — deliberately never imported into
// the calculator/simulator/house-edge/payout tool components themselves (build plan:
// "never inline in calculator/simulator result UI"). Not yet mounted on any page —
// wire it in only after affiliate-program acceptance is confirmed per the plan's
// Offer/Geo Layer section. Renders nothing when there's no offer for the visitor's
// region, which is the only real state right now since the catalog is empty.
export function OfferSlot() {
  const [result, setResult] = useState<OfferResult | null>(null);

  useEffect(() => {
    fetch('/api/offer/')
      .then((r) => r.json())
      .then(setResult)
      .catch(() => setResult(null));
  }, []);

  if (!result || result.type === 'none' || !result.offer) return null;

  return (
    <div className="surface p-4 mt-6 text-sm" data-testid="offer-slot">
      <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        Advertisement — Licensed Operator ({result.offer.licenseNote})
      </div>
      <a href={result.offer.url} target="_blank" rel="noopener sponsored" className="underline">
        {result.offer.operatorName}
      </a>
    </div>
  );
}
