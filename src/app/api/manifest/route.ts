import { NextRequest, NextResponse } from 'next/server';
import { minikitConfig } from '../../../../minikit.config';

export async function GET(request: NextRequest) {
  try {
    const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

    const baseManifest = {
      name: "Mawari Agent",
      description: "Your Gateway to the Immersive Internet - Experience real-time, AI-driven immersive content powered by the Mawari Network.",
      iconUrl: `${rootUrl}/blue-icon.png`,
      imageUrl: `${rootUrl}/blue-hero.jpg`,
      heroImageUrl: `${rootUrl}/blue-hero.jpg`,
      splashImageUrl: `${rootUrl}/blue-hero.jpg`,
      splashScreenUrl: `${rootUrl}/blue-hero.jpg`,
      homeUrl: `${rootUrl}/`,
      categories: ["social", "entertainment", "productivity"],
      tags: [
        "immersive-compute",
        "real-time-streaming",
        "AI",
        "Mawari",
        "next-gen-experiences"
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
      screenshots: [`${rootUrl}/screenshot-portrait.png`],
      backgroundColor: "#000000",
      themeColor: "#fb73ea",
      platform: "base",
      type: "miniapp",
      // OpenGraph fields for embed preview
      ogTitle: "Mawari Agent - AI-Powered Immersive Internet",
      ogDescription: "Experience the future of immersive computing with real-time AI-driven XR streaming powered by Mawari Network.",
      ogImageUrl: `${rootUrl}/blue-hero.jpg`,
    };

    return NextResponse.json(baseManifest, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
  } catch (error) {
    console.error('Error serving Base manifest:', error);
    return NextResponse.json(
      { error: 'Failed to serve manifest' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}