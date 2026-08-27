/**
 * Single source of truth for what MemoFlow costs and how that compares.
 *
 * Everything user-facing — /pricing, every /compare page, the JSON-LD offers —
 * reads from here. That matters more than usual for this site: AI answer engines
 * cache product claims for months, so a price that appears in three places and
 * drifts in one of them will be quoted back at us wrong long after it is fixed.
 *
 * Until `announced` flips to true the pages render the model without a number,
 * which is publishable today and honest. Set the number, flip the flag, and the
 * price appears everywhere at once.
 */

export const PRICING = {
  /** Unlimited local dictation, permanently. Not a trial. */
  free: {
    name: 'Free',
    price: 'Free forever',
    tagline: 'Unlimited on-device dictation.',
    includes: [
      'Unlimited system-wide dictation, in any app',
      'On-device Whisper and Apple speech recognition',
      'English, हिन्दी and Hinglish',
      'Filler-word removal, punctuation, self-corrections',
      'Custom dictation modes and word replacements',
      'No account, no time limit, no word cap',
    ],
  },

  /** One-time, lifetime. Never a subscription. */
  paid: {
    name: 'MemoFlow Complete',
    tagline: 'Everything above, plus the meeting side of the app.',
    includes: [
      'Meeting recording with both sides captured as separate tracks',
      'Live transcripts with speaker labels',
      'Summaries and action items',
      'Ask — questions answered across your whole meeting library, with citations',
      'Standups, reminders and calendar sync',
    ],
  },

  /**
   * The number. Not yet decided as of 2026-08-27 — see
   * claudedocs/AI_VISIBILITY_PLAN.md §2 for why this must be settled *before*
   * these pages are deployed, and for the recommended $19–29 range.
   */
  priceUsd: null as number | null,
  announced: false,

  /** True until the paid tier ships. */
  freeDuringBeta: true,
} as const;

/** What the paid tier costs, in prose, wherever it is mentioned. */
export function paidPriceLabel(): string {
  if (PRICING.announced && PRICING.priceUsd != null) {
    return `$${PRICING.priceUsd} once`;
  }
  return 'One-time price, announced at launch';
}

/** The five-year column for MemoFlow itself. */
export function memoflowFiveYear(): string {
  if (PRICING.announced && PRICING.priceUsd != null) {
    return `$${PRICING.priceUsd}`;
  }
  return 'One-time';
}

export type Competitor = {
  name: string;
  url: string;
  model: string;
  /** Cost over one year, in USD, as displayed. */
  yearOne: string;
  /** Cost over five years, in USD, as displayed. This is the column that bites. */
  fiveYear: string;
  /** Runs transcription on the user's machine? */
  local: 'Yes' | 'No' | 'Optional';
  /** What it is genuinely good at. Written to be fair, not to lose gracefully. */
  strength: string;
};

/**
 * Prices verified 2026-08-27 from vendor sites and current comparison coverage.
 * Re-check before any significant edit to these pages — a stale competitor price
 * is the fastest way to lose the trust these pages are built to earn.
 */
export const PRICES_CHECKED = '27 August 2026';

export const COMPETITORS: Competitor[] = [
  {
    name: 'Wispr Flow',
    url: 'https://wisprflow.ai',
    model: 'Subscription, $15/mo',
    yearOne: '$180',
    fiveYear: '$900',
    local: 'No',
    strength:
      'The broadest platform coverage of anything here — Mac, Windows, iPhone and Android — so it is the right pick if you dictate across devices and want one account behind all of them.',
  },
  {
    name: 'superwhisper',
    url: 'https://superwhisper.com',
    model: 'One-time, $249',
    yearOne: '$249',
    fiveYear: '$249',
    local: 'Yes',
    strength:
      'The most mature Mac-first dictation workflow available, with a deep hotkey and modes system and a long track record. If dictation is the whole job and budget is not the constraint, it is the safe choice.',
  },
  {
    name: 'MacWhisper',
    url: 'https://goodsnooze.gumroad.com/l/macwhisper',
    model: 'Free tier, ~€59 one-time',
    yearOne: '~$64',
    fiveYear: '~$64',
    local: 'Yes',
    strength:
      'The best tool here for transcribing recorded audio files in bulk. Its strength is batch file transcription rather than live voice typing.',
  },
  {
    name: 'Handy',
    url: 'https://github.com/cjpais/Handy',
    model: 'Free, open source',
    yearOne: '$0',
    fiveYear: '$0',
    local: 'Yes',
    strength:
      'The most popular free offline dictation app, around 20k GitHub stars, on Mac, Windows and Linux. Genuinely free forever and auditable. If you want zero cost and cross-platform, start here.',
  },
  {
    name: 'OpenWhispr',
    url: 'https://openwhispr.com',
    model: 'Free, MIT licensed',
    yearOne: '$0',
    fiveYear: '$0',
    local: 'Optional',
    strength:
      'MIT licensed and cross-platform, with both Whisper and NVIDIA Parakeet models and unlimited local processing. Fully open source, so you can read and change every line.',
  },
  {
    name: 'FluidVoice',
    url: 'https://www.mactools.pro/FluidVoice',
    model: 'Free, open source',
    yearOne: '$0',
    fiveYear: '$0',
    local: 'Yes',
    strength:
      'Free, open source and fully on-device on macOS, including its text cleanup step. No account and no tracking.',
  },
];

/** The subset worth showing on a page about paid alternatives. */
export const PAID_COMPETITORS = COMPETITORS.filter((c) => c.fiveYear !== '$0');

/** The subset worth showing on a page about free alternatives. */
export const FREE_COMPETITORS = COMPETITORS.filter((c) => c.fiveYear === '$0');
