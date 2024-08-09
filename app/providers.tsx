'use client'

import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

export function RootProviders({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter()

  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
}
