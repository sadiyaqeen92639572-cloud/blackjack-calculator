import type { Metadata } from 'next';
import { ChartPageTool } from '@/components/chart/ChartPageTool';
import { SITE_URL, getFAQPageSchema, getBreadcrumbSchema } from '@/lib/seo';

const PATH = '/basic-strategy-chart/';
const TITLE = 'Blackjack Basic Strategy Chart — Generated Live For Your Rules';
const DESCRIPTION =
  'Blackjack basic strategy chart for hard totals, soft totals, and pairs — generated live for your exact rule set (decks, S17/H17, double after split, surrender), not a static image.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, type: 'website' },
};

const FAQS = [
  {
    question: 'Why is this basic strategy chart different from a printed cheat sheet?',
    answer:
      'Most published charts assume one specific rule set. This chart is generated live from the same engine as the calculator and simulator, so it updates correctly when you change decks, dealer soft-17 behavior, double-after-split, or surrender availability.',
  },
  {
    question: 'What do H, S, D, P, and R mean on the chart?',
    answer: 'Hit, Stand, Double, Split, and Surrender (Surrender falls back to Hit if your selected rules don\'t allow it).',
  },
  {
    question: 'Is basic strategy the same as card counting?',
    answer:
      'No. Basic strategy is the fixed, mathematically optimal play for every hand assuming no knowledge of the remaining shoe. Card counting is a separate skill layered on top of basic strategy and isn\'t covered by this chart.',
  },
];

export default function BasicStrategyChartPage() {
  const faqSchema = getFAQPageSchema(FAQS);
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Basic Strategy Chart', url: `${SITE_URL}${PATH}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-3xl font-bold mb-3">Blackjack Basic Strategy Chart</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Pick your table's rules and get the exact optimal-play chart for that rule
        set — hard totals, soft totals, and pairs — generated live, not served as a
        one-size-fits-all image. Want a specific recommendation for one hand instead of
        the full chart? Use the{' '}
        <a href="/blackjack-calculator/" className="underline">
          blackjack calculator
        </a>
        .
      </p>

      <ChartPageTool />

      <section className="mt-10 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">How this chart is generated</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Every cell comes from table-driven hard-total, soft-total, and pair matrices
          — the canonical multi-deck, dealer-stands-on-17 basic strategy — with real
          fallback logic applied per rule: no double-after-split falls back to hit
          instead of split on 4,4, no surrender falls back to hit instead of surrender.
          The chart is checked cell-for-cell against an independently published
          strategy reference before shipping, not hand-typed from memory.
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
