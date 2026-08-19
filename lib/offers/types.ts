// Region codes this layer resolves to: two-letter US state postal code, 'GB', or
// 'OTHER' (anything else / unresolvable). Not a full ISO region list — deliberately
// narrow to the regions this site's offer logic actually branches on.
export type ResolvedRegion = `US-${string}` | 'GB' | 'OTHER';

export type OfferType = 'legal-casino' | 'sweepstakes' | 'gb-licensed' | 'none';

export interface Offer {
  id: string;
  operatorName: string;
  url: string;
  licenseNote: string; // shown alongside the offer — e.g. "NJ DGE licensed" / "UKGC licensed"
}

export interface OfferResult {
  type: OfferType;
  region: ResolvedRegion;
  offer: Offer | null;
}
