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

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MemoFlow",
  operatingSystem: "macOS 26",
  applicationCategory: "BusinessApplication",
  description:
    "Private, on-device AI meeting recorder for Mac: transcription, summaries, action items, ask-your-meetings chat, and system-wide dictation in English, Hindi and Hinglish. No cloud, no account.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free during beta",
  },
  url: "https://memoflow.app",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <SignupModalProvider>
          {children}
          <ModalContainer />
        </SignupModalProvider>
      </body>
    </html>
  );
}
