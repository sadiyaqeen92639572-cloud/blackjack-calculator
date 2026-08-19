import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

const PATH = '/responsible-gambling/';
const TITLE = 'Responsible Gambling';
const DESCRIPTION =
  `${SITE_NAME} is a free educational math tool. It does not facilitate real-money wagering. If gambling is affecting your life, help is available.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

export default function ResponsibleGamblingPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-3">Responsible Gambling</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">What this site is</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {SITE_NAME} is a free educational tool for learning basic strategy, house
          edge, and payout math. It does not accept bets, does not process payments,
          and does not facilitate real-money wagering of any kind. Nothing on this
          site is gambling — it's arithmetic.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Age requirement</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Gambling-related content on this site is intended for adults only: 21+ in
          the United States, 18+ in the United Kingdom and most other jurisdictions.
          If you are under the legal gambling age in your location, please do not use
          this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">If gambling stops being fun</h2>
        <p style={{ color: 'var(--text-muted)' }} className="mb-4">
          Basic strategy and house-edge math reduce how much you're expected to lose
          over time — they don't change the fact that the house always keeps a
          long-run edge, and no strategy guarantees winning. If gambling is causing
          harm to you or someone you know, free, confidential help is available:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>United States</strong> — National Council on Problem Gambling:{' '}
            <a href="tel:1-800-522-4700" className="underline">
              1-800-522-4700
            </a>{' '}
            (call or text, 24/7),{' '}
            <a href="https://www.ncpgambling.org" className="underline">
              ncpgambling.org
            </a>
          </li>
          <li>
            <strong>United Kingdom</strong> —{' '}
            <a href="https://www.begambleaware.org" className="underline">
              BeGambleAware
            </a>{' '}
            and{' '}
            <a href="https://www.gamcare.org.uk" className="underline">
              GamCare
            </a>{' '}
            (National Gambling Helpline:{' '}
            <a href="tel:0808-8020-133" className="underline">
              0808 8020 133
            </a>
            , free and confidential)
          </li>
          <li>
            <strong>International</strong> —{' '}
            <a href="https://www.gamblersanonymous.org" className="underline">
              Gamblers Anonymous
            </a>{' '}
            has meetings and resources in many countries.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Any casino or affiliate links on this site</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Where this site links to a third-party gambling operator, that link is
          clearly labeled, kept separate from the calculator and simulator tools
          themselves, and only points to operators licensed in the visitor's own
          jurisdiction — a UK Gambling Commission license for UK visitors, a
          state-licensed operator for visitors in a US state where online real-money
          casino play is legal. No such link is ever presented as part of, or a
          requirement to use, the free tools on this site.
        </p>
      </section>
    </div>
  );
}
