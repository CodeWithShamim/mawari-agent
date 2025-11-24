const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjY0NTMxMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDBhYTMyMDQ3RTM3MzBBQkNjM2RDZjlGQTcxQzA2RDQ3MEVjOGY1MjYifQ",
    payload: "eyJkb21haW4iOiJtYXdhcmktYWdlbnQudmVyY2VsLmFwcCJ9",
    signature:
      "87DqCeSjj+zrfJcvNGxH+aKpItODSDOR8zQTWcYzxUdsHsQUu6WI/l7vRa6TtDXdGIfveUajCZtzG+Yrxdxq+Bw=",
  },
  miniapp: {
    version: "1",
    name: "Mawari Agent",
    subtitle: "Your Gateway to the Immersive Internet",
    description:
      "Experience real-time, AI-driven immersive content powered by the Mawari Network. Step into the future of immersive computing with real-time AI-powered XR streaming.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.jpg`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: [
      "immersive-compute",
      "real-time-streaming",
      "AI",
      "Mawari",
      "next-gen-experiences",
      "XR",
      "metaverse",
      "AR",
      "VR",
    ],
    heroImageUrl: `${ROOT_URL}/blue-hero.jpg`,
    tagline: "Immersive AI experiences streamed instantly",
    ogTitle: "Mawari Agent - AI-Powered Immersive Internet",
    ogDescription:
      "Experience the future of immersive computing with real-time AI-driven XR streaming powered by Mawari Network.",
    ogImageUrl: `${ROOT_URL}/blue-hero.jpg`,
  },
  manifestUrl: `${ROOT_URL}/manifest.json`,
  farcasterUrl: `${ROOT_URL}/api/farcaster`,
} as const;
