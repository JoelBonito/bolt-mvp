// Estado global da aplicação
let currentSimulation = {
  patientName: '',
  originalPhoto: null,
  simulationResult: null,
  simulationId: null
};

// Configuração da API (simulada para demo)
const API_CONFIG = {
  supabaseUrl: 'https://demo.supabase.co',
  openaiKey: 'demo-key'
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  showStatusMessage('Sistema carregado e pronto para uso!', 'info');
});

function setupEventListeners() {
  // Upload de foto
  const photoInput = document.getElementById('photoInput');
  const uploadSection = document.getElementById('uploadSection');
  
  photoInput.addEventListener('change', handlePhotoUpload);
  
  // Drag and drop
  uploadSection.addEventListener('dragover', handleDragOver);
  uploadSection.addEventListener('dragleave', handleDragLeave);
  uploadSection.addEventListener('drop', handleDrop);
  
  // Nome do paciente
  document.getElementById('patientName').addEventListener('input', function(e) {
    currentSimulation.patientName = e.target.value;
    updateSimulateButton();
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processPhotoFile(files[0]);
  }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (file) {
    processPhotoFile(file);
  }
}

function processPhotoFile(file) {
  if (!file.type.startsWith('image/')) {
    showStatusMessage('Por favor, selecione um arquivo de imagem válido.', 'error');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    showStatusMessage('A imagem é muito grande. Por favor, use uma imagem menor que 10MB.', 'error');
    return;
  }
  
  currentSimulation.originalPhoto = file;
  
  // Mostrar preview
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('originalPreview').src = e.target.result;
    document.getElementById('previewGrid').style.display = 'grid';
    updateSimulateButton();
    showStatusMessage('Foto carregada com sucesso!', 'success');
  };
  reader.readAsDataURL(file);
}

function updateSimulateButton() {
  const btn = document.getElementById('simulateBtn');
  const hasPhoto = currentSimulation.originalPhoto !== null;
  const hasName = currentSimulation.patientName.trim().length > 0;
  
  btn.disabled = !(hasPhoto && hasName);
}

async function generateSimulation() {
  if (!currentSimulation.originalPhoto || !currentSimulation.patientName) {
    showStatusMessage('Por favor, preencha o nome do paciente e selecione uma foto.', 'error');
    return;
  }
  
  // Mostrar loading
  document.getElementById('loadingDiv').classList.add('show');
  document.getElementById('simulateBtn').disabled = true;
  
  try {
    // Simular chamada para API de IA (OpenAI DALL-E)
    await simulateAPICall(3000); // 3 segundos de simulação
    
    // Para demo, vamos usar a mesma imagem com um filtro visual
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Desenhar imagem original
      ctx.drawImage(img, 0, 0);
      
      // Aplicar um filtro simples para simular as facetas
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Converter para blob e mostrar resultado
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        currentSimulation.simulationResult = url;
        
        document.getElementById('simulationPreview').src = url;
        document.getElementById('simulationPreview').style.display = 'block';
        document.getElementById('simulationPlaceholder').style.display = 'none';
        
        // Mostrar seção de resultados
        document.getElementById('resultsSection').classList.add('show');
        
        // Gerar ID da simulação
        currentSimulation.simulationId = 'sim_' + Date.now();
        
        showStatusMessage('Simulação gerada com sucesso!', 'success');
      });
    };
    
    img.src = document.getElementById('originalPreview').src;
    
  } catch (error) {
    showStatusMessage('Erro ao gerar simulação: ' + error.message, 'error');
  } finally {
    document.getElementById('loadingDiv').classList.remove('show');
    document.getElementById('simulateBtn').disabled = false;
  }
}

