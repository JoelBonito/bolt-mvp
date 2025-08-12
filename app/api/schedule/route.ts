import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const runtime = "edge";
function ics({ startISO, durationMin, title, description, location }: any){
  const dt=new Date(startISO); const pad=(n:number)=>String(n).padStart(2,"0");
  const fmt=(d:Date)=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end=new Date(dt.getTime()+durationMin*60000);
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MVP//Odonto//PT-BR
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${fmt(new Date())}
DTSTART:${fmt(dt)}
DTEND:${fmt(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location||"Clínica"}
END:VEVENT
END:VCALENDAR`;
}
export async function POST(req: Request){
  const body=await req.json(); const file=ics(body);
  const { data, error } = await supabase.from("appointments").insert({
    simulation_id: body.simulationId || null, starts_at: body.startISO, duration_min: body.durationMin, ics_url: null
  }).select("id").single();
  if(error) return new Response("Erro ao salvar agendamento", { status: 500 });
  return new Response(file, { headers: { "Content-Type": "text/calendar", "X-Appointment-Id": data!.id } });
}
