import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageShell, { Panel } from '@/components/PageShell';
import { blogJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld';
import { BASE, formatDate, postPath, postsByDate, postUrl } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'MemoFlow blog — on-device transcription, Hinglish and meeting notes',
  description:
    'Writing on private, on-device transcription: Hinglish and Hindi speech recognition, meeting notes that stay on your Mac, and how the tools actually compare.',
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'MemoFlow blog',
    description:
      'Writing on private, on-device transcription: Hinglish and Hindi speech recognition, and meeting notes that stay on your Mac.',
    url: `${BASE}/blog`,
    siteName: 'MemoFlow',
    type: 'website',
  },
};

export default function BlogIndex() {
  const posts = postsByDate();

  return (
    <PageShell eyebrow="Blog" title="Writing">
      <JsonLd
        data={blogJsonLd(
          posts.map((p) => ({
            url: postUrl(p.slug),
            title: p.title,
            description: p.description,
            datePublished: p.datePublished,
          }))
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: BASE },
          { name: 'Blog', url: `${BASE}/blog` },
        ])}
      />

      <Panel>
        Notes on transcription that runs on your own machine — what Hindi and
        Hinglish actually demand of a speech model, where the alternatives are
        better, and what it means to keep a recording off someone else’s server.
      </Panel>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition hover:border-[var(--accent)]/40"
          >
            <Link href={postPath(post.slug)} className="block">
              <Image
                src={post.hero.src}
                alt=""
                width={post.hero.width}
                height={post.hero.height}
                sizes="(min-width: 768px) 768px, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs text-[var(--muted)]/80">
                  <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                  {' · '}
                  {post.readingMinutes} min read
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
                  {post.title}
                </h2>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
                <p className="mt-4 text-sm font-medium text-[var(--accent)]">Read the guide →</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
