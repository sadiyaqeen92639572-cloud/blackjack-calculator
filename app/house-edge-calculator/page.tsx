import type { Metadata } from 'next';
import { HouseEdgeTool } from '@/components/houseedge/HouseEdgeTool';
import {
  SITE_URL,
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';

const PATH = '/house-edge-calculator/';
const TITLE = 'Blackjack House Edge Calculator — By Rule Set';
const DESCRIPTION =
  'Free blackjack house edge calculator. See exactly how deck count, dealer soft-17 rules, double after split, late surrender, and 3:2 vs 6:5 payout each change the house edge — live, for your exact table rules.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, type: 'website' },
};

const FAQS = [
  {
    question: 'What is house edge in blackjack?',
    answer:
      'House edge is the casino\'s long-run statistical advantage, expressed as a percentage of each bet, assuming the player uses perfect basic strategy. A 0.5% house edge means the casino expects to keep 50 cents per $100 wagered over the long run.',
  },
  {
    question: 'Which single rule changes the house edge the most?',
    answer:
      'Blackjack payout ratio, by far. Switching from 3:2 to 6:5 payout typically adds well over a full percentage point to the house edge — more than deck count, soft-17 rules, or surrender combined.',
  },
  {
    question: 'Does the number of decks matter much?',
    answer:
      'Less than most players assume. Going from 8 decks to a single deck typically only moves the edge by a few tenths of a percentage point — the payout ratio and soft-17 rule matter far more.',
  },
  {
    question: 'Does shoe penetration affect the house edge shown here?',
    answer:
      'No. Penetration (how much of the shoe is dealt before reshuffling) only matters for card counting, which relies on tracking dealt cards. It has no effect on the basic-strategy house edge calculated here.',
  },
];

export default function HouseEdgeCalculatorPage() {
  const appSchema = getSoftwareApplicationSchema('House Edge Calculator', DESCRIPTION, `${SITE_URL}${PATH}`);
  const faqSchema = getFAQPageSchema(FAQS);
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'House Edge Calculator', url: `${SITE_URL}${PATH}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-3xl font-bold mb-3">Blackjack House Edge Calculator</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Every casino runs its own mix of rules, and each one moves the house edge —
        some by a lot, some barely at all. Toggle the rules below to see the exact
        effect on the edge you're playing against, assuming perfect basic strategy.
      </p>

      <HouseEdgeTool />

      <section className="mt-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">How this is calculated</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          This tool composes a baseline house edge (6 decks, dealer stands on soft 17,
          double after split, no surrender, 3:2 blackjack payout ≈ 0.46%) with the
          published per-rule effect of each variation you toggle. It's the same
          additive-rule-effect approach used across the industry — not a from-scratch
          combinatorial simulation for every combination, which is why the{' '}
          <a href="/blackjack-simulator/" className="underline">
            simulator
          </a>{' '}
          exists as a second way to sanity-check any given rule set over real hands.
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
