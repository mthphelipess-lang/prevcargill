import { useAuth } from "@/providers/AuthProvider";

export function usePortalUser() {
  return useAuth().user;
}
