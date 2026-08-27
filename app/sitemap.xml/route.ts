import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';
import { RULE_PRESETS } from '@/lib/blackjack/rules';

export const runtime = 'edge';

// Bump on meaningful content/URL changes. Fixed date (not `new Date()`) so
// lastmod is stable between requests.
const LASTMOD = '2026-08-27';

// Trailing slashes to match `trailingSlash: true` in next.config — the form
// the host serves 200 for and every canonical tag points at.
const STATIC_ROUTES = [
  '',
  'blackjack-calculator/',
  'blackjack-simulator/',
  'house-edge-calculator/',
  'payout-calculator/',
  'basic-strategy-chart/',
  'rules/',
  'about/',
  'responsible-gambling/',
];

export function GET() {
  const ruleRoutes = RULE_PRESETS.map((p) => `rules/${p.slug}/`);
  const allRoutes = [...STATIC_ROUTES, ...ruleRoutes];

  const urls = allRoutes
    .map(
      (route) =>
        `<url><loc>${SITE_URL}/${route}</loc><lastmod>${LASTMOD}</lastmod><changefreq>monthly</changefreq><priority>${
          route === '' ? '1.0' : '0.8'
        }</priority></url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
