import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { Byline } from '@/components/article';
import { articleJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld';
import { AUTHOR, BASE, formatDate, postUrl, type Post } from '@/lib/posts';

export function guideMetadata(post: Post): Metadata {
  const url = postUrl(post.slug);
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: 'MemoFlow',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: [{ url: post.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.ogImage],
    },
  };
}

export default function GuideArticle({ post, topics, children }: {
  post: Post;
  topics: string[];
  children: React.ReactNode;
}) {
  const url = postUrl(post.slug);
  return (
    <PageShell
      eyebrow="Guide"
      title={post.title}
      backHref="/blog"
      backLabel="← All articles"
      meta={
        <Byline
          author={AUTHOR.name}
          publishedIso={post.datePublished}
          publishedLabel={formatDate(post.datePublished)}
          updatedIso={post.dateModified}
          updatedLabel={formatDate(post.dateModified)}
          readingMinutes={post.readingMinutes}
        />
      }
    >
      <JsonLd data={articleJsonLd({
        url,
        headline: post.title,
        description: post.description,
        image: `${BASE}${post.ogImage}`,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        keywords: post.keywords,
        topics,
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: BASE },
        { name: 'Blog', url: `${BASE}/blog` },
        { name: post.title, url },
      ])} />
      {children}
    </PageShell>
  );
}
