import type { MetadataRoute } from 'next';
import { BASE, POSTS, postUrl } from '@/lib/posts';

const paths = [
  '/',
  '/pricing',
  '/compare',
  '/compare/wispr-flow-alternative',
  '/compare/superwhisper-alternative',
  '/compare/free-dictation-app-mac',
  '/compare/dictation-without-subscription',
  '/blog',
  '/release-notes',
  '/support',
  '/is-memoflow-legit',
  '/refunds',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The article registry tracks substantive edits. Other pages have no tracked
  // modification date, so omit lastModified instead of using the build time.
  return [
    ...paths.map((path) => ({ url: `${BASE}${path}` })),
    ...POSTS.map((post) => ({
      url: postUrl(post.slug),
      lastModified: post.dateModified,
    })),
  ];
}
