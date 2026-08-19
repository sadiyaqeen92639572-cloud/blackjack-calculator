import { describe, it, expect } from 'vitest';
import { simulateSession } from '../simulator';
import { calculateHouseEdge } from '../houseEdge';
import { DEFAULT_RULES } from '../rules';

// L3 — simulator convergence, CI-sized. The build plan's full spec (10M hands,
// ±0.05pp) is run separately via scripts/verify-l3.ts (not part of the fast test
// suite — 10M hands is multiple seconds to tens of seconds depending on machine, not
// appropriate to run on every test invocation). This test uses a smaller N with a
// correspondingly wider tolerance (standard error shrinks with sqrt(N), so fewer
// hands need more slack) purely as a fast regression guard against gross breakage
// (e.g. a strategy-table edit that silently changes the realized edge by a full
// point) — it is not itself the L3 sign-off.
describe('L3 — simulator convergence (CI-sized, not the full spec)', () => {
  it('converges to within ~0.2pp of the theoretical house edge at 2M hands', () => {
    const theoretical = calculateHouseEdge(DEFAULT_RULES);
    const result = simulateSession(DEFAULT_RULES, 2_000_000, 42);
    expect(Math.abs(result.realizedEdgePct - theoretical)).toBeLessThan(0.2);
  }, 30_000);

  it('produces a bankroll curve sampled across the session', () => {
    const result = simulateSession(DEFAULT_RULES, 10_000, 7);
    expect(result.bankrollCurve.length).toBeGreaterThan(1);
    expect(result.bankrollCurve[result.bankrollCurve.length - 1]).toBeCloseTo(
      result.netUnits,
      0
    );
  });
});
