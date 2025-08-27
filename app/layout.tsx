import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Content Protection Quiz - Takedown.co',
  description: 'Check how much you can recover and protect your content from theft.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
