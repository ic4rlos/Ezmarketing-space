import { useEffect, useState } from "react";
import supabase from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfile() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  // 🔎 Carregar usuário logado
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // 🔎 Carregar dados da empresa vinculada ao usuário
  useEffect(() => {
    if (!user) return;

    supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) {
          setCompany(data);
        }
      });
  }, [user]);

  // 💾 Salvar dados da empresa
  async function handleSave(values: any) {
    if (!user) return;

    const { error } = await supabase.from("companies").upsert(
      {
        user_id: user.id,
        ...values,
      },
      { onConflict: "user_id" }
    );

    if (!error) {
      setCompany({ ...company, ...values });
    }
  }

  return (
    <PlasmicCEditProfile
      company={company}
      onSave={handleSave}
    />
  );
}
