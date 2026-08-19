import { describe, it, expect } from 'vitest';
import { basicStrategyAction } from '../strategy';
import { DEFAULT_RULES } from '../rules';
import type { RuleSet } from '../types';

// L1 — chart parity against the standard published S17/DAS multi-deck basic strategy
// chart (Wizard of Odds, Blackjack Apprenticeship). These specific cells were
// cross-checked this session against Wizard of Odds's own text-form strategy summary
// (surrender thresholds, hard-9/10/11 double ranges, split rules) as an independent
// confirmation — not merely re-asserting the same table the engine was built from.

const S17_DAS: RuleSet = { ...DEFAULT_RULES, surrenderAllowed: true };

describe('L1 — hard totals', () => {
  it('always hits 8 or less', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 8 }, '6', S17_DAS)).toBe('H');
    expect(basicStrategyAction({ kind: 'hard', total: 5 }, 'A', S17_DAS)).toBe('H');
  });

  it('always stands 17+', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 17 }, 'A', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'hard', total: 20 }, '6', S17_DAS)).toBe('S');
  });

  it('doubles hard 9 only vs dealer 3-6', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 9 }, '2', S17_DAS)).toBe('H');
    expect(basicStrategyAction({ kind: 'hard', total: 9 }, '3', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'hard', total: 9 }, '6', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'hard', total: 9 }, '7', S17_DAS)).toBe('H');
  });

  it('doubles hard 10 vs 2-9, hits vs 10/A', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 10 }, '9', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'hard', total: 10 }, '10', S17_DAS)).toBe('H');
    expect(basicStrategyAction({ kind: 'hard', total: 10 }, 'A', S17_DAS)).toBe('H');
  });

  it('doubles hard 11 vs everything except A', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 11 }, '10', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'hard', total: 11 }, 'A', S17_DAS)).toBe('H');
  });

  it('hard 12 stands only vs 4-6', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 12 }, '3', S17_DAS)).toBe('H');
    expect(basicStrategyAction({ kind: 'hard', total: 12 }, '4', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'hard', total: 12 }, '6', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'hard', total: 12 }, '7', S17_DAS)).toBe('H');
  });

  it('hard 13-16 stand vs 2-6, hit vs 7+', () => {
    for (const total of [13, 14, 15, 16]) {
      expect(basicStrategyAction({ kind: 'hard', total }, '2', S17_DAS)).toBe('S');
      expect(basicStrategyAction({ kind: 'hard', total }, '6', S17_DAS)).toBe('S');
      expect(basicStrategyAction({ kind: 'hard', total }, '8', S17_DAS)).toBe('H');
    }
  });

  it('surrenders 15 vs 10, 16 vs 9/10/A when allowed — falls back to hit otherwise', () => {
    expect(basicStrategyAction({ kind: 'hard', total: 15 }, '10', S17_DAS)).toBe('R');
    expect(basicStrategyAction({ kind: 'hard', total: 16 }, '9', S17_DAS)).toBe('R');
    expect(basicStrategyAction({ kind: 'hard', total: 16 }, 'A', S17_DAS)).toBe('R');
    expect(basicStrategyAction({ kind: 'hard', total: 16 }, '9', DEFAULT_RULES)).toBe('H');
  });
});

describe('L1 — soft totals', () => {
  it('always hits soft 17 or less', () => {
    expect(basicStrategyAction({ kind: 'soft', total: 13 }, '2', S17_DAS)).toBe('H');
    expect(basicStrategyAction({ kind: 'soft', total: 17 }, '7', S17_DAS)).toBe('H');
  });

  it('always stands soft 19+', () => {
    expect(basicStrategyAction({ kind: 'soft', total: 19 }, '6', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'soft', total: 20 }, '6', S17_DAS)).toBe('S');
  });

  it('doubles soft 13/14 only vs 5-6', () => {
    expect(basicStrategyAction({ kind: 'soft', total: 13 }, '5', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'soft', total: 13 }, '4', S17_DAS)).toBe('H');
  });

  it('soft 18 has the 2/7/8 stand exception', () => {
    expect(basicStrategyAction({ kind: 'soft', total: 18 }, '2', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'soft', total: 18 }, '3', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'soft', total: 18 }, '7', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'soft', total: 18 }, '9', S17_DAS)).toBe('H');
  });
});

describe('L1 — pairs', () => {
  it('always splits aces and 8s', () => {
    for (const upcard of ['2', '7', '10', 'A'] as const) {
      expect(basicStrategyAction({ kind: 'pair', rank: 'A' }, upcard, S17_DAS)).toBe('P');
      expect(basicStrategyAction({ kind: 'pair', rank: '8' }, upcard, S17_DAS)).toBe('P');
    }
  });

  it('never splits 5s or 10s — treated as hard totals', () => {
    expect(basicStrategyAction({ kind: 'pair', rank: '5' }, '6', S17_DAS)).toBe('D');
    expect(basicStrategyAction({ kind: 'pair', rank: '10' }, '6', S17_DAS)).toBe('S');
  });

  it('splits 4,4 only with DAS, vs 5-6', () => {
    expect(basicStrategyAction({ kind: 'pair', rank: '4' }, '5', S17_DAS)).toBe('P');
    expect(basicStrategyAction({ kind: 'pair', rank: '4' }, '5', DEFAULT_RULES)).toBe('P');
    expect(
      basicStrategyAction({ kind: 'pair', rank: '4' }, '5', { ...S17_DAS, doubleAfterSplit: false })
    ).toBe('H');
  });

  it('splits 9,9 vs 2-6 and 8-9, stands vs 7/10/A', () => {
    expect(basicStrategyAction({ kind: 'pair', rank: '9' }, '6', S17_DAS)).toBe('P');
    expect(basicStrategyAction({ kind: 'pair', rank: '9' }, '7', S17_DAS)).toBe('S');
    expect(basicStrategyAction({ kind: 'pair', rank: '9' }, '9', S17_DAS)).toBe('P');
    expect(basicStrategyAction({ kind: 'pair', rank: '9' }, '10', S17_DAS)).toBe('S');
  });
});
