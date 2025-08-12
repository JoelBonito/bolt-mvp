import { NextResponse } from "next/server";
import { buildTechReportPDF } from "@/lib/pdf";
import { uploadPublic, supabase } from "@/lib/supabase";
export const runtime = "edge";
export async function POST(req: Request){
  const body = await req.json();
  const { patientName, beforeUrl, afterUrl, params, simulationId } = body;
  const pdf = await buildTechReportPDF({ patientName, beforeUrl, afterUrl, params, clinicName: process.env.CLINIC_NAME });
  const url = await uploadPublic(pdf, `reports/${crypto.randomUUID()}.pdf`, "application/pdf");
  await supabase.from("reports").insert({ simulation_id: simulationId || null, pdf_url: url });
  return NextResponse.json({ url });
}
