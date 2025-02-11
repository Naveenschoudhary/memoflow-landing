import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MemoFlow - AI Meeting Notes & Automatic Transcription Software",
  description: "Transform your meetings with AI-powered transcription, automatic note-taking, and real-time recording. Perfect for teams, developers, and professionals. Free during beta.",
  keywords: [
    "AI meeting transcription",
    "automatic meeting notes",
    "voice to text meetings",
    "meeting recorder app",
    "meeting minutes generator",
    "real-time transcription",
    "meeting notes software",
    "AI meeting assistant",
    "team meeting recorder",
    "meeting productivity tool"
  ],
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "MemoFlow - AI Meeting Notes & Automatic Transcription",
    description: "Transform your meetings with AI-powered transcription. Automatic recording, real-time notes, and team collaboration.",
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MemoFlow - AI Meeting Notes & Transcription",
    description: "Transform your meetings with AI-powered transcription. Automatic recording, real-time notes, and team collaboration.",
    images: ['/og-image.jpg'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
