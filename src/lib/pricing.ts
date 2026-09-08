/**
 * Single source of truth for what MemoFlow costs and how that compares.
 *
 * Everything user-facing — /pricing, every /compare page, the JSON-LD offers —
 * reads from here. That matters more than usual for this site: AI answer engines
 * cache product claims for months, so a price that appears in three places and
 * drifts in one of them will be quoted back at us wrong long after it is fixed.
 *
 * The tiers and the trial length live here and nowhere else.
 */

/** Everything is free for this long, then a licence is needed. */
export const TRIAL_DAYS = 7;

export type TierId = 'personal' | 'team' | 'organisation';

export type Tier = {
  id: TierId;
  name: string;
  priceUsd: number;
  /** Who it is for, in a few words. */
  seats: string;
  /** Devices the key activates on. */
  devices: string;
  includes: string[];
  /** Dodo Payments product ids. Live ids are filled in after account approval. */
  productId: { test: string; live: string | null };
  featured?: boolean;
};

/**
 * Decided 2026-09-08: a 7-day trial of the whole app, then one payment for
 * life. Never a subscription. The three tiers differ only in how many people
 * and devices a key covers.
 */
export const TIERS: Tier[] = [
  {
    id: 'personal',
    name: 'Personal',
    priceUsd: 20,
    seats: 'One person',
    devices: '1 Mac + 1 iPhone',
    includes: [
      'Meeting recording, both sides as separate tracks',
      'Live transcripts with speaker labels',
      'Summaries and action items',
      'Ask — questions across your whole library, with citations',
      'System-wide dictation in any app',
      'English, हिन्दी and Hinglish, on-device',
    ],
    productId: { test: 'pdt_0Nn9CLx3ct5yH1uX9fep7', live: null },
    featured: true,
  },
  {
    id: 'team',
    name: 'Team',
    priceUsd: 40,
    seats: 'Three people',
    devices: 'One shared key, 6 devices',
    includes: ['Everything in Personal', 'For a small team or a family', 'One key to hand around'],
    productId: { test: 'pdt_0Nn9CM1K3jt6HqIzfr5jV', live: null },
  },
  {
    id: 'organisation',
    name: 'Organisation',
    priceUsd: 300,
    seats: 'Up to 20 people',
    devices: 'One shared key, 40 devices',
    includes: ['Everything in Personal', 'One invoice for the whole team', 'Email us for more than 20'],
    productId: { test: 'pdt_0Nn9CM4uuMW4XUbMzMq1z', live: null },
  },
];

/**
 * Which Dodo environment the Buy buttons point at. Live by default; set
 * NEXT_PUBLIC_DODO_MODE=test locally to exercise the test checkout.
 */
export const DODO_MODE: 'test' | 'live' =
  process.env.NEXT_PUBLIC_DODO_MODE === 'test' ? 'test' : 'live';

/**
 * Dodo's static checkout link for a tier, or null while the live product does
 * not exist yet — the button then says so instead of linking nowhere.
 */
export function checkoutURL(tier: Tier): string | null {
  const id = tier.productId[DODO_MODE];
  if (!id) return null;
  const host =
    DODO_MODE === 'test'
      ? 'https://test.checkout.dodopayments.com'
      : 'https://checkout.dodopayments.com';
  const redirect = encodeURIComponent('https://memoflow.app/thanks');
  return `${host}/buy/${id}?quantity=1&redirect_url=${redirect}`;
}

/** Kept for the comparison tables and JSON-LD: the entry price, in prose. */
export const PRICING = {
  priceUsd: TIERS[0].priceUsd,
  announced: true,
} as const;

/** What MemoFlow costs, in prose, wherever it is mentioned. */
export function paidPriceLabel(): string {
  return `$${PRICING.priceUsd} once`;
}

