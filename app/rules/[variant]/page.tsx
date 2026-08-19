import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RULE_PRESETS, rulePresetBySlug } from '@/lib/blackjack/rules';
import { calculateHouseEdge } from '@/lib/blackjack/houseEdge';
import { SITE_URL, getBreadcrumbSchema, getSoftwareApplicationSchema } from '@/lib/seo';

export function generateStaticParams() {
  return RULE_PRESETS.map((p) => ({ variant: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  const preset = rulePresetBySlug(variant);
  if (!preset) return {};
  const title = `${preset.label} Blackjack Rules & House Edge`;
  const description = `${preset.label} blackjack: ${preset.numDecks} deck${preset.numDecks > 1 ? 's' : ''}, dealer ${preset.dealerHitsSoft17 ? 'hits' : 'stands on'} soft 17. Exact house edge and optimal strategy for this rule set.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/rules/${preset.slug}/` },
    openGraph: { title, description, url: `${SITE_URL}/rules/${preset.slug}/`, type: 'website' },
  };
}

function RuleFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

export default async function RuleVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  const preset = rulePresetBySlug(variant);
  if (!preset) notFound();

  const edge = calculateHouseEdge(preset);
  const path = `/rules/${preset.slug}/`;
  const appSchema = getSoftwareApplicationSchema(
    `${preset.label} Blackjack Rules`,
    preset.intro,
    `${SITE_URL}${path}`
  );
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Rules', url: `${SITE_URL}/rules/` },
    { name: preset.label, url: `${SITE_URL}${path}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-3xl font-bold mb-3">{preset.label} Blackjack Rules</h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8 max-w-2xl">
        {preset.intro}
      </p>

      <div className="surface p-5 sm:p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RuleFact label="Decks" value={String(preset.numDecks)} />
        <RuleFact label="Dealer soft 17" value={preset.dealerHitsSoft17 ? 'Hits (H17)' : 'Stands (S17)'} />
        <RuleFact label="Double after split" value={preset.doubleAfterSplit ? 'Allowed' : 'Not allowed'} />
        <RuleFact label="Late surrender" value={preset.surrenderAllowed ? 'Allowed' : 'Not allowed'} />
      </div>

      <div className="surface p-5 sm:p-6 mb-8">
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          House edge under perfect basic strategy
        </div>
        <div className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>
          {edge}%
        </div>
      </div>

      <section className="max-w-2xl mb-10">
        <h2 className="text-xl font-semibold mb-3">Why this rule set matters</h2>
        <p style={{ color: 'var(--text-muted)' }}>{preset.whyItMatters}</p>
      </section>

      <section className="max-w-2xl mb-10">
        <h2 className="text-xl font-semibold mb-3">How the {edge}% is calculated</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Starts from a 6-deck, S17, DAS, no-surrender, 3:2 baseline (≈0.46%) and adds
          the published effect of every rule above that differs from it — deck count,
          dealer soft-17 behavior, double after split, surrender, payout ratio. Same
          engine as the{' '}
          <a href="/house-edge-calculator/" className="underline">
            house edge calculator
          </a>
          , so toggling any of these rules there reproduces this number exactly.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <a href={`/blackjack-calculator/?rules=${preset.slug}`} className="btn-primary">
          Open Calculator With These Rules →
        </a>
        <a
          href="/house-edge-calculator/"
          className="surface px-4 py-2 flex items-center text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Compare against other rule sets
        </a>
      </div>
    </div>
  );
}
