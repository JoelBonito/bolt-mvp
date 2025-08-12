# Bolt Odonto MVP – Facetas

## N8N Integration
Para usar simulação real com IA:
1. Configure N8N com o workflow em `n8n-workflow.json`
2. Configure OpenAI API key no N8N
3. Configure Supabase no N8N
4. Atualize a URL do webhook em `main.js`

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
