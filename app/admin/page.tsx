"use client";
import { useEffect, useState } from "react";
export default function Admin(){
  const [rows,setRows]=useState<any>({});
  useEffect(()=>{ (async()=>{ const r=await fetch("/api/admin-data"); const j=await r.json(); setRows(j); })(); },[]);
  return (<main style={{maxWidth:1000,margin:"40px auto",padding:16}}>
    <h1>Painel /admin</h1>
    <section style={{display:"grid",gap:16,gridTemplateColumns:"1fr 1fr"}}>
      <div><h3>Simulações</h3><pre>{JSON.stringify(rows.simulations||[],null,2)}</pre></div>
      <div><h3>Orçamentos</h3><pre>{JSON.stringify(rows.quotes||[],null,2)}</pre></div>
      <div><h3>Agendamentos</h3><pre>{JSON.stringify(rows.appointments||[],null,2)}</pre></div>
      <div><h3>Pagamentos</h3><pre>{JSON.stringify(rows.payments||[],null,2)}</pre></div>
    </section>
  </main>);
}