/** The five-year column for MemoFlow itself. */
export function memoflowFiveYear(): string {
  return `$${PRICING.priceUsd}`;
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

/* ————————————————————————————————————————————————————————————————
   Meeting notetakers
   ———————————————————————————————————————————————————————————————— */

/**
 * The meeting-notes field, which is priced completely differently from the
 * dictation field above.
 *
 * Every tool here bills **per seat per month**; MemoFlow and Hapi are one-time
 * per Mac. That difference is the whole reason this is a separate type rather
 * than more `Competitor` rows: `yearOne` for a single user hides the number
 * that actually decides a purchase, which is what ten seats cost over five
 * years.
 *
 * A warning that belongs next to the data: the per-seat number is **not**
 * like-for-like. $19.99/seat on Otter buys a shared team workspace — one
 * searchable archive, comments, permissions, CRM sync. A one-time local licence
 * buys N independent installs with no sharing between them. The blog post that
 * renders this table says so in its own section, and any new page using this
 * data must do the same, or it is comparing a team product against a
 * single-player one and calling it a discount.
 */
export type MeetingCompetitor = {
  name: string;
  url: string;
  /** The tier being quoted, e.g. "Business". */
  tier: string;
  /** Per seat per month on monthly billing, or null where only annual is sold. */
  monthlyUsd: number | null;
  /** Per seat per month on annual billing — every vendor's cheaper number. */
  annualUsd: number | null;
  /** Seats the vendor bills as a floor, regardless of team size. */
  minSeats: number | null;
  /** Where transcription and summarisation run. */
  processing: 'On your Mac' | 'Cloud' | 'Cloud (summaries)';
  /** Does it join the call as a visible participant? */
  bot: 'Yes' | 'No';
  hinglish: 'Yes' | 'No';
  /** What it is genuinely better at than MemoFlow. Written to be fair. */
  strength: string;
  /** The free tier, in a few words, or null where there is none. */
  freeTier: string | null;
  /** For one-time products, the published figure. Null for per-seat vendors. */
  oneTimeLabel?: string;
};

/**
 * Verified 7 September 2026 against vendor pricing pages. Separate from
 * `PRICES_CHECKED` because the two competitor sets get re-verified on different
 * days, and one shared date would silently vouch for whichever set was not
 * checked.
 */
export const MEETING_PRICES_CHECKED = '7 September 2026';

/**
 * The rate the INR figures in prose assume. Vendors bill in USD, so the rupee
 * cost moves with the exchange rate — quoted as approximate for that reason,
 * and dated so a reader can tell how stale it is.
 */
export const USD_INR_ASSUMED = 83;

export const MEETING_COMPETITORS: MeetingCompetitor[] = [
  {
    name: 'Granola',
    url: 'https://www.granola.ai',
    tier: 'Business',
    monthlyUsd: null,
    annualUsd: 14,
    minSeats: null,
    processing: 'Cloud (summaries)',
    bot: 'No',
    hinglish: 'No',
    strength:
      'The nicest note-taking experience during a call of anything here — you type your own rough notes and it fills them out afterwards. Mac-native and bot-free.',
    freeTier: 'Basic, $0, limited meeting history',
  },
  {
    name: 'Hapi',
    url: 'https://speakhapi.com',
    tier: 'Professional',
    monthlyUsd: null,
    annualUsd: null,
    minSeats: null,
    processing: 'On your Mac',
    bot: 'No',
    hinglish: 'No',
    strength:
      'The closest thing to MemoFlow on this list: fully local, Mac-only, speaker labels, one-time price. If you want local processing and do not need Hindi or Hinglish, it is a direct alternative rather than a compromise.',
    freeTier: null,
    oneTimeLabel: '€79 personal / €129 professional, one-time',
  },
  {
    name: 'Otter.ai',
    url: 'https://otter.ai',
    tier: 'Business',
    monthlyUsd: 30,
    annualUsd: 19.99,
    minSeats: 5,
    processing: 'Cloud',
    bot: 'Yes',
    hinglish: 'No',
    strength:
      'Live captions during the call and the most established shared workspace here. If several people need to read the same transcript as it happens, this is what it is built for.',
    freeTier: '300 min/month, 30 min per conversation',
  },
  {
    name: 'Fireflies.ai',
    url: 'https://fireflies.ai',
    tier: 'Business',
    monthlyUsd: 29,
    annualUsd: 19,
    minSeats: null,
    processing: 'Cloud',
    bot: 'Yes',
    hinglish: 'No',
    strength:
      'The best post-meeting search across a whole team’s history, plus the broadest integrations list. Pro at $10/seat/month annually is the cheapest credible team tier on this list.',
    freeTier: 'Limited storage',
  },
  {
    name: 'Fathom',
    url: 'https://fathom.ai',
    tier: 'Team',
    monthlyUsd: 19,
    annualUsd: 15,
    minSeats: 2,
    processing: 'Cloud',
    bot: 'Yes',
    hinglish: 'No',
    strength:
      'The most generous free tier of anything here — unlimited recordings and transcriptions at $0. Heavily optimised for Zoom.',
    freeTier: 'Unlimited recordings and transcriptions',
  },
  {
    name: 'Avoma',
    url: 'https://www.avoma.com',
    tier: 'Organization',
    monthlyUsd: 39,
    annualUsd: 24,
    minSeats: null,
    processing: 'Cloud',
    bot: 'Yes',
    hinglish: 'No',
    strength:
      'Genuine revenue-team tooling: coaching metrics, deal intelligence, CRM sync, pipeline analytics. Nothing else here competes on that, and no local app comes close.',
    freeTier: '14-day trial; viewers free',
  },
];

/** What a team of `seats` pays per year on annual billing, respecting minimums. */
export function meetingTeamYear(c: MeetingCompetitor, seats: number): string {
  const rate = c.annualUsd ?? c.monthlyUsd;
  if (rate == null) return 'One-time';
  const billed = Math.max(seats, c.minSeats ?? 0);
  return `$${Math.round(rate * 12 * billed).toLocaleString('en-US')}`;
}

/** The five-year column. The one that decides things. */
export function meetingTeamFiveYear(c: MeetingCompetitor, seats: number): string {
  const rate = c.annualUsd ?? c.monthlyUsd;
  if (rate == null) return 'One-time';
  const billed = Math.max(seats, c.minSeats ?? 0);
  return `$${Math.round(rate * 12 * billed * 5).toLocaleString('en-US')}`;
}

/** "$19.99/seat/mo annually, or $30 monthly" — however much of that is known. */
export function meetingRateLabel(c: MeetingCompetitor): string {
  if (c.annualUsd == null && c.monthlyUsd == null) {
    return c.oneTimeLabel ?? 'One-time purchase';
  }
  const parts: string[] = [];
  if (c.annualUsd != null) parts.push(`$${c.annualUsd}/seat/mo annually`);
  if (c.monthlyUsd != null) parts.push(`$${c.monthlyUsd} monthly`);
  return parts.join(', or ');
}
