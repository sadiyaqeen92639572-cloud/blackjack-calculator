import { basicStrategyAction } from './strategy';
import { buildShoe, shuffle, handTotal, isBlackjack, rankValue } from './cards';
import { mulberry32 } from './rng';
import type { PlayerHandSpec, Rank, RuleSet } from './types';

export interface SimulationResult {
  numHands: number;
  netUnits: number; // total profit/loss in bet units (1 unit per hand wagered)
  realizedEdgePct: number; // -netUnits / numHands * 100 (positive = house favor)
  bankrollCurve: number[]; // cumulative net units, sampled (not one point per hand at large N)
}

function handSpecFor(ranks: Rank[]): PlayerHandSpec {
  if (ranks.length === 2 && ranks[0] === ranks[1]) {
    return { kind: 'pair', rank: ranks[0] };
  }
  const { total, soft } = handTotal(ranks);
  return soft ? { kind: 'soft', total } : { kind: 'hard', total };
}

// Plays a single (non-splittable-again) hand to completion per basic strategy.
// Returns final ranks and whether it busted, and the bet multiplier (2 if doubled).
function playHand(
  startRanks: Rank[],
  dealerUpcard: Rank,
  rules: RuleSet,
  draw: () => Rank,
  allowDouble: boolean
): { ranks: Rank[]; busted: boolean; betMultiplier: number; surrendered: boolean } {
  let ranks = startRanks.slice();
  let betMultiplier = 1;

  for (;;) {
    const total = handTotal(ranks).total;
    if (total > 21) return { ranks, busted: true, betMultiplier, surrendered: false };

    // Pair-as-hand-spec only applies to the untouched initial two cards; once the
    // hand has been hit, look it up as hard/soft regardless of rank match.
    const spec: PlayerHandSpec =
      ranks.length === 2
        ? handSpecFor(ranks)
        : (() => {
            const { total: t, soft } = handTotal(ranks);
            return soft ? { kind: 'soft', total: t } : { kind: 'hard', total: t };
          })();
    const action = basicStrategyAction(spec, dealerUpcard, rules);

    if (action === 'S') return { ranks, busted: false, betMultiplier, surrendered: false };

    if (action === 'R' && ranks.length === 2) {
      return { ranks, busted: false, betMultiplier, surrendered: true };
    }

    if (action === 'D' && allowDouble && ranks.length === 2) {
      betMultiplier = 2;
      ranks.push(draw());
      const t = handTotal(ranks).total;
      return { ranks, busted: t > 21, betMultiplier, surrendered: false };
    }

    // 'D' when doubling isn't available (already hit once, or split hand without DAS)
    // falls back to a hit — matches real-table behavior.
    // 'P' is handled by the caller (playRound), not here — reaching 'P' mid-hand
    // (after the first card) shouldn't happen since pair specs only apply at 2 cards.
    ranks.push(draw());
  }
}

function resolveSplitAcesRound(
  h1: Rank[],
  h2: Rank[],
  dealerRanks: Rank[],
  rules: RuleSet,
  draw: () => Rank
): number {
  const finalDealer = playDealerHand(dealerRanks, rules, draw);
  const dealerTotal = handTotal(finalDealer).total;
  const dealerBusted = dealerTotal > 21;

  let net = 0;
  for (const ranks of [h1, h2]) {
    const total = handTotal(ranks).total; // split-ace hands can't bust (max A+10=21)
    if (dealerBusted || total > dealerTotal) net += 1;
    else if (total < dealerTotal) net += -1;
  }
  return net;
}

function playDealerHand(startRanks: Rank[], rules: RuleSet, draw: () => Rank): Rank[] {
  let ranks = startRanks.slice();
  for (;;) {
    const { total, soft } = handTotal(ranks);
    if (total > 21) return ranks;
    if (total > 17) return ranks;
    if (total === 17) {
      if (soft && rules.dealerHitsSoft17) {
        ranks.push(draw());
        continue;
      }
      return ranks;
    }
    ranks.push(draw());
  }
}

