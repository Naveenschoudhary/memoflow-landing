import type { Metadata } from "next";
import "./globals.css";
import { SignupModalProvider } from "@/context/SignupModalContext";
import ModalContainer from "@/components/ModalContainer";

export const metadata: Metadata = {
  metadataBase: new URL("https://memoflow.app"),
  title: "MemoFlow — AI Meeting Notes That Never Leave Your Mac",
  description:
    "Private, on-device AI meeting notes for macOS. Records both sides of your calls, live transcripts, summaries, action items, and ask-your-meetings chat — in English, Hindi & Hinglish. Nothing is ever uploaded.",
  keywords: [
    "AI meeting notes Mac",
    "private meeting transcription",
    "on-device transcription macOS",
    "offline meeting recorder",
    "local AI notetaker",
    "Hinglish transcription app",
    "Hindi meeting transcription",
    "Whisper Mac app",
    "Apple Intelligence meeting notes",
    "AI dictation Mac",
    "meeting summary app macOS",
    "Otter alternative private",
  ],
  alternates: {
    canonical: "https://memoflow.app",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "MemoFlow — AI Meeting Notes That Never Leave Your Mac",
    description:
      "Records both sides of your meetings, transcribes live, writes summaries & action items, and answers questions about what was said — 100% on-device, in English, Hindi & Hinglish.",
    url: "https://memoflow.app",
    siteName: "MemoFlow",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MemoFlow — private AI meeting notes for Mac" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MemoFlow — AI Meeting Notes That Never Leave Your Mac",
    description:
      "Private, on-device meeting transcription, summaries, and dictation for macOS. English, Hindi & Hinglish. Nothing is ever uploaded.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Structured description of the product, as one graph.
 *
 * Deliberately omits softwareVersion: the real version is fetched at request
 * time from the GitHub release (see lib/release.ts), and a hardcoded one here
 * would go stale and be quoted back long after it stopped being true.
 *
 * No screenshot is declared either: public/screenshot.png still shows the old
 * Tauri build ("Meeting Recorder", generic blue buttons), not the native app.
 * Pointing search and answer engines at a screenshot of a different product is
 * worse than showing none. Add it back once a current capture exists.
 *
 * Only the free offer is declared. The paid tier's price is not settled yet
 * (see lib/pricing.ts), and publishing a placeholder price is worse than
 * publishing none — answer engines cache product claims for months.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://memoflow.app/#organization",
      name: "MemoFlow",
      url: "https://memoflow.app",
      logo: "https://memoflow.app/icon-512.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://memoflow.app/#website",
      url: "https://memoflow.app",
      name: "MemoFlow",
      publisher: { "@id": "https://memoflow.app/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://memoflow.app/#app",
      name: "MemoFlow",
      url: "https://memoflow.app",
      operatingSystem: "macOS 26 (Tahoe), Apple Silicon",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Transcription and dictation",
      publisher: { "@id": "https://memoflow.app/#organization" },
      description:
        "Private, on-device AI meeting recorder for Mac: transcription, summaries, action items, ask-your-meetings chat, and system-wide dictation in English, Hindi and Hinglish. No cloud, no account.",
      featureList: [
        "Records microphone and system audio as separate tracks, capturing both sides of a call",
        "Live on-device transcription with speaker labels",
        "Summaries and action items generated locally",
        "Ask questions across your whole meeting library, with citations back to the recording",
        "System-wide dictation into any app via a hotkey",
        "On-device Hindi (Devanagari) and Hinglish code-switching transcription",
        "Works fully offline; no account or sign-in",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "Unlimited on-device dictation, free forever. Meeting features unlock with a one-time payment; free for everyone during the beta.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SignupModalProvider>
          {children}
          <ModalContainer />
        </SignupModalProvider>
      </body>
    </html>
  );
}
