import type { Metadata } from 'next';
import Link from 'next/link';
import { RULE_PRESETS } from '@/lib/blackjack/rules';
import { calculateHouseEdge } from '@/lib/blackjack/houseEdge';
import { SITE_URL } from '@/lib/seo';

const TITLE = 'Blackjack Rule Variants — House Edge by Table Type';
const DESCRIPTION =
  'Compare common blackjack rule variants — Vegas Strip, Atlantic City, European, Single-Deck, Double-Deck — and their exact house edge under perfect basic strategy.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/rules/` },
};

export default function RulesIndexPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">Blackjack Rule Variants</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Every casino runs a different mix of rules. Pick a common table type below to
        see its exact house edge and what makes it different.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {RULE_PRESETS.map((p) => (
          <Link key={p.slug} href={`/rules/${p.slug}/`} className="surface p-5 block">
            <h2 className="font-semibold text-lg mb-1">{p.label}</h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              {p.numDecks} deck{p.numDecks > 1 ? 's' : ''} · {p.dealerHitsSoft17 ? 'H17' : 'S17'}
            </p>
            <p className="font-bold" style={{ color: 'var(--accent)' }}>
              {calculateHouseEdge(p)}% edge
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">How the house edge here is calculated</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Each variant's edge composes a baseline house edge with the published effect
          of every rule that differs from that baseline — deck count, dealer soft-17
          behavior, double after split, surrender, and blackjack payout ratio — the
          same engine that powers the{' '}
          <a href="/house-edge-calculator/" className="underline">
            house edge calculator
          </a>
          . Open any variant to see its exact rule set and try it in the{' '}
          <a href="/blackjack-calculator/" className="underline">
            calculator
          </a>
          .
        </p>
      </section>
    </div>
  );
}
