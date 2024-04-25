import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { Archivo } from 'next/font/google'
import { cn } from '@/lib/utils'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("antialiased bg-background text-primary ", archivo.className)}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}