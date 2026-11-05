export function EmptyState({ message = "Nenhum dado disponível." }: { message?: string }) {
  return <p className="p-4 text-sm text-muted-foreground">{message}</p>;
}
