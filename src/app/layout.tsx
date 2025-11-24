import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mawari AI Agent - Your Gateway to the Immersive Internet',
  description: 'AI-powered assistant for Mawari Network - Real-time streaming of immersive, AI-powered experiences globally with near-zero latency.',
  keywords: 'Mawari, AI, XR, Web3, Immersive Internet, Decentralized Network',
  authors: [{ name: 'Mawari AI Agent' }],
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'fc:miniapp': 'true',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Base MiniApp SDK will be loaded here when available */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Base MiniApp when available
              if (typeof window !== 'undefined' && window.minikit) {
                window.minikit.ready().then(() => {
                  console.log('✅ Base MiniApp initialized');
                }).catch(err => {
                  console.error('❌ Base MiniApp initialization failed:', err);
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </body>
    </html>
  )
}