import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MLOps Metrics Dashboard',
  description: 'Real-time model performance metrics and analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
