import type { Metadata } from 'next';
import { CalculatorTool } from '@/components/calculator/CalculatorTool';
import {
  SITE_URL,
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';

const PATH = '/blackjack-calculator/';
const TITLE = 'Blackjack Calculator — Hit, Stand, Double, Split or Surrender?';
const DESCRIPTION =
  'Free blackjack calculator. Enter your hand and the dealer upcard, get the mathematically optimal basic-strategy move for your exact table rules — plus the full strategy chart generated live.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, type: 'website' },
};

const FAQS = [
  {
    question: 'How do I use the blackjack calculator?',
    answer:
      'Pick your two starting cards and the dealer\'s upcard, choose your table rules, and the calculator shows the mathematically optimal basic-strategy move: hit, stand, double, split, or surrender.',
  },
  {
    question: 'Is this the same as a static basic strategy chart?',
    answer:
      'The recommendation and the chart below both come from the same rule-set-aware engine, so unlike a printed chart, the answer changes correctly when you change decks, soft-17 rules, double-after-split, or surrender availability.',
  },
  {
    question: 'What does "surrender falls back to hit" mean?',
    answer:
      'Some hands (hard 15 vs. dealer 10, hard 16 vs. 9/10/A) are technically best surrendered, but not every table offers surrender. When your selected rules don\'t include it, the calculator recommends the next-best move — hitting — instead.',
  },
  {
    question: 'Does this calculator account for card counting?',
    answer:
      'No. This is basic strategy — the fixed, mathematically optimal play assuming no knowledge of remaining cards in the shoe. It does not adjust for a running or true count.',
  },
];

export const runtime = 'edge';

export default async function BlackjackCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ rules?: string }>;
}) {
  const { rules: presetSlug } = await searchParams;
  const appSchema = getSoftwareApplicationSchema('Blackjack Calculator', DESCRIPTION, `${SITE_URL}${PATH}`);
  const faqSchema = getFAQPageSchema(FAQS);
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Blackjack Calculator', url: `${SITE_URL}${PATH}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-3xl font-bold mb-3">Blackjack Calculator</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Enter your hand and the dealer's upcard to get the mathematically optimal
        basic-strategy move for your exact table rules, plus the full strategy chart
        generated live underneath — with your hand highlighted.
      </p>

      <CalculatorTool initialPresetSlug={presetSlug} />

      <section className="mt-12 max-w-2xl">
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
