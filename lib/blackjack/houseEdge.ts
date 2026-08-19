import type { RuleSet } from './types';

// Additive rule-effect model, same approach Wizard of Odds's own house-edge tool
// uses: a baseline edge for a reference ruleset, plus published per-rule deltas
// (percentage points), composed linearly. This is a well-established industry
// approximation, not exact combinatorial analysis — real interaction effects between
// rules are small at standard rule sets but nonzero. Baseline and deltas below are
// sourced from widely-published rule-variation tables (Wizard of Odds "house edge"
// appendix); NOT independently re-derived this session.
//
// ⚠️ Verification status (L2, per the build plan): flagged, not yet confirmed against
// a live authoritative source cell-by-cell. Spot-check the constants below against
// wizardofodds.com's house-edge calculator before shipping any page that displays
// these numbers as a claimed fact — do not treat this file as verified until that
// check has actually been done.

// Baseline: 6 decks, S17, DAS, no surrender, 3:2 blackjack payout, resplit allowed.
const BASELINE_EDGE_PCT = 0.46;
const BASELINE: RuleSet = {
  numDecks: 6,
  dealerHitsSoft17: false,
  doubleAfterSplit: true,
  surrenderAllowed: false,
  resplitAllowed: true,
  maxSplitHands: 4,
  blackjackPayout: '3:2',
  penetration: 0.75,
};

// Deck-count effect relative to 6 decks (cumulative, in percentage points).
// Fewer decks favor the player slightly (better odds of player blackjack /
// favorable compositions).
const DECK_DELTA_FROM_6: Record<number, number> = {
  8: 0.02,
  6: 0,
  4: -0.03,
  2: -0.16, // -0.03 (4-deck) plus published 4→2 delta of -0.13
  1: -0.33, // plus published 2→1 delta of -0.17
};

function deckDelta(numDecks: number): number {
  if (numDecks in DECK_DELTA_FROM_6) return DECK_DELTA_FROM_6[numDecks];
  // Unlisted deck counts: nearest known neighbor — not exact, flagged above.
  const known = Object.keys(DECK_DELTA_FROM_6).map(Number).sort((a, b) => a - b);
  const nearest = known.reduce((a, b) =>
    Math.abs(b - numDecks) < Math.abs(a - numDecks) ? b : a
  );
  return DECK_DELTA_FROM_6[nearest];
}

export function calculateHouseEdge(rules: RuleSet): number {
  let edge = BASELINE_EDGE_PCT;

  edge += deckDelta(rules.numDecks) - deckDelta(BASELINE.numDecks);

  if (rules.dealerHitsSoft17 !== BASELINE.dealerHitsSoft17) {
    edge += rules.dealerHitsSoft17 ? 0.22 : -0.22;
  }

  if (rules.doubleAfterSplit !== BASELINE.doubleAfterSplit) {
    edge += rules.doubleAfterSplit ? -0.14 : 0.14;
  }

  if (rules.surrenderAllowed !== BASELINE.surrenderAllowed) {
    edge += rules.surrenderAllowed ? -0.08 : 0.08;
  }

  if (rules.blackjackPayout !== BASELINE.blackjackPayout) {
    edge += rules.blackjackPayout === '6:5' ? 1.39 : -1.39;
  }

  // Penetration (shoe depth before reshuffle) has no effect on basic-strategy EV —
  // it only matters for card-counting, which is out of scope for this build. Not
  // modeled here on purpose, not an oversight.

  return Math.round(edge * 1000) / 1000;
}
