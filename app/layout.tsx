import Script from "next/script";
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Treinador de Poker - Tabelas de Ranges Preflop',
  description: 'Treine suas decisoes de poker preflop com tabelas de ranges interativas.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        
        {/* AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3080260484619889"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {children}
        <Analytics />
      </body>
    </html>
  )
}