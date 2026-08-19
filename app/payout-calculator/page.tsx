import type { Metadata } from 'next';
import { PayoutTool } from '@/components/payout/PayoutTool';
import {
  SITE_URL,
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';

const PATH = '/payout-calculator/';
const TITLE = 'Blackjack Payout Calculator — 3:2 vs 6:5, Insurance & Bet Size';
const DESCRIPTION =
  'Free blackjack payout calculator. Enter your bet and outcome to see the exact payout — including the real dollar cost of 6:5 vs 3:2 blackjack payouts at your bet size.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, type: 'website' },
};

const FAQS = [
  {
    question: 'What does 6 to 5 blackjack mean?',
    answer:
      'It\'s the payout ratio on a natural blackjack: a $10 bet returns $12 profit at 6:5, versus $15 profit at the standard 3:2 ratio. The lower ratio significantly raises the house edge on its own — see the comparison table above.',
  },
  {
    question: 'How much does 6:5 blackjack actually cost me?',
    answer:
      'On a $25 blackjack, 3:2 pays $37.50 profit versus $30 at 6:5 — a $7.50 difference on that one hand alone. Across a full session, the payout-ratio effect is the single largest lever on the house edge; see the house edge calculator for the percentage-point impact.',
  },
  {
    question: 'How does insurance payout work?',
    answer:
      'Insurance is a side bet capped at half your original bet, paying 2:1 if the dealer has blackjack. It\'s a break-even or losing proposition under basic strategy in the long run and is never recommended by basic strategy regardless of your hand.',
  },
  {
    question: 'What happens on a push?',
    answer: 'A push (tie with the dealer) returns your original bet with no profit or loss.',
  },
];

export default function PayoutCalculatorPage() {
  const appSchema = getSoftwareApplicationSchema('Payout Calculator', DESCRIPTION, `${SITE_URL}${PATH}`);
  const faqSchema = getFAQPageSchema(FAQS);
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Payout Calculator', url: `${SITE_URL}${PATH}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-3xl font-bold mb-3">Blackjack Payout Calculator</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Bet size and outcome in, exact payout out — including blackjack (3:2 or 6:5),
        regular wins, pushes, and insurance side bets.
      </p>

      <PayoutTool />

      <section className="mt-10 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">How this is calculated</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Straight arithmetic on your bet, no rounding tricks: a blackjack pays your
          bet × 1.5 at 3:2 or × 1.2 at 6:5, a regular win pays 1:1, a push returns your
          stake, and insurance — a side bet capped at half your original bet — pays 2:1
          when it wins. Same payout math the{' '}
          <a href="/blackjack-simulator/" className="underline">
            simulator
          </a>{' '}
          uses when it settles every hand in a run.
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
