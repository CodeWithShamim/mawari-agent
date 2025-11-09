import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/health');

    if (!response.ok) {
      throw new Error(`ROMA health check failed: ${response.statusText}`);
    }

    const data = await response.json();

    console.log({data});

    return NextResponse.json({
      success: true,
      status: data.status,
      version: data.version,
      connected: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ROMA connectivity check failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connected: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}