import { PDFDocument, StandardFonts } from "pdf-lib";

export async function buildBudgetPDF({ clinicName = "Clínica Odonto", patientName, beforeUrl, afterUrl, items, totals }: any) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.setFont(font);
  page.setFontSize(18); page.drawText(`${clinicName} – Orçamento de Facetas`, { x: 50, y: 800 });
  page.setFontSize(12); page.drawText(`Paciente: ${patientName}`, { x: 50, y: 780 });
  let y = 750; page.drawText("Itens:", { x: 50, y }); y -= 16;
  items.forEach((it: any) => { page.drawText(`• ${it.label}: R$ ${it.value.toFixed(2)}`, { x: 60, y }); y -= 14; });
  y -= 10; page.drawText(`Subtotal: R$ ${totals.subtotal.toFixed(2)}`, { x: 50, y }); y -= 14; page.drawText(`Total: R$ ${totals.total.toFixed(2)}`, { x: 50, y });
  const pdfBytes = await doc.save(); return Buffer.from(pdfBytes);
}

export async function buildTechReportPDF({ clinicName = "Clínica Odonto", patientName, beforeUrl, afterUrl, params }: any) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.setFont(font);
  page.setFontSize(18); page.drawText(`${clinicName} – Relatório Técnico`, { x: 50, y: 800 });
  page.setFontSize(12); page.drawText(`Paciente: ${patientName}`, { x: 50, y: 780 });
  const lines = [ `Material: Resina composta BL3`, `Técnica: Estratificada (bordas incisais translúcidas nos dentes 12,11,21,22)`, `Regiões preservadas: gengiva, lábios e tecidos adjacentes`, `Observações: ${params?.notes || "—"}` ];
  let y = 750; lines.forEach((t) => { page.drawText(`• ${t}`, { x: 50, y }); y -= 14; });
  const pdfBytes = await doc.save(); return Buffer.from(pdfBytes);
}
