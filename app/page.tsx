import Link from 'next/link';
import { getSoftwareApplicationSchema, SITE_URL } from '@/lib/seo';

export default function HomePage() {
  const schema = getSoftwareApplicationSchema(
    'Blackjack Calculators & Tools',
    'Free blackjack simulator, optimal-move calculator, house-edge calculator, payout calculator, and basic-strategy chart.',
    SITE_URL
  );

  const tools = [
    {
      href: '/blackjack-calculator/',
      title: 'Blackjack Calculator',
      desc: 'Enter your hand and the dealer upcard, get the mathematically optimal move — plus a dynamically generated strategy chart for your exact rules.',
    },
    {
      href: '/blackjack-simulator/',
      title: 'Blackjack Simulator',
      desc: 'Play thousands of simulated hands under any rule set and see your realized edge vs the theoretical house edge.',
    },
    {
      href: '/house-edge-calculator/',
      title: 'House Edge Calculator',
      desc: 'See exactly how deck count, dealer soft-17 rules, double-after-split, surrender, and payout ratio each move the house edge.',
    },
    {
      href: '/payout-calculator/',
      title: 'Payout Calculator',
      desc: 'Bet size and hand type in, exact payout out — including the real cost of 6:5 vs 3:2 blackjack payouts.',
    },
    {
      href: '/basic-strategy-chart/',
      title: 'Basic Strategy Chart',
      desc: 'The full hit/stand/double/split grid, regenerated live for your deck count, soft-17, DAS and surrender rules.',
    },
    {
      href: '/rules/',
      title: 'Rule Variants',
      desc: 'Vegas Strip, Atlantic City, European, single- and double-deck — how each rule set shifts the house edge.',
    },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="text-3xl font-bold mb-3">Blackjack Calculators &amp; Tools</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Free, no-signup blackjack math tools: an optimal-move calculator, a session
        simulator, a house-edge calculator, a payout calculator, and a live basic-strategy
        chart — all driven by the same rule-set-aware engine. Looking for the move
        calculator itself?{' '}
        <Link href="/blackjack-calculator/" className="underline">
          Open the blackjack calculator
        </Link>
        .
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="surface p-5 block">
            <h2 className="font-semibold text-lg mb-2">{tool.title}</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {tool.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
