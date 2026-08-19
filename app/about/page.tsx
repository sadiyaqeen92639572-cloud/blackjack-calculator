import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, GESMINE_ORG } from '@/lib/seo';

const PATH = '/about/';
const TITLE = `About ${SITE_NAME}`;
const DESCRIPTION = `Who runs ${SITE_NAME}, how its math is built and tested, and why every calculator here is deterministic arithmetic — no AI, no real-money wagering.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE_URL}${PATH}`,
    name: TITLE,
    publisher: GESMINE_ORG,
  };

  return (
    <div className="max-w-2xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-3xl font-bold mb-3">{TITLE}</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8">
        Standalone, manual-entry blackjack math tools — what they are, how the math is
        built and checked, and what this site deliberately doesn&apos;t do.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">What this site is</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {SITE_NAME} is a set of calculators for basic-strategy decisions, house edge,
          payout math, and full session simulation across common table rule sets. You
          enter your own hand, rules, and bet sizes; the calculator does the
          arithmetic. There is no live-table connection, no screen-scraping, no
          automation, and no real-money wagering of any kind — every result requires
          you to type in the inputs yourself.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">How the math is built and checked</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          The basic-strategy engine, house-edge model, payout math, and session
          simulator are table-driven and verified with three layers of automated
          tests before any calculator ships: exact cell-for-cell parity against an
          independently published basic-strategy chart, relational checks confirming
          each rule moves the house edge in the correct direction and magnitude, and a
          multi-million-hand Monte Carlo convergence check confirming the simulator's
          realized edge lands within tolerance of the theoretical house edge. Every
          number on this site is deterministic arithmetic given its inputs — not a
          model, not an estimate dressed up as one.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">What this site deliberately avoids</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          No &quot;AI&quot; framing anywhere on this site, because that language implies
          live or automated table assistance, which this is not. No real-money-site
          connection of any kind, no card-counting deck-tracking trainer, and no
          casino or affiliate link that isn&apos;t clearly labeled and matched to the
          visitor's own licensed jurisdiction — see{' '}
          <a href="/responsible-gambling/" className="underline">
            Responsible Gambling
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Who runs this site</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {SITE_NAME} is operated by Gesmine-Invest Limited (UK Company No. 14120136),
          registered at Hardy House, 269 Poynders Gardens, London, SW4 8PQ.
        </p>
      </section>

      <p style={{ color: 'var(--text-muted)' }} className="mt-10 text-sm">
        Want to see the math in action?{' '}
        <a href="/blackjack-calculator/" className="underline font-medium">
          Try the calculator
        </a>
        .
      </p>
    </div>
  );
}
