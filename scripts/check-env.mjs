import "dotenv/config";
const required = ["OPENAI_API_KEY","SUPABASE_URL","SUPABASE_KEY","SUPABASE_BUCKET","APP_URL","CLINIC_NAME","CLINIC_EMAIL"];
let ok=true; for(const k of required){ if(!process.env[k]){ console.error(`✖ Faltando ${k} no .env.local`); ok=false; } }
if(ok) console.log("✔ .env.local OK"); process.exit(ok?0:1);
