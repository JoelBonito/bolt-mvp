import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const runtime = "edge";
export async function GET(){
  const [s,q,a,p] = await Promise.all([
    supabase.from("simulations").select("*").order("created_at",{ascending:false}),
    supabase.from("quotes").select("*").order("created_at",{ascending:false}),
    supabase.from("appointments").select("*").order("created_at",{ascending:false}),
    supabase.from("payments").select("*").order("created_at",{ascending:false}),
  ]);
  return NextResponse.json({ simulations: s.data||[], quotes: q.data||[], appointments: a.data||[], payments: p.data||[] });
}
