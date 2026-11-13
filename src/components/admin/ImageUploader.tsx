import { useEffect, useRef, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveCardImage } from "@/services/cardService";
import { uploadCardImage } from "@/services/storageService";
import { isStoragePath } from "@/types/card";

type Props = {
  /** Valor salvo no card: caminho do armazenamento ou endereço público. */
  value: string | null;
  onChange: (value: string | null) => void;
  folderId: string;
  describedBy?: string;
};

/**
 * Envio da imagem do card: botão, arrastar e soltar, e teclado (Enter/Espaço
 * no botão "Escolher arquivo").
 */
export function ImageUploader({ value, onChange, folderId, describedBy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    if (!isStoragePath(value)) {
      setPreview(value);
      return;
    }
    let active = true;
    resolveCardImage({ data: { value } })
      .then((result) => {
        if (active) setPreview(result.url);
      })
      .catch(() => {
        if (active) setPreview(null);
      });
    return () => {
      active = false;
    };
  }, [value]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const result = await uploadCardImage(file, folderId);
    setBusy(false);
    if (result.ok) {
      onChange(result.path);
      toast.success("Imagem enviada.");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        aria-describedby={describedBy}
        className={
          "flex min-h-32 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-3 text-center transition-colors " +
          (dragging ? "border-primary bg-primary/5" : "border-input bg-muted/40")
        }
      >
        {preview ? (
          <img
            src={preview}
            alt={value && isStoragePath(value) ? "Imagem enviada" : "Pré-visualização da imagem"}
            className="max-h-40 w-auto max-w-full rounded-sm object-contain"
          />
        ) : (
          <ImageUp className="size-7 text-muted-foreground" aria-hidden="true" />
        )}
        <p className="text-xs text-muted-foreground">
          {busy ? "Enviando..." : "Arraste uma imagem aqui ou escolha um arquivo"}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            Escolher arquivo
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => onChange(null)}>
              <Trash2 className="size-4" aria-hidden="true" />
              Remover imagem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
