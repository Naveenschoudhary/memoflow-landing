/**
 * The article registry.
 *
 * Post metadata lives here rather than inside each page file so that the index,
 * the sitemap and the JSON-LD all read the same title, description and dates.
 * The previous static sitemap drifted out of sync with the routes that existed
 * (see sitemap.ts); deriving article URLs from this list means publishing a post
 * cannot silently leave it unlisted or mis-dated in structured data.
 *
 * Dates are ISO so they can go straight into `datePublished` / `dateModified`
 * without reformatting. `updated` is what search and answer engines surface as
 * the freshness signal, so bump it whenever the substance of a post changes —
 * not for a typo fix.
 */

export const BASE = 'https://memoflow.app';

/**
 * Posts are attributed to the company, not to a person.
 *
 * Schema.org allows an Organization as `author`, and an organisation byline is
 * honest here: there is no author bio page, no track record to point at, and a
 * Person entity with nothing behind it adds no credibility. Swap in a Person
 * (with a real `url` to a profile) once there is somewhere for it to link.
 */
export const AUTHOR = {
  name: 'MemoFlow',
  id: `${BASE}/#organization`,
} as const;

export type Post = {
  /** URL segment under /blog. */
  slug: string;
  /** The on-page <h1>. */
  title: string;
  /**
   * The <title> tag. Kept separate from `title` because it has ~60 usable
   * characters and needs the primary keyword at the front, while the h1 can
   * read as a sentence.
   */
  metaTitle: string;
  /** Meta description and the blurb on the index. ~155 chars. */
  description: string;
  /** Longer summary for the index card and llms.txt. */
  excerpt: string;
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  /** Primary keyword, used for the article's `keywords` metadata. */
  keywords: string[];
  hero: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** 1200x630 social card. Relative to the site root. */
  ogImage: string;
};

export const POSTS: Post[] = [
  {
    slug: 'best-hinglish-transcription-apps-indian-teams-2026',
    title: 'Best Hinglish Transcription Apps for Indian Teams in 2026',
    metaTitle: 'Best Hinglish Transcription Apps for Indian Teams (2026)',
    description:
      'Hinglish breaks most transcription tools. A comparison of the apps that handle mid-sentence Hindi-English code-switching, by use case — creators, corporate teams, students.',
    excerpt:
      'Word error rates on the same Hinglish recording vary by more than 40 percentage points across platforms. Which apps actually handle mid-sentence code-switching, what to look for, and what India’s DPDP Act means for routing client calls through a cloud service.',
    datePublished: '2026-09-04',
    dateModified: '2026-09-04',
    readingMinutes: 10,
    keywords: [
      'Hinglish transcription app',
      'Hindi English transcription',
      'Hinglish speech to text',
      'code-switching transcription',
      'Hinglish subtitle generator',
      'Hindi meeting transcription',
      'DPDP Act transcription',
      'on-device transcription India',
    ],
    hero: {
      src: '/blog/hinglish-transcription-2026/hero.webp',
      alt: 'Illustration of Hinglish transcription: a phone showing the code-switched messages “Chalo, kal ki meeting ka plan discuss karte hain” and “Sure, main notes share kar dunga”, surrounded by transcribe, accuracy and Indian-team icons.',
      width: 1536,
      height: 1024,
    },
    ogImage: '/blog/hinglish-transcription-2026/og.jpg',
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postPath(slug: string): string {
  return `/blog/${slug}`;
}

export function postUrl(slug: string): string {
  return `${BASE}${postPath(slug)}`;
}

/** Newest first. The index and any "more reading" list share this order. */
export function postsByDate(): Post[] {
  return [...POSTS].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

/**
 * "4 September 2026" — the same long-form style the comparison pages use for
 * their `updated` line, so dates read identically across the site.
 */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
