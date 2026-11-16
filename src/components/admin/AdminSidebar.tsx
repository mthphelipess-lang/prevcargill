import { Link, useLocation } from "@tanstack/react-router";
import { FolderTree, KeyRound, LayoutDashboard, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function itemClass(active: boolean) {
  return cn(
    "flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors",
    active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted hover:text-foreground",
  );
}

export function AdminSidebar() {
  const { pathname } = useLocation();

  const linkProps = (to: string) => ({
    className: itemClass(pathname === to || (to !== "/admin" && pathname.startsWith(to))),
    "aria-current": (pathname === to || (to !== "/admin" && pathname.startsWith(to)) ? "page" : undefined) as
      | "page"
      | undefined,
  });

  return (
    <nav aria-label="Menu administrativo" className="w-full shrink-0 border-b border-border bg-card lg:w-60 lg:border-b-0 lg:border-r">
      <ul className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-0.5 lg:p-3">
        <li className="shrink-0 lg:w-full">
          <Link to="/admin" {...linkProps("/admin")}>
            <LayoutDashboard className="size-4 shrink-0" aria-hidden="true" />
            Painel
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link to="/admin/cards" {...linkProps("/admin/cards")}>
            <FolderTree className="size-4 shrink-0" aria-hidden="true" />
            Cards
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link to="/admin/cards/novo" {...linkProps("/admin/cards/novo")}>
            <PlusCircle className="size-4 shrink-0" aria-hidden="true" />
            Novo card
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link to="/admin/alterar-senha" {...linkProps("/admin/alterar-senha")}>
            <KeyRound className="size-4 shrink-0" aria-hidden="true" />
            Alterar senha
          </Link>
        </li>
      </ul>
    </nav>
  );
}
