import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCAuth } from "../contexts/c-AuthContext";
import getSupabaseC from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const { user, loading } = useCAuth();
  const supabase = getSupabaseC();

  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) {
        setCompany(data);
      }
    }

    load();
  }, [user]);

  if (loading) return null;

  return (
    <PageParamsProvider__
      route={router.pathname}
      params={{
        ...router.query,
        userId: user?.id ?? null,
      }}
      query={router.query}
    >
      <PlasmicCEditProfile company={company} />
    </PageParamsProvider__>
  );
}
