import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const runtime = "edge";
const stripe = new Stripe(process.env.STRIPE_KEY!, { apiVersion: "2024-06-20" });
export async function POST(req: Request){
  const { amountBRL, description, customerEmail, quoteId } = await req.json();
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amountBRL * 100), currency: "brl",
    payment_method_types: ["pix"], description, receipt_email: customerEmail
  });
  await supabase.from("payments").insert({ quote_id: quoteId || null, client_secret: intent.client_secret, amount: amountBRL, status: intent.status, currency: "BRL" });
  return NextResponse.json({ clientSecret: intent.client_secret });
}
