import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlasmicAEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicAEditProfile";
import { getSupabaseA } from "../lib/a-supabaseClient";

export default function AEditProfile() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    education: [],
    jobs: [],
    offices: [],
  });
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      console.log("🔥 AUTH: tentando carregar usuário...");
      const { data } = await supabase.auth.getUser();
      console.log("🔥 AUTH: usuário carregado:", data.user);
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      console.log("🔥 LOAD: carregando profile...");

      const { data: profileData } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("🔥 LOAD: profile encontrado:", profileData);

      if (!profileData) {
        setLoading(false);
        return;
      }

      const profileId = profileData.id;

      const { data: offices } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      console.log("🔥 LOAD: offices vindos do banco:", offices);

      setFormData({
        ...profileData,
        offices: offices ?? [],
      });

      console.log("🔥 STATE: formData inicial:", {
        ...profileData,
        offices: offices ?? [],
      });

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // SAVE
  // =========================
  async function handleSave(payload: any) {
    console.log("🚨 BOTÃO DONE CLICADO");
    console.log("🚨 PAYLOAD RECEBIDO:", payload);
    console.log("🚨 OFFICES NO PAYLOAD:", payload.offices);

    if (!user) {
      console.log("❌ SAVE CANCELADO: user inexistente");
      return;
    }

    const { offices = [], ...profileFields } = payload;

    const { data: savedProfile, error: profileError } =
      await supabase
        .from("User profile")
        .upsert(
          { user_id: user.id, ...profileFields },
          { onConflict: "user_id" }
        )
        .select()
        .single();

    console.log("🔥 PROFILE UPSERT:", savedProfile);
    console.log("🔥 PROFILE ERROR:", profileError);

    if (!savedProfile) {
      console.log("❌ PROFILE NÃO SALVO, abortando offices");
      return;
    }

    const profileId = savedProfile.id;

    console.log("🔥 PREPARANDO MULTICHARGE...");
    console.log("🔥 OFFICES RECEBIDOS PARA SALVAR:", offices);

    // Limpa tudo antes (sentinela bruto)
    console.log("🔥 DELETANDO OFFICES ANTIGOS...");
    const { error: deleteError } = await supabase
      .from("Multicharge")
      .delete()
      .eq("User profile_id", profileId);

    console.log("🔥 DELETE ERROR:", deleteError);

    if (!offices || offices.length === 0) {
      console.log("⚠️ NENHUM OFFICE PARA INSERIR");
      router.replace("/a-find-a-business/");
      return;
    }

    const officesPayload = offices.map((office: string) => ({
      Office: office,
      "User profile_id": profileId,
    }));

    console.log("🔥 VAI INSERIR ISSO EM MULTICHARGE:", officesPayload);

    const { data: insertedData, error: insertError } =
      await supabase
        .from("Multicharge")
        .insert(officesPayload)
        .select();

    console.log("🔥 INSERT RESULT:", insertedData);
    console.log("🔥 INSERT ERROR:", insertError);

    if (!insertError) {
      console.log(
        "✅ MULTICHARGE SALVO COM SUCESSO. TOTAL:",
        insertedData?.length
      );
    }

    router.replace("/a-find-a-business/");
  }

  if (loading) return null;

  return (
    <PlasmicAEditProfile
      args={{
        formData,
        setFormData,
        onSave: handleSave,
      }}
    />
  );
}
