import type { Offer } from './types';

// Deliberately empty. Per the build plan, real affiliate offers are wired only after
// (1) confirming 2-3 target casino affiliate programs' site-acceptance policy toward
// a playable simulator, and (2) sitewide CAP Code Section 16 content review for the
// GB branch. Until then every lookup below returns undefined, so resolveOffer()
// always resolves to type:'none' regardless of region — the routing logic is real and
// testable, the offers themselves are not.
export const LEGAL_CASINO_OFFERS: Record<string, Offer | undefined> = {};
export const SWEEPSTAKES_OFFERS: Record<string, Offer | undefined> = {};
export const GB_LICENSED_OFFERS: Record<string, Offer | undefined> = {};

// A single sweepstakes-casino fallback used for any US state without a legal
// real-money offer. Still undefined until a real operator is vetted and added.
export const DEFAULT_SWEEPSTAKES_OFFER: Offer | undefined = undefined;
