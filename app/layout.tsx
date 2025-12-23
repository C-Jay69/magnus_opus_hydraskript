import './globals.css'

export const metadata = {
  title: 'Magnus Opus Hydraskript - AI eBook Generator',
  description: 'Stop writing. Start publishing. Transform your ideas into finished books with HydraSkript.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
