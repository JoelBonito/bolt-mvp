"use client";
import { useState } from "react";
export default function Page(){
  const [afterUrl,setAfterUrl]=useState<string|null>(null);
  const [beforeUrl,setBeforeUrl]=useState<string|null>(null);
  const [budgetUrl,setBudgetUrl]=useState<string|null>(null);
  const [reportUrl,setReportUrl]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const [teethCount,setTeethCount]=useState(8);
  const [unitPrice,setUnitPrice]=useState(1200);
  const [clinicFee,setClinicFee]=useState(300);
  const [discount,setDiscount]=useState(0);
  const [patientName,setPatientName]=useState("Paciente");
  const [patientEmail,setPatientEmail]=useState("");
  const [startISO,setStartISO]=useState("");
  const [durationMin,setDurationMin]=useState(90);
  const [quoteId,setQuoteId]=useState<string|undefined>();

  async function simulate(e:any){ e.preventDefault(); setLoading(true);
    const fd=new FormData(e.currentTarget); const photo=fd.get("photo") as File;
    setBeforeUrl(photo ? URL.createObjectURL(photo) : null);
    const res=await fetch("/api/smile-simulate",{ method:"POST", body: fd});
    const j=await res.json(); if(!res.ok){ alert(j.error||"Falha"); setLoading(false); return; }
    setAfterUrl(j.afterUrl); setLoading(false);
  }
  async function makeBudget(){ if(!afterUrl) return;
    const body={ patientName, beforeUrl, afterUrl, teethCount, unitPrice, clinicFee, discount };
    const res=await fetch("/api/estimate",{ method:"POST", body: JSON.stringify(body)});
    const j=await res.json(); if(!res.ok){ alert(j.error||"Falha orçamento"); return; }
    setBudgetUrl(j.url); setQuoteId(j.quoteId);
  }
  async function makeReport(){ if(!afterUrl) return;
    const body={ patientName, beforeUrl, afterUrl, params:{ notes:"Simulação BL3 – técnica estratificada" } };
    const res=await fetch("/api/report",{ method:"POST", body: JSON.stringify(body)});
    const j=await res.json(); if(!res.ok){ alert(j.error||"Falha relatório"); return; }
    setReportUrl(j.url);
  }
  async function acceptQuote(){ if(!budgetUrl||!patientEmail) return alert("Gere orçamento e informe e-mail");
    const icsRes=await fetch("/api/schedule",{ method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ startISO, durationMin, title:"Procedimento de Facetas", description:`Paciente: ${patientName}`, location:"Clínica" })});
    const icsText=await icsRes.text(); const icsBase64=btoa(unescape(encodeURIComponent(icsText)));
    const amountBRL=unitPrice*teethCount+clinicFee-discount;
    const pixRes=await fetch("/api/create-pix",{ method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ amountBRL, description:`Facetas ${teethCount}x`, customerEmail: patientEmail, quoteId })});
    const pix=await pixRes.json();
    async function toB64(url?:string){ if(!url) return null; const r=await fetch(url); const b=await r.blob(); const buf=await b.arrayBuffer();
      let bin=""; const bytes=new Uint8Array(buf); for(let i=0;i<bytes.byteLength;i++) bin+=String.fromCharCode(bytes[i]); return btoa(bin); }
    const [budgetB64, reportB64]=await Promise.all([toB64(budgetUrl!), toB64(reportUrl!)]);
    const html=`Olá ${patientName}, segue orçamento e relatório. Pix clientSecret: ${pix.clientSecret}`;
    await fetch("/api/send-email",{ method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ to: patientEmail, subject:"Orçamento e Relatório – Facetas", html, attachmentBase64: budgetB64, filename:"orcamento.pdf" })});
    if(reportB64){ await fetch("/api/send-email",{ method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ to: patientEmail, subject:"Relatório Técnico – Facetas", html:"Segue o relatório técnico.", attachmentBase64: reportB64, filename:"relatorio-tecnico.pdf" })}); }
    await fetch("/api/send-email",{ method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ to: patientEmail, subject:"Agendamento – Facetas", html:"Segue o agendamento.", attachmentBase64: icsBase64, filename:"agendamento.ics" })});
    alert("Aceito! E-mails enviados, Pix criado, .ics gerado.");
  }

  return (<main style={{maxWidth:980,margin:"40px auto",padding:16}}>
    <h1>MVP – Simulação, Orçamento, Relatório, E-mail, Agendamento e Pix</h1>
    <form onSubmit={simulate} encType="multipart/form-data" style={{ display:"grid", gap:12 }}>
      <input type="file" name="photo" accept="image/*" required />
      <input type="file" name="mask" accept="image/png" />
      <input type="text" name="patientName" placeholder="Nome do paciente" value={patientName} onChange={e=>setPatientName(e.target.value)} />
      <button type="submit" disabled={loading}>{loading? "Gerando..." : "Simular Facetas"}</button>
    </form>
    <section style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:24 }}>
      {beforeUrl && (<div><h3>Antes</h3><img src={beforeUrl} style={{ width:"100%", borderRadius:8 }} /></div>)}
      {afterUrl && (<div><h3>Depois</h3><img src={afterUrl} style={{ width:"100%", borderRadius:8 }} /></div>)}
    </section>
    <section style={{ marginTop:24, display:"grid", gap:10, gridTemplateColumns:"repeat(4,1fr)" }}>
      <label>Qte. facetas <input type="number" value={teethCount} onChange={e=>setTeethCount(parseInt(e.target.value||"0"))} /></label>
      <label>Preço unit. (R$) <input type="number" value={unitPrice} onChange={e=>setUnitPrice(parseFloat(e.target.value||"0"))} /></label>
      <label>Taxa clínica (R$) <input type="number" value={clinicFee} onChange={e=>setClinicFee(parseFloat(e.target.value||"0"))} /></label>
      <label>Desconto (R$) <input type="number" value={discount} onChange={e=>setDiscount(parseFloat(e.target.value||"0"))} /></label>
    </section>
    <div style={{ marginTop:16, display:"flex", flexWrap:"wrap", gap:12 }}>
      <button onClick={makeBudget} disabled={!afterUrl}>Gerar Orçamento (PDF + URL)</button>
      <button onClick={makeReport} disabled={!afterUrl}>Gerar Relatório Técnico (PDF + URL)</button>
    </div>
    {(budgetUrl || reportUrl) && (<section style={{ marginTop:12 }}>
      {budgetUrl && <p>Orçamento: <a href={budgetUrl} target="_blank">abrir</a></p>}
      {reportUrl && <p>Relatório técnico: <a href={reportUrl} target="_blank">abrir</a></p>}
    </section>)}
    <section style={{ marginTop:24, display:"grid", gap:10, gridTemplateColumns:"1fr 1fr 1fr 1fr" }}>
      <label>E-mail do paciente <input type="email" value={patientEmail} onChange={e=>setPatientEmail(e.target.value)} /></label>
      <label>Início (ISO) <input type="datetime-local" onChange={e=>setStartISO(e.target.value? new Date(e.target.value).toISOString(): "")} /></label>
      <label>Duração (min) <input type="number" value={durationMin} onChange={e=>setDurationMin(parseInt(e.target.value||"0"))} /></label>
      <button onClick={acceptQuote} disabled={!budgetUrl || !patientEmail}>Aceitar Orçamento (Agendar + Pix + E-mail)</button>
    </section>
  </main>);
}
