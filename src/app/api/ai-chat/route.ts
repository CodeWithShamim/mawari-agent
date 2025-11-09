import { NextRequest, NextResponse } from 'next/server';

// Direct OpenRouter integration for real AI responses
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = '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';

const MAWARI_SYSTEM_PROMPT = `You are an expert AI assistant for Mawari Network, a revolutionary platform that powers real-time streaming of immersive, AI-powered experiences globally with near-zero latency.

Key information about Mawari Network:
- Mawari delivers embodied AI through a global network of distributed nodes
- Achieves 80% bandwidth reduction while maintaining 99.9% uptime for XR content streaming
- Uses DePIN (Decentralized Physical Infrastructure Networks) principles
- Focuses on XR streaming, AI-powered experiences, and immersive internet infrastructure
- Provides ultra-low latency processing for real-time 3D content delivery
- Enables distributed GPU-intensive tasks globally positioned

Your role is to provide expert, informative responses about Mawari Network technology, architecture, use cases, and the broader immersive internet ecosystem. Be helpful, accurate, and engaging in your responses.`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Call OpenRouter API directly for real AI responses
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'Mawari AI Agent',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: MAWARI_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorText);

      // Fallback response if AI call fails
      return NextResponse.json({
        success: false,
        answer: `I apologize, but I'm having trouble connecting to my AI services right now.

However, I can share that Mawari Network is revolutionizing the immersive internet through decentralized infrastructure. Since 2019, they've been delivering embodied AI through a global network that reduces bandwidth usage by 80% while ensuring 99.9% uptime for XR content streaming.

For the most current information about Mawari's technology and developments, please visit mawari.net or check their official documentation.`,
        sources: ['Fallback Response'],
        confidence: 0.5,
        processing_time: 0
      });
    }

    const aiData = await openRouterResponse.json();
    const aiResponse = aiData.choices[0].message.content;

    return NextResponse.json({
      success: true,
      answer: aiResponse,
      sources: ['OpenRouter AI (Claude 3.5 Sonnet)', 'Mawari Network Documentation'],
      confidence: 0.9,
      processing_time: aiData.usage?.total_tokens || 0,
      model_used: aiData.model
    });

  } catch (error) {
    console.error('Error in AI chat endpoint:', error);

    return NextResponse.json({
      success: false,
      answer: 'I apologize, but I encountered an error processing your request. Please try again or visit mawari.net for more information about Mawari Network.',
      sources: ['Error Handler'],
      confidence: 0.3,
      processing_time: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}