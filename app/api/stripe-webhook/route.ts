import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const runtime = "edge";
const stripe = new Stripe(process.env.STRIPE_KEY!, { apiVersion: "2024-06-20" });
export async function POST(req: Request){
  const sig=(await headers()).get("stripe-signature");
  const raw=await req.text();
  try{
    const evt=stripe.webhooks.constructEvent(raw, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    if(evt.type==="payment_intent.succeeded"){
      const pi=evt.data.object as Stripe.PaymentIntent;
      await supabase.from("payments").update({ status: pi.status }).eq("client_secret", pi.client_secret as string);
      const { data: pay } = await supabase.from("payments").select("quote_id").eq("client_secret", pi.client_secret as string).single();
      if(pay?.quote_id){ await supabase.from("quotes").update({ status: "paid" }).eq("id", pay.quote_id); }
    }
    return NextResponse.json({ received: true });
  }catch(e:any){
    return new Response(`Webhook error: ${e.message}`, { status: 400 });
  }
}
