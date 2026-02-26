import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Poker Range Trainer - Aprenda Ranges Preflop de Poker',
    template: '%s | Poker Range Trainer',
  },
  description: 'Ferramenta gratuita para estudar e treinar ranges de poker preflop. Tabelas interativas para 6-Max, 9-Max e Heads-Up. Melhore suas decisoes preflop com exercicios praticos.',
  keywords: ['poker', 'ranges', 'preflop', 'treinamento', 'poker range', 'tabela de ranges', '6-max', '9-max', 'heads-up', 'estrategia poker', 'RFI', '3-bet'],
  authors: [{ name: 'Poker Range Trainer' }],
  openGraph: {
    title: 'Poker Range Trainer - Aprenda Ranges Preflop de Poker',
    description: 'Ferramenta gratuita para estudar e treinar ranges de poker preflop. Tabelas interativas para 6-Max, 9-Max e Heads-Up.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Poker Range Trainer',
  },
}

export const viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3080260484619889"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
