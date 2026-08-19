import type { Metadata } from 'next';
import { SimulatorTool } from '@/components/simulator/SimulatorTool';
import {
  SITE_URL,
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';

const PATH = '/blackjack-simulator/';
const TITLE = 'Blackjack Simulator — Play Thousands of Hands, See Your Real Odds';
const DESCRIPTION =
  'Free blackjack simulator. Set your own rules (decks, S17/H17, DAS, surrender, payout) and simulate up to 1,000,000 hands of basic-strategy play to see your realized edge vs the theoretical house edge.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, type: 'website' },
};

const FAQS = [
  {
    question: 'How does this blackjack simulator work?',
    answer:
      'It deals real shuffled shoes (respecting your chosen deck count and penetration), plays every hand using mathematically optimal basic strategy for your exact rule set, and tracks the running bankroll over as many hands as you choose — up to 1,000,000 per run.',
  },
  {
    question: 'Is this simulator based on real basic strategy?',
    answer:
      'Yes. Every decision (hit, stand, double, split, surrender) comes from the same rule-set-aware basic-strategy engine used by the calculator and the dynamically generated strategy chart, not a simplified approximation.',
  },
  {
    question: 'Why does my realized edge differ from the theoretical house edge?',
    answer:
      'Short sessions have real variance — a few thousand hands can easily run a percentage point or more above or below the true long-run edge purely by chance. Run more hands and the realized edge converges toward the theoretical value.',
  },
  {
    question: 'Does this simulator use real money?',
    answer: 'No. This is a free educational tool. It does not facilitate real-money wagering.',
  },
  {
    question: 'Can I change the casino rules I am testing?',
    answer:
      'Yes — pick a preset (Vegas Strip, Atlantic City, European, Single-Deck, Double-Deck) or toggle individual rules: dealer hits/stands on soft 17, double after split, late surrender, and 3:2 vs 6:5 blackjack payout.',
  },
];

export default function BlackjackSimulatorPage() {
  const appSchema = getSoftwareApplicationSchema('Blackjack Simulator', DESCRIPTION, `${SITE_URL}${PATH}`);
  const faqSchema = getFAQPageSchema(FAQS);
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Blackjack Simulator', url: `${SITE_URL}${PATH}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-3xl font-bold mb-3">Blackjack Simulator</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Set your rules, pick how many hands to play, and watch a full shoe-by-shoe
        basic-strategy session run out. See your net result and realized edge measured
        against the exact theoretical house edge for those rules.
      </p>

      <SimulatorTool />

      <section className="mt-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Why realized results vary from the house edge</h2>
        <p style={{ color: 'var(--text-muted)' }} className="mb-3">
          The house edge is a long-run average, not a per-session guarantee. Blackjack
          has real hand-to-hand variance — blackjacks, doubles, and splits all swing
          results — so a 1,000-hand run can land noticeably above or below the true
          edge. Simulating 100,000+ hands is the fastest way to see the theoretical
          number converge in front of you, without risking a single real dollar.
        </p>
      </section>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">How this simulator is built</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Each run builds and shuffles a real multi-deck shoe (respecting your chosen
          deck count and penetration), deals every hand card by card, and plays it out
          with the same rule-set-aware basic-strategy engine that drives the{' '}
          <a href="/blackjack-calculator/" className="underline">
            calculator
          </a>{' '}
          and{' '}
          <a href="/basic-strategy-chart/" className="underline">
            strategy chart
          </a>
          , including the standard casino rule that a split-ace hand gets exactly one
          card and then stands — no further hitting or resplitting, even on a poor
          total. Card draws use a seeded PRNG, so results are reproducible arithmetic,
          not a black box: the same seed always deals the same shoe.
        </p>
      </section>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">FAQ</h2>
        <dl className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.question}>
              <dt className="font-medium">{f.question}</dt>
              <dd style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">
                {f.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
