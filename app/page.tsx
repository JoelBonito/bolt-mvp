export default function Page() {
  return (
    <main style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>
        🦷 MVP Odonto - Simulação de Facetas
      </h1>
      
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "6px",
        marginBottom: "20px"
      }}>
        <h2 style={{ color: "#666", fontSize: "18px" }}>Sistema Funcionando!</h2>
        <p style={{ color: "#666", lineHeight: "1.5" }}>
          Esta é uma versão simplificada do MVP de simulação de facetas dentárias.
          O sistema está rodando corretamente no Next.js.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gap: "15px",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
      }}>
        <div style={{ 
          padding: "15px", 
          border: "2px dashed #ddd", 
          borderRadius: "6px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>1. Upload da Foto</h3>
          <p style={{ margin: 0, color: "#777", fontSize: "14px" }}>
            Envie a foto do sorriso do paciente
          </p>
        </div>

        <div style={{ 
          padding: "15px", 
          border: "2px dashed #ddd", 
          borderRadius: "6px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>2. Simulação IA</h3>
          <p style={{ margin: 0, color: "#777", fontSize: "14px" }}>
            IA gera simulação com facetas
          </p>
        </div>

        <div style={{ 
          padding: "15px", 
          border: "2px dashed #ddd", 
          borderRadius: "6px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>3. Orçamento</h3>
          <p style={{ margin: 0, color: "#777", fontSize: "14px" }}>
            Gera PDF com orçamento detalhado
          </p>
        </div>
      </div>

      <div style={{ 
        marginTop: "30px", 
        padding: "20px", 
        backgroundColor: "#e8f5e8", 
        borderRadius: "6px",
        border: "1px solid #c3e6c3"
      }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#2d5a2d" }}>✅ Status do Sistema</h3>
        <p style={{ margin: 0, color: "#2d5a2d" }}>
          Next.js rodando na porta 5173 - Sistema operacional!
        </p>
      </div>
    </main>
  )
}