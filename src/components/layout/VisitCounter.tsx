import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "portal-visit-counted";

export function VisitCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const counted = sessionStorage.getItem(SESSION_KEY);
      if (!counted) {
        const { data } = await supabase.rpc("register_visit");
        if (data != null) {
          sessionStorage.setItem(SESSION_KEY, "1");
          if (active) setTotal(Number(data));
          return;
        }
      }
      const { data } = await supabase.from("site_visits").select("total").eq("id", 1).maybeSingle();
      if (active && data) setTotal(Number(data.total));
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <span className="flex min-h-11 items-center gap-2" aria-live="polite">
      <Eye className="size-5 text-accent" aria-hidden="true" />
      <span>Visitas: {total == null ? "…" : total.toLocaleString("pt-BR")}</span>
    </span>
  );
}
