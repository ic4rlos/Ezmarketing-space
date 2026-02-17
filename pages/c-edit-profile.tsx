import * as React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabaseC } from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);

  // 🔎 Carregar dados da empresa
  useEffect(() => {
    async function loadCompany() {
      const supabase = getSupabaseC();
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .single();

      if (!error) {
        setCompany(data);
      }
    }

    loadCompany();
  }, []);

  // 💾 Salvar (substitui HTTP Integration)
  async function handleSave(values: any) {
    const supabase = getSupabaseC();
    const { error } = await supabase
      .from("companies")
      .upsert(values);

    if (!error) {
      setCompany({ ...company, ...values });
    }
  }

  const PlasmicComponent = PlasmicCEditProfile as any;

  return (
    <PageParamsProvider__
      route={router.pathname}
      params={{
        ...router.query,
      }}
      query={router.query}
    >
      <PlasmicComponent company={company} onSave={handleSave} />
    </PageParamsProvider__>
  );
}
