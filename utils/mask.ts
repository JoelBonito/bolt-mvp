export async function assertPngHasAlpha(file: File) {
  if (!file || !file.type.includes("png")) throw new Error("A máscara deve ser PNG.");
  if (file.size === 0) throw new Error("Arquivo de máscara vazio.");
}
