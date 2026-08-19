import type { Metadata } from 'next';
import './globals.css';
import { HydrationGate } from '@/components/HydrationGate';
import { AgeGate } from '@/components/AgeGate';
import { SITE_NAME, SITE_URL, getWebSiteOrgSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Basic Strategy, House Edge & Session Simulator`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Free blackjack simulator and basic-strategy calculator. Rule-set aware house edge, payout math, and dynamically generated strategy charts — no signup.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = getWebSiteOrgSchema();
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <HydrationGate>
          <AgeGate />
          <header className="border-b" style={{ borderColor: 'var(--border)' }}>
            <nav className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <a href="/" className="font-bold text-lg">
                {SITE_NAME}
              </a>
              <div
                className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <a href="/blackjack-simulator/">Simulator</a>
                <a href="/blackjack-calculator/">Calculator</a>
                <a href="/house-edge-calculator/">House Edge</a>
                <a href="/payout-calculator/">Payout</a>
                <a href="/rules/">Rules</a>
                <a href="/responsible-gambling/">Responsible Gambling</a>
                <a href="/about/">About</a>
              </div>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
          <footer
            className="max-w-5xl mx-auto px-4 py-8 text-sm border-t mt-12"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
          >
            <p>
              Educational tool, 21+ (US) / 18+ (elsewhere). This site does not
              facilitate real-money wagering. See{' '}
              <a href="/responsible-gambling/" className="underline">
                Responsible Gambling
              </a>
              .
            </p>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} {SITE_NAME}. Operated by Gesmine-Invest
              Limited (UK Company No. 14120136).{' '}
              <a href="/about/" className="underline">
                About
              </a>
              .
            </p>
          </footer>
        </HydrationGate>
      </body>
    </html>
  );
}
