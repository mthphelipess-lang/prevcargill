CREATE TABLE public.site_visits (id int PRIMARY KEY DEFAULT 1 CHECK (id = 1), total bigint NOT NULL DEFAULT 0);
GRANT SELECT ON public.site_visits TO anon, authenticated;
GRANT ALL ON public.site_visits TO service_role;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read visit total" ON public.site_visits FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_visits (id, total) VALUES (1, 0);
CREATE OR REPLACE FUNCTION public.register_visit() RETURNS bigint LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.site_visits SET total = total + 1 WHERE id = 1 RETURNING total;
$$;
REVOKE ALL ON FUNCTION public.register_visit() FROM public;
GRANT EXECUTE ON FUNCTION public.register_visit() TO anon, authenticated;