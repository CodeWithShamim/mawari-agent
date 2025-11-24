const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Mawari Agent",
    subtitle: "Your Gateway to the Immersive Internet",
    description:
      "Experience real-time, AI-driven immersive content powered by the Mawari Network.",
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
    ],
    heroImageUrl: `${ROOT_URL}/blue-hero.jpg`,
    tagline: "Immersive AI experiences streamed instantly",
    ogTitle: "Mawari Agent",
    ogDescription:
      "Step into the future of immersive computing with real-time AI-driven experiences powered by Mawari.",
    ogImageUrl: `${ROOT_URL}/blue-hero.jpg`,
  },
} as const;
