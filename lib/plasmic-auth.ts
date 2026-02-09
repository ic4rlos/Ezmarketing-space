import { PLASMIC } from "@plasmicapp/loader-nextjs";
import { getSupabaseAuth } from "./supabaseAuthClient";

PLASMIC.registerFunction(
  async function getUserId() {
    const supabase = getSupabaseAuth();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  },
  {
    name: "getUserId",
    namespace: "auth",
  }
);
