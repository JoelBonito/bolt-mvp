export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ 
        fontFamily: "system-ui, sans-serif",
        margin: 0,
        padding: "20px",
        backgroundColor: "#f5f5f5"
      }}>
        {children}
      </body>
    </html>
  )
}