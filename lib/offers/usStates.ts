// States with legal, regulated real-money ONLINE casino play (not just online sports
// betting or in-person casinos) as of this list's last-verified date. This is
// deliberately a short, hand-maintained list, not derived from anything live — per
// the build plan's offer-layer requirement, this must stay in sync with actual state
// law, which changes. Re-verify against each state's gaming commission before relying
// on this for a real affiliate placement, and update LAST_VERIFIED whenever checked.
//
// ⚠️ Not yet independently re-verified this session against each state's regulator —
// sourced from general knowledge at plan-writing time. Confirm live before go-live.
export const LAST_VERIFIED = '2026-08-19';

export const US_LEGAL_ONLINE_CASINO_STATES: readonly string[] = [
  'NJ', // New Jersey
  'PA', // Pennsylvania
  'MI', // Michigan
  'WV', // West Virginia
  'CT', // Connecticut
  'DE', // Delaware
  'RI', // Rhode Island (launched 2024)
];

export function isLegalOnlineCasinoState(stateCode: string): boolean {
  return US_LEGAL_ONLINE_CASINO_STATES.includes(stateCode.toUpperCase());
}
