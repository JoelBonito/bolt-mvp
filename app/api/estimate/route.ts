import { NextResponse } from "next/server";
import { estimatePrice } from "@/utils/pricing";
import { buildBudgetPDF } from "@/lib/pdf";
import { uploadPublic, supabase } from "@/lib/supabase";
export const runtime = "edge";
export async function POST(req: Request){
  const body = await req.json();
  const { patientName, beforeUrl, afterUrl, teethCount, unitPrice, clinicFee, discount } = body;
  const totals = estimatePrice({ teethCount, unitPrice, clinicFee, discount });
  const items = [
    { label: `Facetas (${teethCount} x R$ ${unitPrice.toFixed(2)})`, value: teethCount * unitPrice },
    { label: `Taxa clínica`, value: clinicFee || 0 },
    { label: `Descontos`, value: -(discount || 0) },
  ];
  const pdf = await buildBudgetPDF({ patientName, beforeUrl, afterUrl, items, totals, clinicName: process.env.CLINIC_NAME });
  const url = await uploadPublic(pdf, `quotes/${crypto.randomUUID()}.pdf`, "application/pdf");
  const { data } = await supabase.from("quotes").insert({
    teeth_count: teethCount, unit_price: unitPrice, clinic_fee: clinicFee, discount,
    subtotal: totals.subtotal, total: totals.total, pdf_url: url
  }).select("id").single();
  return NextResponse.json({ url, quoteId: data?.id, totals, items });
}
