import { getIcon, ICON_OPTIONS } from "@/lib/iconMap";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (name: string) => void;
  describedBy?: string;
};

/** Grade de ícones permitidos. Só nomes cadastrados podem ser salvos. */
export function IconSelector({ value, onChange, describedBy }: Props) {
  return (
    <div
      role="group"
      aria-label="Ícone do card"
      aria-describedby={describedBy}
      className="max-h-56 overflow-y-auto rounded-md border border-input bg-card p-2"
    >
      <ul className="grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-7">
        {ICON_OPTIONS.map(({ name, label }) => {
          const Icon = getIcon(name);
          const selected = value === name;
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => onChange(name)}
                aria-pressed={selected}
                title={label}
                className={cn(
                  "flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-md border border-transparent px-1 py-2 transition-colors",
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="w-full truncate text-center text-[10px] leading-tight">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
