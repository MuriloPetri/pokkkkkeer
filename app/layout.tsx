import Script from "next/script";
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Treinador de Poker - Tabelas de Ranges Preflop",
  description: "Treine suas decisoes de poker preflop com tabelas de ranges interativas.",
  manifest: "/manifest.json",
  themeColor: "#052e16",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PokerTrainer",
  },
  formatDetection: {
    telephone: false,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* AdSense Standard Tag */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3080260484619889"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-sans antialiased">

        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
        <footer className="mt-20 p-6 text-center text-sm border-t">
          <div className="space-x-4">
            <a href="/"> Inicio</a>
            <a href="/sobre">Sobre</a>
            <a href="/politica-de-privacidade">Política de Privacidade</a>
            <a href="/termos-de-uso">Termos de Uso</a>
            <a href="/contato">Contato</a>
          </div>
        </footer>
      </body>
    </html>
  )
}