'use client';

import { useState } from 'react';
import { basicStrategyAction, actionLabel } from '@/lib/blackjack/strategy';
import { handSpecFromTwoCards } from '@/lib/blackjack/cards';
import { DEFAULT_RULES, RULE_PRESETS } from '@/lib/blackjack/rules';
import { RANKS } from '@/lib/blackjack/types';
import type { DealerUpcard, Rank, RuleSet } from '@/lib/blackjack/types';
import { StrategyChartTable } from '@/components/chart/StrategyChartTable';

const ACTION_COLOR: Record<string, string> = {
  H: '#e2e8f0',
  S: '#2fae60',
  D: '#f0b429',
  P: '#5aa9ff',
  R: '#d9534f',
};

export function CalculatorTool({ initialPresetSlug }: { initialPresetSlug?: string }) {
  const [card1, setCard1] = useState<Rank>('10');
  const [card2, setCard2] = useState<Rank>('6');
  const [dealerUpcard, setDealerUpcard] = useState<DealerUpcard>('6');
  const initialPreset = initialPresetSlug
    ? RULE_PRESETS.find((p) => p.slug === initialPresetSlug)
    : undefined;
  const [rules, setRules] = useState<RuleSet>(initialPreset ?? DEFAULT_RULES);

  const hand = handSpecFromTwoCards(card1, card2);
  const action = basicStrategyAction(hand, dealerUpcard, rules);

  return (
    <div>
      <div className="surface p-5 sm:p-6 mb-8">
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <RankSelect label="Your card 1" value={card1} onChange={setCard1} />
          <RankSelect label="Your card 2" value={card2} onChange={setCard2} />
          <RankSelect label="Dealer upcard" value={dealerUpcard} onChange={setDealerUpcard} />
        </div>

        <label className="text-sm block mb-5">
          Rule preset
          <select
            className="mt-1 w-full sm:w-64 rounded-md bg-transparent border p-2"
            style={{ borderColor: 'var(--border)' }}
            defaultValue={initialPresetSlug ?? ''}
            onChange={(e) => {
              const preset = RULE_PRESETS.find((p) => p.slug === e.target.value);
              setRules(preset ?? DEFAULT_RULES);
            }}
          >
            <option value="">Standard (6D, S17, DAS)</option>
            {RULE_PRESETS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Optimal move
          </div>
          <div className="text-4xl font-bold" style={{ color: ACTION_COLOR[action] }}>
            {actionLabel(action)}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Full Strategy Chart For These Rules</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Generated live from the same engine as the decision above — not a static
        image, so it always matches your exact rule set.
      </p>
      <StrategyChartTable rules={rules} highlight={{ hand, dealerUpcard }} />
    </div>
  );
}

function RankSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Rank;
  onChange: (r: Rank) => void;
}) {
  return (
    <label className="text-sm">
      {label}
      <select
        className="mt-1 w-full rounded-md bg-transparent border p-2"
        style={{ borderColor: 'var(--border)' }}
        value={value}
        onChange={(e) => onChange(e.target.value as Rank)}
      >
        {RANKS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </label>
  );
}
