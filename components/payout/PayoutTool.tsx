'use client';

import { useState } from 'react';
import { calculatePayout } from '@/lib/blackjack/payout';
import type { HandOutcome } from '@/lib/blackjack/payout';
import { DEFAULT_RULES } from '@/lib/blackjack/rules';

const OUTCOMES: { value: HandOutcome; label: string }[] = [
  { value: 'blackjack', label: 'Blackjack (natural 21)' },
  { value: 'win', label: 'Regular win' },
  { value: 'push', label: 'Push (tie)' },
  { value: 'loss', label: 'Loss' },
  { value: 'insurance-win', label: 'Insurance bet wins' },
  { value: 'insurance-loss', label: 'Insurance bet loses' },
];

const COMPARE_BETS = [10, 25, 50, 100, 500];

export function PayoutTool() {
  const [bet, setBet] = useState(25);
  const [outcome, setOutcome] = useState<HandOutcome>('blackjack');
  const [payout, setPayout] = useState<'3:2' | '6:5'>('3:2');

  const result = calculatePayout(bet, outcome, { ...DEFAULT_RULES, blackjackPayout: payout });

  return (
    <div>
      <div className="surface p-5 sm:p-6 mb-8">
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <label className="text-sm">
            Bet size ($)
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-md bg-transparent border p-2"
              style={{ borderColor: 'var(--border)' }}
              value={bet}
              onChange={(e) => setBet(Math.max(1, Number(e.target.value) || 0))}
            />
          </label>
          <label className="text-sm">
            Outcome
            <select
              className="mt-1 w-full rounded-md bg-transparent border p-2"
              style={{ borderColor: 'var(--border)' }}
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as HandOutcome)}
            >
              {OUTCOMES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Blackjack payout ratio
            <select
              className="mt-1 w-full rounded-md bg-transparent border p-2"
              style={{ borderColor: 'var(--border)' }}
              value={payout}
              onChange={(e) => setPayout(e.target.value as '3:2' | '6:5')}
            >
              <option value="3:2">3:2 (standard)</option>
              <option value="6:5">6:5 (avoid)</option>
            </select>
          </label>
        </div>

        <div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            You {result >= 0 ? 'receive' : 'lose'}
          </div>
          <div
            className="text-4xl font-bold"
            style={{ color: result >= 0 ? 'var(--accent)' : 'var(--danger)' }}
          >
            {result >= 0 ? '+' : ''}
            {result.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">6:5 vs 3:2 Blackjack — The Real Cost</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        A 6:5 table isn't a small difference — it roughly quadruples the house edge on
        its own (see the{' '}
        <a href="/house-edge-calculator/" className="underline">
          house edge calculator
        </a>
        ). Here's exactly what a blackjack pays at common bet sizes under each ratio.
      </p>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse w-full min-w-[420px]">
          <thead>
            <tr>
              <th className="p-2 text-left" style={{ color: 'var(--text-muted)' }}>
                Bet
              </th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>
                3:2 payout
              </th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>
                6:5 payout
              </th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>
                You lose
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_BETS.map((b) => {
              const threeTwo = calculatePayout(b, 'blackjack', { ...DEFAULT_RULES, blackjackPayout: '3:2' });
              const sixFive = calculatePayout(b, 'blackjack', { ...DEFAULT_RULES, blackjackPayout: '6:5' });
              return (
                <tr key={b}>
                  <td className="p-2 border" style={{ borderColor: 'var(--border)' }}>
                    ${b}
                  </td>
                  <td className="p-2 text-right border" style={{ borderColor: 'var(--border)' }}>
                    +${threeTwo.toFixed(2)}
                  </td>
                  <td className="p-2 text-right border" style={{ borderColor: 'var(--border)' }}>
                    +${sixFive.toFixed(2)}
                  </td>
                  <td
                    className="p-2 text-right border font-semibold"
                    style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}
                  >
                    -${(threeTwo - sixFive).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
