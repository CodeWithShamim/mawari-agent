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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </body>
    </html>
  )
}