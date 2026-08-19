'use client';

import { useState, useTransition } from 'react';
import { simulateSession } from '@/lib/blackjack/simulator';
import { calculateHouseEdge } from '@/lib/blackjack/houseEdge';
import { DEFAULT_RULES, RULE_PRESETS } from '@/lib/blackjack/rules';
import type { RuleSet } from '@/lib/blackjack/types';
import { useBlackjackStore } from '@/store/blackjack-store';

const HAND_COUNT_OPTIONS = [1_000, 10_000, 100_000, 1_000_000];

export function SimulatorTool() {
  const [rules, setRules] = useState<RuleSet>(DEFAULT_RULES);
  const [numHands, setNumHands] = useState(100_000);
  const [result, setResult] = useState<ReturnType<typeof simulateSession> | null>(null);
  const [isPending, startTransition] = useTransition();
  const addRun = useBlackjackStore((s) => s.addRun);

  const theoretical = calculateHouseEdge(rules);

  function runSimulation() {
    startTransition(() => {
      const seed = Math.floor(Math.random() * 2 ** 31);
      const r = simulateSession(rules, numHands, seed);
      setResult(r);
      addRun({
        id: `${Date.now()}`,
        ranAt: Date.now(),
        numHands,
        realizedEdgePct: r.realizedEdgePct,
        ruleLabel: `${rules.numDecks}D ${rules.dealerHitsSoft17 ? 'H17' : 'S17'}`,
      });
    });
  }

  return (
    <div className="surface p-5 sm:p-6">
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <label className="text-sm">
          Rule preset
          <select
            className="mt-1 w-full rounded-md bg-transparent border p-2"
            style={{ borderColor: 'var(--border)' }}
            onChange={(e) => {
              const preset = RULE_PRESETS.find((p) => p.slug === e.target.value);
              if (preset) setRules(preset);
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
        <label className="text-sm">
          Hands to simulate
          <select
            className="mt-1 w-full rounded-md bg-transparent border p-2"
            style={{ borderColor: 'var(--border)' }}
            value={numHands}
            onChange={(e) => setNumHands(Number(e.target.value))}
          >
            {HAND_COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n.toLocaleString()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 text-sm">
        <RuleToggle
          label="Dealer H17"
          checked={rules.dealerHitsSoft17}
          onChange={(v) => setRules((r) => ({ ...r, dealerHitsSoft17: v }))}
        />
        <RuleToggle
          label="DAS"
          checked={rules.doubleAfterSplit}
          onChange={(v) => setRules((r) => ({ ...r, doubleAfterSplit: v }))}
        />
        <RuleToggle
          label="Surrender"
          checked={rules.surrenderAllowed}
          onChange={(v) => setRules((r) => ({ ...r, surrenderAllowed: v }))}
        />
        <RuleToggle
          label="6:5 payout"
          checked={rules.blackjackPayout === '6:5'}
          onChange={(v) => setRules((r) => ({ ...r, blackjackPayout: v ? '6:5' : '3:2' }))}
        />
      </div>

      <button className="btn-primary" onClick={runSimulation} disabled={isPending}>
        {isPending ? 'Simulating…' : `Simulate ${numHands.toLocaleString()} hands`}
      </button>

      <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
        Theoretical house edge for this rule set: <strong>{theoretical}%</strong>
      </p>

      {result && (
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Stat label="Hands played" value={result.numHands.toLocaleString()} />
          <Stat
            label="Net (bet units)"
            value={result.netUnits >= 0 ? `+${result.netUnits.toFixed(1)}` : result.netUnits.toFixed(1)}
          />
          <Stat label="Realized edge" value={`${result.realizedEdgePct.toFixed(3)}%`} />
        </div>
      )}
    </div>
  );
}

function RuleToggle({
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
