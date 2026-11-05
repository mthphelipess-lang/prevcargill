export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
      <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
      {label}
    </div>
  );
}
