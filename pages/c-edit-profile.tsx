import { useEffect, useState } from "react";
import supabase from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfile() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

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

  // Wrapper: você decide como passar os dados para dentro do Plasmic
  return (
    <PlasmicCEditProfile
      // props que o Plasmic realmente espera (ex.: slots, overrides)
      root={{
        children: (
          <div>
            <pre>{JSON.stringify(company, null, 2)}</pre>
            <button onClick={() => handleSave({ name: "Nova empresa" })}>
              Salvar
            </button>
          </div>
        ),
      }}
    />
  );
}
