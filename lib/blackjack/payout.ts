import type { RuleSet } from './types';

export type HandOutcome = 'blackjack' | 'win' | 'push' | 'loss' | 'insurance-win' | 'insurance-loss';

export function calculatePayout(bet: number, outcome: HandOutcome, rules: RuleSet): number {
  switch (outcome) {
    case 'blackjack': {
      const ratio = rules.blackjackPayout === '3:2' ? 1.5 : 1.2; // 6:5
      return bet * ratio;
    }
    case 'win':
      return bet;
    case 'push':
      return 0;
    case 'loss':
      return -bet;
    case 'insurance-win':
      // Insurance pays 2:1 on a side bet capped at half the original bet.
      return bet * 0.5 * 2;
    case 'insurance-loss':
      return -(bet * 0.5);
  }
}
