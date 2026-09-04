import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Common misspellings of the competitor names. People search for these
      // constantly and the correctly-spelled pages elsewhere do not rank for
      // them, so the aliases are close to free traffic.
      {
        source: "/compare/wisperflow-alternative",
        destination: "/compare/wispr-flow-alternative",
        permanent: true,
      },
      {
        source: "/compare/wispr-flow-free-alternative",
        destination: "/compare/wispr-flow-alternative",
        permanent: true,
      },
      {
        source: "/compare/superwisper-alternative",
        destination: "/compare/superwhisper-alternative",
        permanent: true,
      },
      {
        source: "/compare/super-whisper-alternative",
        destination: "/compare/superwhisper-alternative",
        permanent: true,
      },
      // Shorthand people type or link directly.
      {
        source: "/free",
        destination: "/compare/free-dictation-app-mac",
        permanent: false,
      },
      // Article aliases. The Hinglish guide is the page most likely to be
      // linked from a chat message or a talk, where nobody retypes a 49-character
      // slug correctly, so the obvious shorter forms resolve to it.
      {
        source: "/blog/best-hinglish-transcription-apps-for-indian-teams-in-2026",
        destination: "/blog/best-hinglish-transcription-apps-indian-teams-2026",
        permanent: true,
      },
      {
        source: "/blog/hinglish-transcription",
        destination: "/blog/best-hinglish-transcription-apps-indian-teams-2026",
        permanent: true,
      },
      {
        source: "/hinglish",
        destination: "/blog/best-hinglish-transcription-apps-indian-teams-2026",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
