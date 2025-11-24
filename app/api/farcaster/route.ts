import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

    const manifest = {
      accountAssociation: {
        header: "minikit-manifest",
        payload: "eyJhY2NvdW50QXNzb2NpYXRpb24iOnsic2lnbmF0dXJlIjoiIiwicGF5bG9hZCI6IiJ9fQ",
        signature: ""
      }
    };

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving farcaster manifest:', error);
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