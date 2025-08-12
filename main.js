// Estado global da aplicação
let currentSimulation = {
  patientName: '',
  originalPhoto: null,
  simulationResult: null,
  simulationId: null
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
    showStatusMessage('Processando simulação com IA...', 'info');
    
    // Converter imagem para base64
    const formData = new FormData();
    formData.append('image', currentSimulation.originalPhoto);
    formData.append('patientName', currentSimulation.patientName);
    formData.append('prompt', 'Aplique facetas dentárias em resina composta BL3. Mantenha bordas incisais translúcidas nos dentes 12,11,21,22. Preserve gengiva, lábios, expressão e proporções faciais.');
    
    console.log('Enviando para N8N webhook...');
    
    // URL do webhook N8N (você precisa configurar)
    const N8N_WEBHOOK_URL = 'https://seu-n8n.com/webhook/facetas-simulation';
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API N8N: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Resposta do N8N:', result);
    
    if (!result.simulatedImageUrl) {
      throw new Error('N8N não retornou imagem simulada');
    }
    
    currentSimulation.simulationResult = result.simulatedImageUrl;
    
    console.log('Simulação recebida do N8N, atualizando interface...');
    
    // Mostrar resultado
    const simulationPreview = document.getElementById('simulationPreview');
    const placeholder = document.getElementById('simulationPlaceholder');
    
    if (simulationPreview && placeholder) {
      simulationPreview.src = currentSimulation.simulationResult;
      simulationPreview.style.display = 'block';
      placeholder.style.display = 'none';
      
      // Mostrar seção de resultados
      document.getElementById('resultsSection').classList.add('show');
      
      // Gerar ID da simulação
      currentSimulation.simulationId = 'sim_' + Date.now();
      
      showStatusMessage('✨ Simulação concluída com IA real! Facetas aplicadas com sucesso.', 'success');
      console.log('Interface atualizada com sucesso!');
    } else {
      throw new Error('Elementos da interface não encontrados');
    }
    
  } catch (error) {
    console.error('Erro na simulação:', error);
    
    // Se N8N falhar, usar simulação local como fallback
    if (error.message.includes('N8N') || error.message.includes('fetch')) {
      showStatusMessage('N8N indisponível. Usando simulação local...', 'info');
      await generateLocalSimulation();
    } else {
      showStatusMessage('Erro ao gerar simulação: ' + error.message, 'error');
    }
  } finally {
    document.getElementById('loadingDiv').classList.remove('show');
    document.getElementById('simulateBtn').disabled = false;
  }
}

