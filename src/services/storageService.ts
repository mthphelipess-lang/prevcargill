import { supabase } from "@/integrations/supabase/client";
import { STORAGE_PREFIX } from "@/types/card";

const BUCKET = "portal-card-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type UploadResult = { ok: true; path: string } | { ok: false; message: string };

/** Envia a imagem para o armazenamento privado e devolve o caminho a salvar no card. */
export async function uploadCardImage(file: File, cardId: string): Promise<UploadResult> {
  const extension = ACCEPTED[file.type];
  if (!extension) return { ok: false, message: "Envie um arquivo JPG, PNG ou WEBP." };
  if (file.size > MAX_BYTES) return { ok: false, message: "A imagem deve ter no máximo 5 MB." };

  const path = `${STORAGE_PREFIX}${cardId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { ok: false, message: "Não foi possível enviar a imagem. Tente novamente." };
  return { ok: true, path };
}

export async function removeCardImage(path: string): Promise<void> {
  if (!path.startsWith(STORAGE_PREFIX)) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