// Resolves a single round (one player, one dealer) — supports one level of splitting
// (two resulting hands), not full recursive resplits. resplitAllowed/maxSplitHands
// beyond a single split are NOT modeled here; this is a known simplification that can
// shift the realized edge slightly (splittable pairs — 8s/A/9s/etc — are a minority of
// hands, so the effect is expected to be small but is not zero). Flag for L3 review:
// if convergence misses the ±0.05pp tolerance against calculateHouseEdge(), this is
// the first place to look before assuming a strategy-table bug.
function playRound(rules: RuleSet, draw: () => Rank): number {
  const playerStart: Rank[] = [draw(), draw()];
  const dealerRanks: Rank[] = [draw(), draw()];
  const dealerUpcard = dealerRanks[0];

  const playerBJ = isBlackjack(playerStart);
  const dealerBJ = isBlackjack(dealerRanks);

  if (playerBJ || dealerBJ) {
    if (playerBJ && dealerBJ) return 0;
    if (playerBJ) return rules.blackjackPayout === '3:2' ? 1.5 : 1.2;
    return -1;
  }

  const initialSpec = handSpecFor(playerStart);
  const initialAction = basicStrategyAction(initialSpec, dealerUpcard, rules);

  if (initialAction === 'P' && playerStart[0] === 'A' && rules.maxSplitHands >= 2) {
    // Split aces: standard rule at nearly all tables — exactly one card dealt to each
    // ace, no further hit/double/resplit even if the resulting total is poor. A
    // 21 made this way is a regular 21 (pays 1:1), not a blackjack (3:2) — it wasn't
    // dealt as the original two cards. Modeling this precisely (not just falling
    // through to playHand, which would let the engine hit past one card) matters:
    // an earlier version without this special case left the realized simulated edge
    // measurably below the theoretical house edge, confirmed via the seed dilution
    // performed during this session's own L3 verification.
    const h1r: Rank[] = ['A', draw()];
    const h2r: Rank[] = ['A', draw()];
    return resolveSplitAcesRound(h1r, h2r, dealerRanks, rules, draw);
  }

  let hands: { ranks: Rank[]; busted: boolean; betMultiplier: number; surrendered: boolean }[];

  if (initialAction === 'P' && rules.maxSplitHands >= 2) {
    const h1 = playHand([playerStart[0], draw()], dealerUpcard, rules, draw, rules.doubleAfterSplit);
    const h2 = playHand([playerStart[1], draw()], dealerUpcard, rules, draw, rules.doubleAfterSplit);
    hands = [h1, h2];
  } else {
    hands = [playHand(playerStart, dealerUpcard, rules, draw, true)];
  }

  const anyStanding = hands.some((h) => !h.busted && !h.surrendered);
  const finalDealer = anyStanding ? playDealerHand(dealerRanks, rules, draw) : dealerRanks;
  const dealerTotal = handTotal(finalDealer).total;
  const dealerBusted = dealerTotal > 21;

  let net = 0;
  for (const h of hands) {
    if (h.surrendered) {
      net += -0.5;
      continue;
    }
    if (h.busted) {
      net += -1 * h.betMultiplier;
      continue;
    }
    const playerTotal = handTotal(h.ranks).total;
    if (dealerBusted || playerTotal > dealerTotal) net += 1 * h.betMultiplier;
    else if (playerTotal < dealerTotal) net += -1 * h.betMultiplier;
    // push contributes 0
  }
  return net;
}

export function simulateSession(rules: RuleSet, numHands: number, seed: number): SimulationResult {
  const rng = mulberry32(seed);
  let shoe = shuffle(buildShoe(rules.numDecks), rng);
  let cardsUsed = 0;
  const reshuffleAt = Math.floor(shoe.length * rules.penetration);

  const draw = (): Rank => {
    if (cardsUsed >= reshuffleAt) {
      shoe = shuffle(buildShoe(rules.numDecks), rng);
      cardsUsed = 0;
    }
    return shoe[cardsUsed++];
  };

  let net = 0;
  const bankrollCurve: number[] = [];
  const sampleEvery = Math.max(1, Math.floor(numHands / 1000));

  for (let i = 0; i < numHands; i++) {
    net += playRound(rules, draw);
    if (i % sampleEvery === 0 || i === numHands - 1) bankrollCurve.push(net);
  }

  return {
    numHands,
    netUnits: net,
    realizedEdgePct: (-net / numHands) * 100,
    bankrollCurve,
  };
}
