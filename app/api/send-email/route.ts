import { Resend } from "resend";
export const runtime = "edge";
export async function POST(req: Request){
  const { to, subject, html, attachmentBase64, filename = "documento.pdf" } = await req.json();
  const resend = new Resend(process.env.RESEND_KEY!);
  const attachments = attachmentBase64 ? [{ content: attachmentBase64, filename }] : [];
  const out = await resend.emails.send({ from: "odontomvp@yourapp.dev", to, subject, html, attachments });
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
}
