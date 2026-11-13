import type { Metadata } from 'next';

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'MemoFlow',
      url: path,
      title,
      description,
      images: [{
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'MemoFlow — private AI meeting notes for Mac',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}