async function generateBudget() {
  if (!currentSimulation.simulationResult) {
    showStatusMessage('Gere uma simulação primeiro.', 'error');
    return;
  }
  
  showStatusMessage('Gerando orçamento...', 'info');
  
  try {
    await simulateAPICall(1500);
    
    // Simular geração de PDF
    const budgetData = {
      patientName: currentSimulation.patientName,
      items: [
        { label: 'Facetas em Resina Composta (4 dentes)', value: 2400.00 },
        { label: 'Consulta e Planejamento', value: 200.00 },
        { label: 'Moldagem Digital', value: 150.00 }
      ],
      subtotal: 2750.00,
      discount: 275.00,
      total: 2475.00
    };
    
    // Simular download do PDF
    const pdfBlob = await generateMockPDF('orçamento', budgetData);
    downloadFile(pdfBlob, `orcamento_${currentSimulation.patientName.replace(/\s+/g, '_')}.pdf`);
    
    showStatusMessage('Orçamento gerado e baixado com sucesso!', 'success');
    
  } catch (error) {
    showStatusMessage('Erro ao gerar orçamento: ' + error.message, 'error');
  }
}

async function generateReport() {
  if (!currentSimulation.simulationResult) {
    showStatusMessage('Gere uma simulação primeiro.', 'error');
    return;
  }
  
  showStatusMessage('Gerando relatório técnico...', 'info');
  
  try {
    await simulateAPICall(1500);
    
    const reportData = {
      patientName: currentSimulation.patientName,
      procedure: 'Facetas Dentárias em Resina Composta',
      material: 'Resina BL3',
      technique: 'Estratificada com bordas incisais translúcidas',
      teeth: '12, 11, 21, 22',
      observations: 'Preservação de gengiva, lábios e tecidos adjacentes'
    };
    
    const pdfBlob = await generateMockPDF('relatório', reportData);
    downloadFile(pdfBlob, `relatorio_tecnico_${currentSimulation.patientName.replace(/\s+/g, '_')}.pdf`);
    
    showStatusMessage('Relatório técnico gerado e baixado com sucesso!', 'success');
    
  } catch (error) {
    showStatusMessage('Erro ao gerar relatório: ' + error.message, 'error');
  }
}

async function processPayment() {
  if (!currentSimulation.simulationResult) {
    showStatusMessage('Gere uma simulação primeiro.', 'error');
    return;
  }
  
  showStatusMessage('Processando pagamento via Pix...', 'info');
  
  try {
    await simulateAPICall(2000);
    
    // Simular geração de QR Code Pix
    const pixData = {
      amount: 2475.00,
      description: `Facetas dentárias - ${currentSimulation.patientName}`,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };
    
    // Mostrar modal de pagamento (simulado)
    alert(`Pagamento Pix gerado!\n\nValor: R$ ${pixData.amount.toFixed(2)}\nDescrição: ${pixData.description}\n\nEm um sistema real, aqui seria exibido o QR Code para pagamento.`);
    
    showStatusMessage('QR Code Pix gerado com sucesso! Aguardando pagamento...', 'success');
    
    // Simular confirmação de pagamento após alguns segundos
    setTimeout(() => {
      showStatusMessage('Pagamento confirmado! Agendamento disponível.', 'success');
    }, 5000);
    
  } catch (error) {
    showStatusMessage('Erro ao processar pagamento: ' + error.message, 'error');
  }
}

// Funções auxiliares
async function simulateAPICall(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function generateMockPDF(type, data) {
  // Simular geração de PDF
  const content = `
    ${type.toUpperCase()} - ${data.patientName}
    
    ${type === 'orçamento' ? 
      `Itens:\n${data.items.map(item => `• ${item.label}: R$ ${item.value.toFixed(2)}`).join('\n')}\n\nTotal: R$ ${data.total.toFixed(2)}` :
      `Procedimento: ${data.procedure}\nMaterial: ${data.material}\nTécnica: ${data.technique}\nDentes: ${data.teeth}\nObservações: ${data.observations}`
    }
  `;
  
  return new Blob([content], { type: 'application/pdf' });
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showStatusMessage(message, type) {
  const container = document.getElementById('statusMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `status-message status-${type}`;
  messageDiv.textContent = message;
  
  container.appendChild(messageDiv);
  
  // Remover mensagem após 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

// Exportar funções para uso global
window.generateSimulation = generateSimulation;
window.generateBudget = generateBudget;
window.generateReport = generateReport;
window.processPayment = processPayment;