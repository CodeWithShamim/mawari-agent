import { NextRequest, NextResponse } from 'next/server';
import { minikitConfig } from '../../../minikit.config';

export async function GET(request: NextRequest) {
  try {
    const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

    const miniappManifest = {
      ...minikitConfig.miniapp,
      homeUrl: `${rootUrl}`,
      webhookUrl: `${rootUrl}/api/webhook`,
      screenshotUrls: [`${rootUrl}/screenshot-portrait.png`],
      iconUrl: `${rootUrl}/blue-icon.png`,
      splashImageUrl: `${rootUrl}/blue-hero.jpg`,
      heroImageUrl: `${rootUrl}/blue-hero.jpg`,
      ogImageUrl: `${rootUrl}/blue-hero.jpg`,
    };

    return NextResponse.json(miniappManifest, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving minikit manifest:', error);
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}