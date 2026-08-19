import { NextRequest, NextResponse } from 'next/server';
import { resolveOffer, resolveRegion } from '@/lib/offers/resolveOffer';

export const runtime = 'edge';

// Cloudflare's Workers runtime attaches a `cf` object to the incoming Request with
// geo fields (country, regionCode for US states) — not part of the standard Fetch API
// Request type, hence the local augmentation instead of `any`. Undefined in local
// `next dev` (no Cloudflare runtime), which safely resolves to region 'OTHER' below.
interface CloudflareRequestProperties {
  country?: string;
  regionCode?: string;
}

export async function GET(request: NextRequest) {
  const cf = (request as unknown as { cf?: CloudflareRequestProperties }).cf;
  const country = cf?.country ?? request.headers.get('cf-ipcountry');
  const regionCode = cf?.regionCode ?? null;

  const region = resolveRegion(country, regionCode);
  const result = resolveOffer(region);

  // No offer content is ever cached at the edge — region resolution must stay
  // per-request, and there's nothing here worth caching anyway while offer is null.
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
