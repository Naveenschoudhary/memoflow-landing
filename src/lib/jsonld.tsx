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
