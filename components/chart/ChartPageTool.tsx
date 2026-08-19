'use client';

import { useState } from 'react';
import { DEFAULT_RULES, RULE_PRESETS } from '@/lib/blackjack/rules';
import type { RuleSet } from '@/lib/blackjack/types';
import { StrategyChartTable } from './StrategyChartTable';

export function ChartPageTool() {
  const [rules, setRules] = useState<RuleSet>(DEFAULT_RULES);

  return (
    <div>
      <label className="text-sm block mb-6 max-w-xs">
        Rule set
        <select
          className="mt-1 w-full rounded-md bg-transparent border p-2"
          style={{ borderColor: 'var(--border)' }}
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
      <StrategyChartTable rules={rules} />
    </div>
  );
}
