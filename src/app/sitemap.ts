import type { MetadataRoute } from 'next';

/**
 * Generated rather than hand-written.
 *
 * The previous static public/sitemap.xml listed a /docs route that did not
 * exist and omitted every page that did. Deriving it from a list next to the
 * routes themselves means adding a page cannot silently leave it unlisted.
 */

const BASE = 'https://memoflow.app';

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/compare', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/compare/wispr-flow-alternative', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/compare/superwhisper-alternative', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/compare/free-dictation-app-mac', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/compare/dictation-without-subscription', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/release-notes', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
