import { describe, it, expect } from 'vitest';
import { calculateHouseEdge } from '../houseEdge';
import { DEFAULT_RULES } from '../rules';

// L2 — relational/composition sanity, NOT an absolute-value certification. Per
// houseEdge.ts's own header comment, the additive constants are sourced from
// published rule-variation tables but not yet independently re-verified cell-by-cell
// against a live authoritative source. These tests lock in the *direction* and
// *rough magnitude* of each rule's effect, which is a meaningful regression guard even
// before that final spot-check happens — an absolute-value assertion would give false
// confidence the numbers are final when they aren't.

describe('L2 — house edge rule-effect direction', () => {
  it('dealer hitting soft 17 increases house edge', () => {
    const s17 = calculateHouseEdge({ ...DEFAULT_RULES, dealerHitsSoft17: false });
    const h17 = calculateHouseEdge({ ...DEFAULT_RULES, dealerHitsSoft17: true });
    expect(h17).toBeGreaterThan(s17);
  });

  it('no double-after-split increases house edge', () => {
    const das = calculateHouseEdge({ ...DEFAULT_RULES, doubleAfterSplit: true });
    const noDas = calculateHouseEdge({ ...DEFAULT_RULES, doubleAfterSplit: false });
    expect(noDas).toBeGreaterThan(das);
  });

  it('surrender allowed decreases house edge', () => {
    const noSurrender = calculateHouseEdge({ ...DEFAULT_RULES, surrenderAllowed: false });
    const surrender = calculateHouseEdge({ ...DEFAULT_RULES, surrenderAllowed: true });
    expect(surrender).toBeLessThan(noSurrender);
  });

  it('6:5 blackjack payout is dramatically worse than 3:2', () => {
    const threeTwo = calculateHouseEdge({ ...DEFAULT_RULES, blackjackPayout: '3:2' });
    const sixFive = calculateHouseEdge({ ...DEFAULT_RULES, blackjackPayout: '6:5' });
    expect(sixFive - threeTwo).toBeGreaterThan(1.0); // published delta ≈1.39pp
  });

  it('fewer decks favor the player slightly', () => {
    const six = calculateHouseEdge({ ...DEFAULT_RULES, numDecks: 6 });
    const one = calculateHouseEdge({ ...DEFAULT_RULES, numDecks: 1 });
    expect(one).toBeLessThan(six);
  });

  it('standard 6-deck S17 DAS 3:2 baseline is in the well-known ~0.3-0.6% band', () => {
    const edge = calculateHouseEdge(DEFAULT_RULES);
    expect(edge).toBeGreaterThan(0.3);
    expect(edge).toBeLessThan(0.6);
  });
});
