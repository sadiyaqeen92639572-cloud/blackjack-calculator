import { isLegalOnlineCasinoState } from './usStates';
import { LEGAL_CASINO_OFFERS, DEFAULT_SWEEPSTAKES_OFFER, GB_LICENSED_OFFERS } from './catalog';
import type { OfferResult, ResolvedRegion } from './types';

// Normalizes raw geo signal (CF-IPCountry / CF-Region headers, or Workers `request.cf`)
// into the narrow ResolvedRegion this layer branches on. Never trust raw header input
// past this point — everything downstream works off ResolvedRegion only.
export function resolveRegion(country: string | null, region: string | null): ResolvedRegion {
  if (country?.toUpperCase() === 'GB') return 'GB';
  if (country?.toUpperCase() === 'US' && region) {
    return `US-${region.toUpperCase()}`;
  }
  return 'OTHER';
}

// Region → offer type/placement. Table-driven, not hardcoded per-call — the routing
// logic here is real and covered by tests; the offers themselves are intentionally
// empty (see catalog.ts) until affiliate-program acceptance is confirmed. No
// placement this function returns should ever be rendered inline in calculator or
// simulator result UI — callers must confine it to a clearly labeled, separate
// section (build plan, Offer/Geo Layer).
export function resolveOffer(resolvedRegion: ResolvedRegion): OfferResult {
  // Type reflects the region CATEGORY (which offer shape this visitor should see),
  // independent of whether the catalog actually has an offer populated yet — 'none'
  // is reserved for regions with no applicable offer category at all (OTHER), not
  // for "category matched but catalog is empty." Callers (OfferSlot) must still
  // check `offer !== null` before rendering anything — an empty catalog means no
  // real placement exists yet even though the routing category is correct.
  if (resolvedRegion === 'GB') {
    // GB requires per-operator Gambling Commission license verification (see
    // gbLicense.ts) before an offer is ever shown, not just a region match.
    const offer = GB_LICENSED_OFFERS['default'] ?? null;
    return { type: 'gb-licensed', region: resolvedRegion, offer };
  }

  if (resolvedRegion.startsWith('US-')) {
    const stateCode = resolvedRegion.slice(3);
    if (isLegalOnlineCasinoState(stateCode)) {
      const offer = LEGAL_CASINO_OFFERS[stateCode] ?? null;
      return { type: 'legal-casino', region: resolvedRegion, offer };
    }
    const offer = DEFAULT_SWEEPSTAKES_OFFER ?? null;
    return { type: 'sweepstakes', region: resolvedRegion, offer };
  }

  return { type: 'none', region: resolvedRegion, offer: null };
}
