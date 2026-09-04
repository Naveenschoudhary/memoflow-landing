/**
 * JSON-LD builders shared by the comparison pages.
 *
 * Each comparison page carries its own FAQPage block rather than inheriting one,
 * because the questions differ per page and a retriever matching "is there a free
 * Wispr Flow alternative" should land on that page's answer, not the home page's.
 */

export type Faq = { q: string; a: string };

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Renders a JSON-LD script tag. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ————————————————————————————————————————————————————————————————
   Article structured data
   ———————————————————————————————————————————————————————————————— */

/**
 * `BlogPosting` for an article page.
 *
 * `author` and `publisher` reference the Organization node declared once in
 * layout.tsx by @id rather than re-describing it, so the graph stays consistent
 * across pages instead of asserting two slightly different companies.
 *
 * `dateModified` matters more than `datePublished` for how engines judge
 * freshness, which is why posts.ts carries both and this never derives one from
 * the other.
 */
export function articleJsonLd({
  url,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  keywords,
  wordCount,
}: {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  wordCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    keywords: keywords.join(', '),
    ...(wordCount ? { wordCount } : {}),
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    author: { '@id': 'https://memoflow.app/#organization' },
    publisher: { '@id': 'https://memoflow.app/#organization' },
    about: [
      { '@type': 'Thing', name: 'Hinglish transcription' },
      { '@type': 'Thing', name: 'Automatic speech recognition' },
      { '@type': 'Thing', name: 'Code-switching' },
    ],
  };
}

/**
 * `BreadcrumbList` so the blog hierarchy shows in results rather than a bare
 * URL, and so an answer engine can tell an article apart from the home page.
 */
export function breadcrumbJsonLd(trail: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}

/**
 * `VideoObject` for an embedded product demo.
 *
 * Worth the markup because a silent looping clip is invisible to text
 * retrieval otherwise: this is the only place the demo's content is stated in
 * a machine-readable way.
 */
export function videoJsonLd({
  name,
  description,
  contentUrl,
  thumbnailUrl,
  uploadDate,
  duration,
}: {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
  /** ISO 8601, e.g. PT16S. */
  duration: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    contentUrl,
    thumbnailUrl,
    uploadDate,
    duration,
    publisher: { '@id': 'https://memoflow.app/#organization' },
  };
}

/** `Blog` node for the article index, listing every post as an item. */
export function blogJsonLd(posts: { url: string; title: string; description: string; datePublished: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://memoflow.app/blog#blog',
    url: 'https://memoflow.app/blog',
    name: 'MemoFlow blog',
    description:
      'Writing on private, on-device transcription: Hinglish and Hindi speech recognition, meeting notes, and what stays on your machine.',
    publisher: { '@id': 'https://memoflow.app/#organization' },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      '@id': `${p.url}#article`,
      url: p.url,
      headline: p.title,
      description: p.description,
      datePublished: p.datePublished,
      author: { '@id': 'https://memoflow.app/#organization' },
    })),
  };
}
