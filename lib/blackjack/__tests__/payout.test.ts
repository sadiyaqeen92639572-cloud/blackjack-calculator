import { describe, it, expect } from 'vitest';
import { calculatePayout } from '../payout';
import { DEFAULT_RULES } from '../rules';

describe('calculatePayout', () => {
  it('pays 3:2 on blackjack', () => {
    expect(calculatePayout(25, 'blackjack', { ...DEFAULT_RULES, blackjackPayout: '3:2' })).toBe(37.5);
    expect(calculatePayout(10, 'blackjack', { ...DEFAULT_RULES, blackjackPayout: '3:2' })).toBe(15);
  });

  it('pays 6:5 on blackjack', () => {
    expect(calculatePayout(25, 'blackjack', { ...DEFAULT_RULES, blackjackPayout: '6:5' })).toBe(30);
    expect(calculatePayout(10, 'blackjack', { ...DEFAULT_RULES, blackjackPayout: '6:5' })).toBe(12);
  });

  it('pays 1:1 on a regular win', () => {
    expect(calculatePayout(50, 'win', DEFAULT_RULES)).toBe(50);
  });

  it('returns 0 profit on a push', () => {
    expect(calculatePayout(50, 'push', DEFAULT_RULES)).toBe(0);
  });

  it('loses the full bet on a loss', () => {
    expect(calculatePayout(50, 'loss', DEFAULT_RULES)).toBe(-50);
  });

  it('pays insurance 2:1 on a side bet capped at half the original bet', () => {
    // $50 bet -> $25 side bet -> 2:1 -> $50 profit
    expect(calculatePayout(50, 'insurance-win', DEFAULT_RULES)).toBe(50);
  });

  it('loses the insurance side bet (half the original bet) on insurance-loss', () => {
    expect(calculatePayout(50, 'insurance-loss', DEFAULT_RULES)).toBe(-25);
  });
});
