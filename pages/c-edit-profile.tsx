import * as React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCAuth } from "../contexts/c-AuthContext";
import { getSupabaseC } from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const { user, loading } = useCAuth();
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    async function loadCompany() {
      if (!user) return;

      const supabase = getSupabaseC();

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) {
        setCompany(data);
      }
    }

    loadCompany();
  }, [user]);

  if (loading) {
    return null;
  }

  const PlasmicComponent = PlasmicCEditProfile as any;

  return (
    <PageParamsProvider__
      route={router.pathname}
      params={{
        ...router.query,
        userId: user?.id ?? null,
      }}
      query={router.query}
    >
      <PlasmicComponent company={company} />
    </PageParamsProvider__>
  );
}
