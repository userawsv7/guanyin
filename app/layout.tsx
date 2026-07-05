export const metadata = {
  title: 'Guanyin  | Universal Technical Reasoning Engine',
  description: 'Evidence-first, domain-agnostic technical knowledge and forensic analysis platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0b0d13', color: '#c9d1d9', fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  )
}
