import { RANKS } from './types';
import type { Action, DealerUpcard, PlayerHandSpec, Rank, RuleSet } from './types';

// Canonical S17/DAS multi-deck (4-8 deck) basic strategy — the widely published
// reference chart (Wizard of Odds, Blackjack Apprenticeship, etc. all agree on these
// cells for this exact rule combination). Column order matches RANKS:
// ['2','3','4','5','6','7','8','9','10','A'].
//
// 'Ds' = double if allowed, else stand. 'Rh' = surrender if allowed, else hit.
// 'Ph' = split if DAS allowed, else hit (4,4 only — splitting 4s without DAS is worse
// than hitting).

type Row = Action[]; // one cell per dealer upcard, indexed same as RANKS

// --- Hard totals, keyed by player total 5-21 ---
// Totals 5-8 and 17-21 aren't listed (always Hit / always Stand respectively) —
// handled by range checks in basicStrategyAction below.
const HARD_TABLE: Record<number, Row> = {
  9: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'],
  12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'R', 'H'], // R = surrender vs 10
  16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'R', 'R', 'R'], // R = surrender vs 9,10,A
};

// --- Soft totals, keyed by total with ace counted as 11 (13-20) ---
// Soft 21 (blackjack) isn't a decision hand.
const SOFT_TABLE: Record<number, Row> = {
  13: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,2
  14: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,3
  15: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,4
  16: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,5
  17: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,6
  18: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'], // A,7
  19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,8
  20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,9
};

// --- Pairs, keyed by rank ---
const PAIR_TABLE: Record<Rank, Row> = {
  '2': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '3': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '4': ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // Ph vs 5,6 — needs DAS
  '5': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'], // never split — treat as hard 10
  '6': ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  '7': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '8': ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // always split
  '9': ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
  '10': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // never split
  A: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // always split
};

function upcardIndex(upcard: DealerUpcard): number {
  return RANKS.indexOf(upcard);
}

// Resolves a raw chart cell against the actual ruleset — the source tables above
// encode the *ideal* action; this applies the real-world fallbacks (no DAS → hit
// instead of split on 4,4; no surrender → hit instead of surrender).
function resolveCell(raw: Action, hand: PlayerHandSpec, rules: RuleSet): Action {
  if (raw === 'P' && hand.kind === 'pair' && hand.rank === '4' && !rules.doubleAfterSplit) {
    return 'H';
  }
  return raw;
}

export function basicStrategyAction(
  hand: PlayerHandSpec,
  dealerUpcard: DealerUpcard,
  rules: RuleSet
): Action {
  const col = upcardIndex(dealerUpcard);

  if (hand.kind === 'pair') {
    const raw = PAIR_TABLE[hand.rank][col];
    return resolveCell(raw, hand, rules);
  }

  if (hand.kind === 'soft') {
    if (hand.total <= 17) return SOFT_TABLE[Math.max(hand.total, 13)][col] ?? 'H';
    if (hand.total >= 19) return 'S';
    return SOFT_TABLE[hand.total][col];
  }

  // hard
  if (hand.total <= 8) return 'H';
  if (hand.total >= 17) return 'S';
  const raw = HARD_TABLE[hand.total][col];
  if (raw === 'R') {
    return rules.surrenderAllowed ? 'R' : 'H';
  }
  return raw;
}

// Per-action dollar EV (not just the recommended action) is deliberately NOT computed
// here — an exact per-cell EV requires full combinatorial (or large-N Monte Carlo)
// analysis per hand/upcard/ruleset, not a lookup table. simulator.ts's
// simulateSession() is this engine's source of real, verified EV figures (aggregate,
// not per-cell); a per-cell EV display is a possible future addition once that need
// is validated, not part of this build.
export function actionLabel(action: Action): string {
  switch (action) {
    case 'H':
      return 'Hit';
    case 'S':
      return 'Stand';
    case 'D':
      return 'Double Down';
    case 'P':
      return 'Split';
    case 'R':
      return 'Surrender';
  }
}
