import type { RulePreset, RuleSet } from './types';

export const DEFAULT_RULES: RuleSet = {
  numDecks: 6,
  dealerHitsSoft17: false, // S17 — the standard basic-strategy chart baseline
  doubleAfterSplit: true,
  surrenderAllowed: false,
  resplitAllowed: true,
  maxSplitHands: 4,
  blackjackPayout: '3:2',
  penetration: 0.75,
};

// Named presets for /rules/[variant]/ — each feeds the engine's rule-set options and
// gets a pre-computed house edge at build time.
export const RULE_PRESETS: RulePreset[] = [
  {
    slug: 'vegas-strip',
    label: 'Vegas Strip',
    ...DEFAULT_RULES,
    numDecks: 6,
    dealerHitsSoft17: false,
    surrenderAllowed: true,
    intro:
      'The Strip standard: 6-deck shoe, dealer stands on soft 17, double after split allowed, and late surrender available at most tables — one of the friendliest widely-offered rule combinations to a basic-strategy player.',
    whyItMatters:
      'Late surrender is the rule most players skip, and it\'s worth roughly 0.08 percentage points on its own here — free equity for hands like a hard 16 against a dealer 9, 10, or Ace, where the math says give up half your bet rather than play the hand out.',
  },
  {
    slug: 'atlantic-city',
    label: 'Atlantic City',
    ...DEFAULT_RULES,
    numDecks: 8,
    dealerHitsSoft17: false,
    surrenderAllowed: true,
    resplitAllowed: true,
    intro:
      'New Jersey\'s regulated rule set: 8 decks (the deepest shoe in common use), dealer stands soft 17, double after split, late surrender, and — distinctively — dealer must check for blackjack before play continues (early peek), which is a procedural rule this engine doesn\'t need to model since it doesn\'t change basic-strategy decisions or the house edge.',
    whyItMatters:
      'Going from 6 to 8 decks barely moves the edge (a couple hundredths of a percentage point) — the deeper shoe is a much smaller factor than players assume. Surrender availability matters far more here than deck count.',
  },
  {
    slug: 'european',
    label: 'European (No Hole Card)',
    ...DEFAULT_RULES,
    numDecks: 6,
    dealerHitsSoft17: false,
    doubleAfterSplit: false,
    surrenderAllowed: false,
    intro:
      'European no-hole-card blackjack: the dealer doesn\'t draw a second card until after the player acts, so a dealer blackjack behind a 10 or Ace can cost a player who already doubled or split — a real structural difference from US rules, though this engine\'s pure basic-strategy math (no double-after-split, no surrender) matches the common European table configuration.',
    whyItMatters:
      'No double-after-split is the quiet edge-mover here: it looks like a minor restriction but costs about 0.14 percentage points versus a DAS table, on top of the no-hole-card risk that basic strategy tables don\'t fully capture on their own.',
  },
  {
    slug: 'single-deck',
    label: 'Single-Deck',
    ...DEFAULT_RULES,
    numDecks: 1,
    dealerHitsSoft17: true,
    doubleAfterSplit: false,
    surrenderAllowed: false,
    intro:
      'Single-deck games are marketed as the "best odds" table on the floor, but the deck-count advantage is almost always offset by worse rules elsewhere — this preset models the common real-world pairing: one deck, dealer hits soft 17, no double after split, no surrender.',
    whyItMatters:
      'This is the clearest example of a rule-shopping trap: a single deck is worth roughly a third of a percentage point to the player versus 6 decks, but H17 alone costs about 0.22 points back, and losing DAS costs another 0.14 — the "single-deck edge" mostly evaporates once the rest of the table\'s rules are counted.',
  },
  {
    slug: 'double-deck',
    label: 'Double-Deck',
    ...DEFAULT_RULES,
    numDecks: 2,
    dealerHitsSoft17: true,
    doubleAfterSplit: true,
    surrenderAllowed: false,
    intro:
      'A common middle-ground table: 2 decks with double after split allowed, but dealer hits soft 17 — a mix seen often on cruise ships and smaller casinos looking to offer a "better odds" table without single-deck\'s dealing overhead.',
    whyItMatters:
      'Keeping DAS while accepting H17 is a real net loss versus the 6-deck Vegas Strip baseline — H17\'s 0.22-point cost outweighs the small deck-count benefit, so this table is worse for the player than its "fewer decks" marketing implies.',
  },
  // Spanish 21 deliberately excluded: it uses a 48-card deck (no 10s) and its own
  // bonus-payout structure — a different game, not a rule-flag variant of standard
  // blackjack. This engine's strategy/house-edge tables don't apply to it. Revisit as
  // a separate engine if the base site validates, not a preset on this one.
];

export function rulePresetBySlug(slug: string): RulePreset | undefined {
  return RULE_PRESETS.find((p) => p.slug === slug);
}
