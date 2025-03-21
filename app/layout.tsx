import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'John-StudentRegister Form',
  description: 'John-StudentRegister Form',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
