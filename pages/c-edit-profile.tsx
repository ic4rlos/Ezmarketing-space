import { useEffect, useState } from "react";
import supabase from "../lib/c-supabaseClient";
import {
  PlasmicRootProvider,
  PlasmicComponent
} from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "../plasmic-init";

export default function CEditProfile() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Buscar usuário
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // 2️⃣ Buscar company
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCompany() {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) {
        setCompany(data);
      }

      setLoading(false);
    }

    loadCompany();
  }, [user]);

  // 3️⃣ Save
  async function handleSave(values: any) {
    if (!user) return;

    const payload = {
      user_id: user.id,
      ...values,
    };

    const { data, error } = await supabase
      .from("companies")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (!error) {
      setCompany(data);
    }
  }

  if (loading) return null;

  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <PlasmicComponent
        component="CEditProfile2" // 👈 nome exato da page no Plasmic
        componentProps={{
          companyData: company,
          onSave: handleSave
        }}
      />
    </PlasmicRootProvider>
  );
}
