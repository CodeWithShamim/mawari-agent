import { NextResponse } from 'next/server';
import { withValidProperties } from '../../../../lib/base-sdk-utils';

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_ROOT_URL as string;

  const manifest = {
    name: "Mawari Agent",
    description: "Your Gateway to the Immersive Internet - Experience real-time, AI-driven immersive content powered by the Mawari Network.",
    iconUrl: `${URL}/blue-icon.png`,
    splashScreenUrl: `${URL}/blue-hero.jpg`,
    homeUrl: `${URL}/`,
    webhookUrl: `${URL}/api/webhook`,
    categories: ["social", "entertainment", "productivity"],
    tags: [
      "immersive-compute",
      "real-time-streaming",
      "AI",
      "Mawari",
      "next-gen-experiences",
      "XR",
      "metaverse",
      "AR",
      "VR"
    ],
    capabilities: ["write", "read"],
    version: "1.0.0",
    developer: {
      name: "Mawari Network",
      url: "https://mawari.net"
    },
    support: {
      email: "support@mawari.net",
      url: "https://discord.gg/mawari"
    },
    screenshots: [`${URL}/screenshot-portrait.png`],
    backgroundColor: "#000000",
    themeColor: "#fb73ea",
    platform: "base",
    type: "miniapp"
  };

  return NextResponse.json(withValidProperties(manifest), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}