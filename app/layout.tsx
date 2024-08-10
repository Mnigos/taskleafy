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
      <body className="dark min-h-screen">
        <RootProviders>
          <NavigationBar />
          {children}
        </RootProviders>
      </body>
    </html>
  )
}
