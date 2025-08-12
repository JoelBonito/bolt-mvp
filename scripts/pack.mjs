import fs from "fs"; import path from "path"; import archiver from "archiver";
const out = fs.createWriteStream("bolt-mvp.zip"); const archive = archiver("zip", { zlib: { level: 9 } });
out.on("close", () => console.log(`✔ bolt-mvp.zip criado (${archive.pointer()} bytes)`));
archive.on("error", err => { throw err; }); archive.pipe(out);
const EXCLUDES = new Set(["node_modules",".next",".git","bolt-mvp.zip"]);
function addDir(dir, base="."){ for(const entry of fs.readdirSync(dir)){ if(EXCLUDES.has(entry)) continue;
  const full = path.join(dir, entry); const stat = fs.statSync(full); const rel = path.relative(base, full);
  if (stat.isDirectory()) addDir(full, base); else archive.file(full, { name: rel }); } }
addDir(process.cwd()); archive.finalize();