// Função de fallback para simulação local
async function generateLocalSimulation() {
  try {
    // Obter a imagem original
    const originalImg = document.getElementById('originalPreview');
    
    if (!originalImg || !originalImg.src) {
      throw new Error('Imagem original não encontrada');
    }
    
    // Criar canvas para processamento
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Criar nova imagem
    const img = new Image();
    
    const imageLoadPromise = new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = originalImg.src;
    });
    
    await imageLoadPromise;
    
    // Configurar canvas
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Desenhar imagem original
    ctx.drawImage(img, 0, 0);
    
    // Aplicar efeito sutil de clareamento
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.65;
    const radiusX = canvas.width * 0.12;
    const radiusY = canvas.height * 0.04;
    
    // Salvar estado
    ctx.save();
    
    // Criar gradiente radial
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radiusX
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Aplicar blend mode suave
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = gradient;
    
    // Desenhar elipse na região dos dentes
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Restaurar estado
    ctx.restore();
    
    // Converter para data URL
    const dataURL = canvas.toDataURL('image/png', 0.95);
    currentSimulation.simulationResult = dataURL;
    
    // Mostrar resultado
    const simulationPreview = document.getElementById('simulationPreview');
    const placeholder = document.getElementById('simulationPlaceholder');
    
    simulationPreview.src = dataURL;
    simulationPreview.style.display = 'block';
    placeholder.style.display = 'none';
    
    document.getElementById('resultsSection').classList.add('show');
    currentSimulation.simulationId = 'sim_' + Date.now();
    
    showStatusMessage('✨ Simulação local concluída! (Configure N8N para IA real)', 'success');
    
  } catch (error) {
    throw new Error('Erro na simulação local: ' + error.message);
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
    
    // Importar PDF-lib dinamicamente
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    
    // Criar documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Título
    page.drawText('ORÇAMENTO - FACETAS DENTÁRIAS', {
      x: 50,
      y: 800,
      size: 18,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    // Dados do paciente
    page.drawText(`Paciente: ${currentSimulation.patientName}`, {
      x: 50,
      y: 770,
      size: 12,
      font: font
    });
    
    page.drawText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, {
      x: 50,
      y: 750,
      size: 12,
      font: font
    });
    
    // Linha separadora
    page.drawLine({
      start: { x: 50, y: 730 },
      end: { x: 545, y: 730 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    
    // Itens do orçamento
    let yPosition = 700;
    
    page.drawText('ITENS DO TRATAMENTO:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    const items = [
      { desc: 'Facetas em Resina Composta BL3 (4 dentes)', qty: 4, unit: 600.00, total: 2400.00 },
      { desc: 'Consulta e Planejamento Digital', qty: 1, unit: 200.00, total: 200.00 },
      { desc: 'Moldagem e Prova', qty: 1, unit: 150.00, total: 150.00 }
    ];
    
    yPosition -= 30;
    
    // Cabeçalho da tabela
    page.drawText('Descrição', { x: 50, y: yPosition, size: 10, font: boldFont });
    page.drawText('Qtd', { x: 350, y: yPosition, size: 10, font: boldFont });
    page.drawText('Unit.', { x: 400, y: yPosition, size: 10, font: boldFont });
    page.drawText('Total', { x: 480, y: yPosition, size: 10, font: boldFont });
    
    yPosition -= 20;
    
    // Itens
    items.forEach(item => {
      page.drawText(item.desc, { x: 50, y: yPosition, size: 10, font: font });
      page.drawText(item.qty.toString(), { x: 350, y: yPosition, size: 10, font: font });
      page.drawText(`R$ ${item.unit.toFixed(2)}`, { x: 400, y: yPosition, size: 10, font: font });
      page.drawText(`R$ ${item.total.toFixed(2)}`, { x: 480, y: yPosition, size: 10, font: font });
      yPosition -= 20;
    });
    
    // Totais
    yPosition -= 20;
    const subtotal = 2750.00;
    const discount = 275.00;
    const total = 2475.00;
    
    page.drawLine({
      start: { x: 350, y: yPosition + 10 },
      end: { x: 545, y: yPosition + 10 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    
    page.drawText('Subtotal:', { x: 400, y: yPosition, size: 12, font: boldFont });
    page.drawText(`R$ ${subtotal.toFixed(2)}`, { x: 480, y: yPosition, size: 12, font: font });
    
    yPosition -= 20;
    page.drawText('Desconto (10%):', { x: 400, y: yPosition, size: 12, font: font });
    page.drawText(`- R$ ${discount.toFixed(2)}`, { x: 480, y: yPosition, size: 12, font: font });
    
    yPosition -= 25;
    page.drawText('TOTAL:', { x: 400, y: yPosition, size: 14, font: boldFont });
    page.drawText(`R$ ${total.toFixed(2)}`, { x: 480, y: yPosition, size: 14, font: boldFont });
    
    // Observações
    yPosition -= 60;
    page.drawText('OBSERVAÇÕES:', { x: 50, y: yPosition, size: 12, font: boldFont });
    yPosition -= 20;
    
    const observations = [
      '• Material: Resina composta BL3 de alta qualidade',
      '• Técnica: Estratificada com bordas incisais translúcidas',
      '• Garantia: 2 anos para o tratamento',
      '• Forma de pagamento: À vista, cartão ou Pix',
      '• Validade do orçamento: 30 dias'
    ];
    
    observations.forEach(obs => {
      page.drawText(obs, { x: 50, y: yPosition, size: 10, font: font });
      yPosition -= 15;
    });
    
    // Gerar PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Download
    const filename = `orcamento_${currentSimulation.patientName.replace(/\s+/g, '_')}.pdf`;
    downloadFile(blob, filename);
    
    showStatusMessage('Orçamento gerado e baixado com sucesso!', 'success');
    
  } catch (error) {
    console.error('Erro ao gerar orçamento:', error);
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
    
    // Importar PDF-lib dinamicamente
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    
    // Criar documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Título
    page.drawText('RELATÓRIO TÉCNICO - FACETAS DENTÁRIAS', {
      x: 50,
      y: 800,
      size: 16,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    // Dados do paciente
    page.drawText(`Paciente: ${currentSimulation.patientName}`, {
      x: 50,
      y: 770,
      size: 12,
      font: font
    });
    
    page.drawText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, {
      x: 50,
      y: 750,
      size: 12,
      font: font
    });
    
    page.drawText(`ID da Simulação: ${currentSimulation.simulationId}`, {
      x: 50,
      y: 730,
      size: 12,
      font: font
    });
    
    // Linha separadora
    page.drawLine({
      start: { x: 50, y: 710 },
      end: { x: 545, y: 710 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    
    let yPosition = 680;
    
    // Procedimento
    page.drawText('PROCEDIMENTO REALIZADO:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    yPosition -= 25;
    page.drawText('Simulação digital de facetas dentárias em resina composta', {
      x: 50,
      y: yPosition,
      size: 12,
      font: font
    });
    
    // Especificações técnicas
    yPosition -= 40;
    page.drawText('ESPECIFICAÇÕES TÉCNICAS:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    const specs = [
      'Material: Resina composta BL3',
      'Técnica: Estratificada com bordas incisais translúcidas',
      'Dentes tratados: 12, 11, 21, 22 (incisivos centrais e laterais superiores)',
      'Espessura média: 0,5 a 1,0mm',
      'Cor final: BL3 (Bleach 3 - tom clareado natural)',
      'Acabamento: Polimento com discos e pastas diamantadas'
    ];
    
    yPosition -= 25;
    specs.forEach(spec => {
      page.drawText(`• ${spec}`, {
        x: 50,
        y: yPosition,
        size: 11,
        font: font
      });
      yPosition -= 18;
    });
    
    // Regiões preservadas
    yPosition -= 20;
    page.drawText('REGIÕES PRESERVADAS:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    const preserved = [
      'Gengiva e tecidos periodontais',
      'Lábios e comissuras labiais',
      'Estrutura facial e proporções',
      'Expressão natural do sorriso',
      'Oclusão e função mastigatória'
    ];
    
    yPosition -= 25;
    preserved.forEach(item => {
      page.drawText(`• ${item}`, {
        x: 50,
        y: yPosition,
        size: 11,
        font: font
      });
      yPosition -= 18;
    });
    
    // Observações clínicas
    yPosition -= 20;
    page.drawText('OBSERVAÇÕES CLÍNICAS:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    const observations = [
      'Simulação realizada com tecnologia de IA avançada',
      'Resultado baseado em parâmetros clínicos reais',
      'Preservação da naturalidade e harmonia facial',
      'Técnica minimamente invasiva',
      'Resultado final pode variar conforme condições clínicas'
    ];
    
    yPosition -= 25;
    observations.forEach(obs => {
      page.drawText(`• ${obs}`, {
        x: 50,
        y: yPosition,
        size: 11,
        font: font
      });
      yPosition -= 18;
    });
    
    // Rodapé
    page.drawText('Relatório gerado automaticamente pelo sistema MVP Odonto', {
      x: 50,
      y: 50,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    // Gerar PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Download
    const filename = `relatorio_tecnico_${currentSimulation.patientName.replace(/\s+/g, '_')}.pdf`;
    downloadFile(blob, filename);
    
    showStatusMessage('Relatório técnico gerado e baixado com sucesso!', 'success');
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
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
    
    // Simular dados do Pix
    const pixData = {
      amount: 2475.00,
      description: `Facetas dentárias - ${currentSimulation.patientName}`,
      pixKey: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000',
      qrCode: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };
    
    // Criar modal de pagamento
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; text-align: center;">
        <h3 style="margin-bottom: 20px; color: #2c3e50;">Pagamento Pix</h3>
        <p><strong>Valor:</strong> R$ ${pixData.amount.toFixed(2)}</p>
        <p><strong>Descrição:</strong> ${pixData.description}</p>
        <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <p style="font-size: 12px; color: #666;">Chave Pix (simulada):</p>
          <code style="font-size: 10px; word-break: break-all;">${pixData.pixKey}</code>
        </div>
        <p style="color: #28a745; margin: 15px 0;">✅ QR Code gerado com sucesso!</p>
        <p style="font-size: 12px; color: #666;">Em um sistema real, aqui apareceria o QR Code para pagamento.</p>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; cursor: pointer;">
          Fechar
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    showStatusMessage('QR Code Pix gerado com sucesso! Aguardando pagamento...', 'success');
    
    // Simular confirmação de pagamento
    setTimeout(() => {
      showStatusMessage('✅ Pagamento confirmado! Agendamento liberado.', 'success');
    }, 8000);
    
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    showStatusMessage('Erro ao processar pagamento: ' + error.message, 'error');
  }
}

// Funções auxiliares
async function simulateAPICall(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
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