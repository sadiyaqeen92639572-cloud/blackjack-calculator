// Full L3 spec per the build plan: 10M hands, fixed seed, standard rules, compared
// against calculateHouseEdge()'s theoretical baseline within ±0.05pp. Run manually
// (`npx tsx scripts/verify-l3.ts`) — not part of the CI-sized vitest suite
// (simulator.l3.test.ts) since 10M hands is too slow to run on every test invocation.
import { simulateSession } from '../lib/blackjack/simulator';
import { calculateHouseEdge } from '../lib/blackjack/houseEdge';
import { DEFAULT_RULES } from '../lib/blackjack/rules';

const theoretical = calculateHouseEdge(DEFAULT_RULES);
const seeds = [1, 2, 3, 4, 5];
console.log(`Theoretical house edge (baseline ruleset): ${theoretical}%`);

for (const seed of seeds) {
  const result = simulateSession(DEFAULT_RULES, 10_000_000, seed);
  const delta = result.realizedEdgePct - theoretical;
  const status = Math.abs(delta) <= 0.05 ? 'PASS' : 'OUT OF TOLERANCE';
  console.log(
    `seed=${seed} realized=${result.realizedEdgePct.toFixed(4)}% delta=${delta.toFixed(4)}pp [${status}]`
  );
}
