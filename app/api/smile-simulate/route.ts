import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SMILE_PROMPT } from "@/utils/prompt";
import { assertPngHasAlpha } from "@/utils/mask";
import { uploadPublicPNG, supabase } from "@/lib/supabase";
export const runtime = "edge";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
export async function POST(req: Request){
  try{
    const form = await req.formData();
    const photo = form.get("photo") as File;
    const mask = form.get("mask") as File | null;
    const patientName = (form.get("patientName") as string) || "Paciente";
    if (!photo) return NextResponse.json({ error: "Envie a foto" }, { status: 400 });
    if (mask) await assertPngHasAlpha(mask);
    const content: any[] = [
      { type: "input_text", text: SMILE_PROMPT },
      { type: "input_image", image_data: await photo.arrayBuffer(), media_type: photo.type },
    ];
    if (mask) content.push({ type: "input_image", image_data: await mask.arrayBuffer(), media_type: mask.type });
    const response = await client.responses.create({
      model: "gpt-image-1",
      input: [{ role: "user", content }],
      tools: [{ type: "image_generation" }],
    });
    const blocks: any[] = (response as any).output?.[0]?.content || [];
    const imgBlock = blocks.find((c) => c.type === "output_image");
    if (!imgBlock?.image_base64) throw new Error("Sem imagem no retorno");
    const buffer = Buffer.from(imgBlock.image_base64, "base64");
    const afterUrl = await uploadPublicPNG(buffer, "simulacao");
    await supabase.from("simulations").insert({ patient_name: patientName, before_url: null, after_url: afterUrl });
    return NextResponse.json({ afterUrl });
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
