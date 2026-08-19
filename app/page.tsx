import Link from 'next/link';
import { getSoftwareApplicationSchema, SITE_URL } from '@/lib/seo';

export default function HomePage() {
  const schema = getSoftwareApplicationSchema(
    'Blackjack Calculator',
    'Free blackjack simulator, basic-strategy calculator, house-edge calculator, and payout calculator.',
    SITE_URL
  );

  const tools = [
    {
      href: '/blackjack-simulator/',
      title: 'Blackjack Simulator',
      desc: 'Play thousands of simulated hands under any rule set and see your realized edge vs the theoretical house edge.',
    },
    {
      href: '/blackjack-calculator/',
      title: 'Blackjack Calculator',
      desc: 'Enter your hand and the dealer upcard, get the mathematically optimal move — plus a dynamically generated strategy chart for your exact rules.',
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
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="text-3xl font-bold mb-3">Blackjack Calculator</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        Free, no-signup blackjack math tools: a session simulator, a basic-strategy
        decision calculator, a house-edge calculator, and a payout calculator — all
        driven by the same rule-set-aware engine.
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
