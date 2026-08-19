'use client';

import { useState } from 'react';
import { calculateHouseEdge } from '@/lib/blackjack/houseEdge';
import { DEFAULT_RULES } from '@/lib/blackjack/rules';
import type { RuleSet } from '@/lib/blackjack/types';

const DECK_OPTIONS = [1, 2, 4, 6, 8];

export function HouseEdgeTool() {
  const [rules, setRules] = useState<RuleSet>(DEFAULT_RULES);
  const edge = calculateHouseEdge(rules);

  return (
    <div className="surface p-5 sm:p-6">
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <label className="text-sm">
          Number of decks
          <select
            className="mt-1 w-full rounded-md bg-transparent border p-2"
            style={{ borderColor: 'var(--border)' }}
            value={rules.numDecks}
            onChange={(e) => setRules((r) => ({ ...r, numDecks: Number(e.target.value) }))}
          >
            {DECK_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d} deck{d > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Blackjack payout
          <select
            className="mt-1 w-full rounded-md bg-transparent border p-2"
            style={{ borderColor: 'var(--border)' }}
            value={rules.blackjackPayout}
            onChange={(e) =>
              setRules((r) => ({ ...r, blackjackPayout: e.target.value as '3:2' | '6:5' }))
            }
          >
            <option value="3:2">3:2 (standard)</option>
            <option value="6:5">6:5 (avoid)</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 text-sm">
        <Toggle
          label="Dealer hits soft 17"
          checked={rules.dealerHitsSoft17}
          onChange={(v) => setRules((r) => ({ ...r, dealerHitsSoft17: v }))}
        />
        <Toggle
          label="Double after split"
          checked={rules.doubleAfterSplit}
          onChange={(v) => setRules((r) => ({ ...r, doubleAfterSplit: v }))}
        />
        <Toggle
          label="Late surrender"
          checked={rules.surrenderAllowed}
          onChange={(v) => setRules((r) => ({ ...r, surrenderAllowed: v }))}
        />
      </div>

      <div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          House edge for this exact rule set
        </div>
        <div className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>
          {edge}%
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 surface px-3 py-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
