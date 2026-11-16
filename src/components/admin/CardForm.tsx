import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardPreview } from "./CardPreview";
import { IconSelector } from "./IconSelector";
import { ImageUploader } from "./ImageUploader";
import type { CardFieldErrors } from "@/hooks/useCardForm";
import type { CardDraft } from "@/types/card";

type Props = {
  initial: CardDraft;
  /** Pasta do armazenamento para as imagens enviadas. */
  folderId: string;
  submitting?: boolean;
  submitLabel?: string;
  errors?: CardFieldErrors;
  submitted?: boolean;
  onChange: (key: keyof CardDraft, value: never) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-medium text-danger">
      {message}
    </p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-md border border-border bg-card p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function CardForm({
  initial,
  folderId,
  submitting = false,
  submitLabel = "Salvar card",
  errors = {},
  submitted = false,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  const errorCount = Object.keys(errors).length;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="min-w-0 space-y-4">
        {submitted && errorCount > 0 && (
          <div role="alert" className="rounded-md border border-danger/40 bg-danger/5 p-3 text-sm text-danger">
            Revise os {errorCount} {errorCount === 1 ? "campo destacado" : "campos destacados"} abaixo.
          </div>
        )}

        <Section title="Identificação">
          <div className="space-y-1.5">
            <Label htmlFor="card-name">Nome do card</Label>
            <Input
              id="card-name"
              value={initial.name}
              maxLength={50}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => onChange("name", e.target.value as never)}
            />
            <FieldError message={errors.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-description">Descrição (opcional)</Label>
            <Textarea
              id="card-description"
              value={initial.description ?? ""}
              maxLength={150}
              rows={2}
              aria-invalid={Boolean(errors.description)}
              onChange={(e) => onChange("description", e.target.value as never)}
            />
            <FieldError message={errors.description} />
          </div>
        </Section>

        <Section title="Ícone">
          <IconSelector
            value={initial.icon_name}
            onChange={(name) => onChange("icon_name", name as never)}
            describedBy="icon-help"
          />
          <p id="icon-help" className="text-xs text-muted-foreground">
            O ícone aparece ao lado do nome e também quando o card não tem imagem.
          </p>
          <FieldError message={errors.icon_name} />
        </Section>

        <Section title="Imagem">
          <ImageUploader
            value={initial.image_url}
            folderId={folderId}
            onChange={(value) => onChange("image_url", value as never)}
            describedBy="image-help"
          />
          <p id="image-help" className="text-xs text-muted-foreground">
            JPG, PNG ou WEBP de até 5 MB. Sem imagem, o card mostra o ícone escolhido.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="card-image-alt">Descrição da imagem</Label>
            <Input
              id="card-image-alt"
              value={initial.image_alt ?? ""}
              maxLength={200}
              aria-invalid={Boolean(errors.image_alt)}
              onChange={(e) => onChange("image_alt", e.target.value as never)}
            />
            <FieldError message={errors.image_alt} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-image-fit">Como a imagem preenche o card</Label>
            <Select
              value={initial.image_fit}
              onValueChange={(value) => onChange("image_fit", value as never)}
            >
              <SelectTrigger id="card-image-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Preencher todo o espaço</SelectItem>
                <SelectItem value="contain">Mostrar inteira, com sobra de fundo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-placeholder">Sem imagem, mostrar</Label>
            <Select
              value={initial.placeholder_style}
              onValueChange={(value) => onChange("placeholder_style", value as never)}
            >
              <SelectTrigger id="card-placeholder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="icon-muted">Fundo claro com o ícone</SelectItem>
                <SelectItem value="icon-green">Fundo verde com o ícone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Vídeo (opcional)">
          <div className="space-y-1.5">
            <Label htmlFor="card-video">Endereço do vídeo</Label>
            <Input
              id="card-video"
              value={initial.video_url ?? ""}
              placeholder="https://..."
              aria-invalid={Boolean(errors.video_url)}
              onChange={(e) => onChange("video_url", e.target.value as never)}
            />
            <FieldError message={errors.video_url} />
          </div>
        </Section>

        <Section title="Destino">
          <div className="space-y-1.5">
            <Label htmlFor="card-destination">Endereço de destino</Label>
            <Input
              id="card-destination"
              value={initial.destination_url}
              placeholder="https://..."
              aria-invalid={Boolean(errors.destination_url)}
              onChange={(e) => onChange("destination_url", e.target.value as never)}
            />
            <FieldError message={errors.destination_url} />
          </div>
          <div className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border px-3">
            <Label htmlFor="card-newtab" className="cursor-pointer">
              Abrir em nova aba
            </Label>
            <Switch
              id="card-newtab"
              checked={initial.open_in_new_tab}
              onCheckedChange={(checked) => onChange("open_in_new_tab", checked as never)}
            />
          </div>
        </Section>

        <Section title="Exibição">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-order">Ordem de exibição</Label>
              <Input
                id="card-order"
                type="number"
                min={1}
                value={initial.display_order}
                aria-invalid={Boolean(errors.display_order)}
                onChange={(e) => onChange("display_order", e.target.value as never)}
              />
              <FieldError message={errors.display_order} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-group">Fileira</Label>
              <Select value={initial.row_group} onValueChange={(value) => onChange("row_group", value as never)}>
                <SelectTrigger id="card-group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Principal</SelectItem>
                  <SelectItem value="secondary">Complementar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Cor de destaque</Label>
              <div className="flex gap-2">
                {(["green", "yellow"] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange("accent_color", color as never)}
                    aria-pressed={initial.accent_color === color}
                    className={
                      "min-h-11 flex-1 rounded-md border-2 px-2 text-xs font-medium " +
                      (initial.accent_color === color ? "border-foreground" : "border-border")
                    }
                  >
                    <span
                      className={
                        "mx-auto mb-1 block h-2 w-full rounded-full " +
                        (color === "green" ? "bg-primary" : "bg-accent")
                      }
                      aria-hidden="true"
                    />
                    {color === "green" ? "Verde" : "Amarelo"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Publicação">
          <div className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border px-3">
            <Label htmlFor="card-enabled" className="cursor-pointer">
              Publicado (aparece na página inicial)
            </Label>
            <Switch
              id="card-enabled"
              checked={initial.enabled}
              onCheckedChange={(checked) => onChange("enabled", checked as never)}
            />
          </div>
        </Section>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
        <CardPreview draft={initial} />
      </aside>
    </form>
  );
}

/** Aviso padrão quando o salvamento falha. */
export function notifySaveError() {
  toast.error("Não foi possível salvar o card. Tente novamente.");
}
