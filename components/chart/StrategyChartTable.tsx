'use client';

import { buildStrategyChart } from '@/lib/blackjack/chart';
import { RANKS } from '@/lib/blackjack/types';
import type { DealerUpcard, PlayerHandSpec, RuleSet } from '@/lib/blackjack/types';
import { actionLabel } from '@/lib/blackjack/strategy';

const ACTION_BG: Record<string, string> = {
  H: '#2a3a30',
  S: '#1d4d33',
  D: '#4d3d12',
  P: '#123a55',
  R: '#4d1f1c',
};

function rowLabelFor(hand: PlayerHandSpec): string | null {
  if (hand.kind === 'hard') return String(hand.total);
  if (hand.kind === 'soft') return `A,${hand.total - 11}`;
  return `${hand.rank},${hand.rank}`;
}

export function StrategyChartTable({
  rules,
  highlight,
}: {
  rules: RuleSet;
  highlight?: { hand: PlayerHandSpec; dealerUpcard: DealerUpcard };
}) {
  const chart = buildStrategyChart(rules);
  const highlightRow = highlight ? rowLabelFor(highlight.hand) : null;
  const highlightCol = highlight ? RANKS.indexOf(highlight.dealerUpcard) : -1;

  const section = (title: string, rows: typeof chart.hard) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse w-full min-w-[560px]">
          <thead>
            <tr>
              <th className="p-2 text-left" style={{ color: 'var(--text-muted)' }}>
                Hand
              </th>
              {RANKS.map((r) => (
                <th key={r} className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td
                  className="p-2 font-medium border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {row.label}
                </td>
                {row.cells.map((action, i) => {
                  const isHighlighted = row.label === highlightRow && i === highlightCol;
                  return (
                    <td
                      key={i}
                      title={actionLabel(action)}
                      className="p-2 text-center border font-semibold"
                      style={{
                        borderColor: isHighlighted ? 'var(--accent)' : 'var(--border)',
                        borderWidth: isHighlighted ? 2 : 1,
                        background: ACTION_BG[action],
                      }}
                    >
                      {action}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      {section('Hard Totals', chart.hard)}
      {section('Soft Totals', chart.soft)}
      {section('Pairs', chart.pairs)}
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        H = Hit, S = Stand, D = Double, P = Split, R = Surrender (falls back to Hit if
        surrender isn't allowed under the selected rules).
      </p>
    </div>
  );
}
