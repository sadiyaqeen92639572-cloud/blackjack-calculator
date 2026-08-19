export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'A';
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

// Dealer upcards use the same 10-wide axis as ranks (10/J/Q/K collapse to '10').
export type DealerUpcard = Rank;

export type Action = 'H' | 'S' | 'D' | 'P' | 'R';
// H=hit, S=stand, D=double (falls back to H if double not allowed by caller),
// P=split, R=surrender (falls back to H if surrender not allowed by ruleset)

export interface BlackjackPayout {
  ratio: '3:2' | '6:5';
}

export interface RuleSet {
  numDecks: number;
  dealerHitsSoft17: boolean;
  doubleAfterSplit: boolean;
  surrenderAllowed: boolean; // late surrender
  resplitAllowed: boolean;
  maxSplitHands: number;
  blackjackPayout: '3:2' | '6:5';
  penetration: number; // fraction of shoe dealt before reshuffle — irrelevant to
  // basic-strategy EV (no memory effect), kept for card-counting features out of
  // this build's scope and for display on /rules/[variant]/ pages.
}

export interface RulePreset extends RuleSet {
  slug: string;
  label: string;
  // Real, hand-written per-variant content — not a templated paragraph with the
  // ruleset swapped in. See build plan's /rules/[variant]/ note on pSEO thin-content
  // risk.
  intro: string;
  whyItMatters: string;
}

// A player hand for strategy lookup: either a hard total, a soft total (ace + kicker),
// or an unsplit pair — the three axes of the canonical basic-strategy chart.
export type PlayerHandSpec =
  | { kind: 'hard'; total: number }
  | { kind: 'soft'; total: number } // total includes the ace counted as 11 (13-20)
  | { kind: 'pair'; rank: Rank };

export interface Card {
  rank: Rank;
}
