import { ReactNode } from 'react'

export const metadata = {
  title: 'MVP Odonto - Simulação de Facetas',
  description: 'Sistema completo para simulação de facetas dentárias',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        fontFamily: "system-ui, -apple-system, sans-serif",
        margin: 0,
        padding: 0,
        backgroundColor: "#f5f5f5"
      }}>
        {children}
      </body>
    </html>
  )
}