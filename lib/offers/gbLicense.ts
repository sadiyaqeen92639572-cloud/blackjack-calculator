// UK Gambling Commission license verification — per the build plan, this must check
// against the LIVE GC register (https://www.gamblingcommission.gov.uk/public-register),
// not a hardcoded snapshot, since operator licenses are added/revoked over time.
//
// NOT IMPLEMENTED: no live register integration exists yet. This stub always returns
// false so the offer layer defaults to "no offer" for GB rather than silently
// pretending an unverified operator is licensed. Wiring this up (scheduled check
// against the GC register API/export, cached with a short TTL) is required before any
// GB offer goes live — see build plan's Offer/Geo Layer section on CAP Code Section 16.
export async function isGBLicenseVerified(_operatorId: string): Promise<boolean> {
  return false;
}
