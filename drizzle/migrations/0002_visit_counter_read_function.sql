DROP POLICY "Anyone can read visit total" ON public.site_visits;
REVOKE SELECT ON public.site_visits FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.get_visit_total() RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT total FROM public.site_visits WHERE id = 1;
$$;
REVOKE ALL ON FUNCTION public.get_visit_total() FROM public;
GRANT EXECUTE ON FUNCTION public.get_visit_total() TO anon, authenticated;