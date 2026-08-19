import { RANKS } from './types';
import { basicStrategyAction } from './strategy';
import type { Action, PlayerHandSpec, RuleSet } from './types';

export interface ChartRow {
  label: string;
  cells: Action[]; // one per RANKS entry
}

export interface StrategyChart {
  hard: ChartRow[];
  soft: ChartRow[];
  pairs: ChartRow[];
}

// Renders the full strategy matrix for a given RuleSet straight from strategy.ts —
// this is what makes /basic-strategy-chart/ and /blackjack-calculator/'s embedded
// chart dynamic (rule-set-aware) rather than a static image like competitors serve.
export function buildStrategyChart(rules: RuleSet): StrategyChart {
  const row = (label: string, hand: PlayerHandSpec): ChartRow => ({
    label,
    cells: RANKS.map((upcard) => basicStrategyAction(hand, upcard, rules)),
  });

  const hard = [];
  for (let total = 9; total <= 16; total++) {
    hard.push(row(String(total), { kind: 'hard', total }));
  }

  const soft = [];
  for (let total = 13; total <= 20; total++) {
    const kicker = total - 11;
    soft.push(row(`A,${kicker === 10 ? 'A' : kicker}`, { kind: 'soft', total }));
  }

  const pairs = RANKS.map((rank) => row(`${rank},${rank}`, { kind: 'pair', rank }));

  return { hard, soft, pairs };
}
