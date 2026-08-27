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
    ];
  },
};

export default nextConfig;
