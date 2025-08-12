# Bolt Odonto MVP – Facetas

## Rodar local
1) `npm i`
2) crie `.env.local` (use `.env.local.example`)
3) `npm run dev` → http://localhost:3000

## Exportar para o Bolt
`npm run bolt:export` → gera `bolt-mvp.zip` na raiz

## Supabase
- Crie bucket público `simulacoes`
- Execute `db/schema.sql` no SQL editor

## Fluxo
Upload foto (+máscara) → simulação (image_gen) → gerar orçamento/relatório (PDF) → aceitar (agenda + Pix + e-mails).
