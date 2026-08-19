import { RANKS } from './types';
import type { Card, PlayerHandSpec, Rank } from './types';

// Card counting values per rank in a real 52-card deck: ranks 2-9 appear 4x each,
// '10' represents four distinct card faces (10, J, Q, K) so it appears 16x per deck.
export const RANK_WEIGHT: Record<Rank, number> = {
  '2': 4, '3': 4, '4': 4, '5': 4, '6': 4, '7': 4, '8': 4, '9': 4, '10': 16, A: 4,
};

export function buildShoe(numDecks: number): Rank[] {
  const shoe: Rank[] = [];
  for (let d = 0; d < numDecks; d++) {
    for (const rank of RANKS) {
      for (let i = 0; i < RANK_WEIGHT[rank]; i++) shoe.push(rank);
    }
  }
  return shoe;
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function rankValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (rank === '10') return 10;
  return Number(rank);
}

// Computes total + softness for an arbitrary set of ranks, correctly demoting aces
// from 11 to 1 to avoid busting (standard blackjack hand-value rule).
export function handTotal(ranks: Rank[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const r of ranks) {
    total += rankValue(r);
    if (r === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10; // demote one ace from 11 to 1
    aces--;
  }
  const soft = aces > 0 && total <= 21;
  return { total, soft };
}

export function isBlackjack(ranks: Rank[]): boolean {
  return ranks.length === 2 && handTotal(ranks).total === 21;
}

export function toCards(ranks: Rank[]): Card[] {
  return ranks.map((rank) => ({ rank }));
}

// Shared by the calculator UI (two picked ranks) and the simulator (a freshly dealt
// starting hand) — the single source of truth for "what is this two-card hand" as a
// PlayerHandSpec for strategy lookup.
export function handSpecFromTwoCards(a: Rank, b: Rank): PlayerHandSpec {
  if (a === b) return { kind: 'pair', rank: a };
  const { total, soft } = handTotal([a, b]);
  return soft ? { kind: 'soft', total } : { kind: 'hard', total };
}
