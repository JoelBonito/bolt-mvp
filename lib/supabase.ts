import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const BUCKET = process.env.SUPABASE_BUCKET || "simulacoes";

export async function uploadPublic(buffer: Buffer, path: string, contentType: string) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: false });
  if (error) throw error;
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
export async function uploadPublicPNG(buffer: Buffer, prefix = "simulacao") {
  return uploadPublic(buffer, `${prefix}/${crypto.randomUUID()}.png`, "image/png");
}
