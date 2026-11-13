import { Link, useLocation } from "@tanstack/react-router";
import { FolderTree, KeyRound, LayoutDashboard, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard },
  { to: "/admin/cards", label: "Cards", icon: FolderTree },
  { to: "/admin/cards/novo", label: "Novo card", icon: PlusCircle },
  { to: "/admin/alterar-senha", label: "Alterar senha", icon: KeyRound },
] as const;

export function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Menu administrativo"
      className="w-full shrink-0 border-b border-border bg-card lg:w-60 lg:border-b-0 lg:border-r"
    >
      <ul className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-0.5 lg:p-3">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/admin" && pathname.startsWith(to));
          return (
            <li key={to} className="shrink-0 lg:w-full">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
