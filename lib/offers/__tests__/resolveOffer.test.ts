import { describe, it, expect } from 'vitest';
import { resolveOffer, resolveRegion } from '../resolveOffer';
import { isLegalOnlineCasinoState } from '../usStates';

describe('resolveRegion', () => {
  it('resolves GB', () => {
    expect(resolveRegion('GB', null)).toBe('GB');
    expect(resolveRegion('gb', null)).toBe('GB'); // case-insensitive
  });

  it('resolves US state codes', () => {
    expect(resolveRegion('US', 'NJ')).toBe('US-NJ');
    expect(resolveRegion('US', 'ca')).toBe('US-CA'); // normalizes case
  });

  it('falls back to OTHER for US without a region, or any other country', () => {
    expect(resolveRegion('US', null)).toBe('OTHER');
    expect(resolveRegion('FR', null)).toBe('OTHER');
    expect(resolveRegion(null, null)).toBe('OTHER');
  });
});

describe('resolveOffer routing', () => {
  it('routes legal-casino-state US regions to type legal-casino (offer null until catalog is populated)', () => {
    const result = resolveOffer('US-NJ');
    expect(result.type).toBe('legal-casino');
    expect(result.offer).toBeNull();
  });

  it('routes non-legal US states to sweepstakes fallback (offer null until catalog is populated)', () => {
    const result = resolveOffer('US-TX');
    expect(result.type).toBe('sweepstakes');
    expect(result.offer).toBeNull();
  });

  it('routes GB to the gb-licensed category, with offer null until the catalog is populated', () => {
    const result = resolveOffer('GB');
    expect(result.type).toBe('gb-licensed');
    expect(result.offer).toBeNull();
  });

  it('routes OTHER to no offer at all', () => {
    const result = resolveOffer('OTHER');
    expect(result.type).toBe('none');
    expect(result.offer).toBeNull();
  });
});

describe('isLegalOnlineCasinoState', () => {
  it('recognizes known legal states case-insensitively', () => {
    expect(isLegalOnlineCasinoState('nj')).toBe(true);
    expect(isLegalOnlineCasinoState('PA')).toBe(true);
  });

  it('rejects states without legal online casino play', () => {
    expect(isLegalOnlineCasinoState('CA')).toBe(false);
    expect(isLegalOnlineCasinoState('TX')).toBe(false);
    expect(isLegalOnlineCasinoState('FL')).toBe(false);
  });
});
