import { Inter } from 'next/font/google'

import './globals.css'
import { RootProviders } from './providers'
import { NavigationBar } from './components/navigation-bar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen pb-5 dark">
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
