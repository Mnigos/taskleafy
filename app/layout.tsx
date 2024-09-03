import { Inter } from 'next/font/google'

import './globals.css'
import type { Metadata, Viewport } from 'next'

import { RootProviders } from './providers'
import { NavigationBar } from './components/navigation-bar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'TaskLeafy',
  description: 'Simple to do app with drag and drop functionality.',
  applicationName: 'TaskLeafy',
  creator: 'Mnigos',
  icons: [
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
      color: '#00ff10',
    },
  ],
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background pb-5 dark">
        <RootProviders>
          <NavigationBar />
          <div className="flex min-h-screen justify-center">
            <main className="w-full max-w-[1024px] px-2">{children}</main>
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
