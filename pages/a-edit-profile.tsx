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
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD PROFILE + RELAÇÕES
  // =========================
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      const { data: profileData } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profileData) {
        setLoading(false);
        return;
      }

      const profileId = profileData.id;

      const { data: education } = await supabase
        .from("Education")
        .select("*")
        .eq("User profile_id", profileId);

      const { data: jobs } = await supabase
        .from("Charge")
        .select("*")
        .eq("User profile_id", profileId);

      const { data: officesDb } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      // 🔥 CONVERSÃO CORRETA PARA O SELECT (string[])
      const offices = officesDb?.map((o) => o.Office) ?? [];

      console.log("🟣 MULTICHARGE LOAD RAW:", officesDb);
      console.log("🟣 MULTICHARGE LOAD CONVERTIDO:", offices);

      setFormData({
        ...profileData,
        education: education ?? [],
        jobs: jobs ?? [],
        offices,
      });

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // MONITORAR MUDANÇAS NO FORMDATA
  // =========================
  useEffect(() => {
    console.log("FORMDATA ATUALIZADO:", formData);
  }, [formData]);

  // =========================
  // SAVE
  // =========================
  async function handleSave(payload: any) {
    if (!user) return;

    const {
      education = [],
      jobs = [],
      offices = [],
      ...profileFields
    } = payload;

    console.log("🟣 MULTICHARGE PAYLOAD RECEBIDO:", offices);

    const { data: savedProfile, error: profileError } = await supabase
      .from("User profile")
      .upsert({ user_id: user.id, ...profileFields }, { onConflict: "user_id" })
      .select()
      .single();

    if (profileError || !savedProfile) {
      console.error("Profile error:", profileError);
      return;
    }

    const profileId = savedProfile.id;

    // =====================================================
    // OFFICES (VERSÃO CORRETA PARA STRING[])
    // =====================================================

    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("*")
      .eq("User profile_id", profileId);

    console.log("🟣 MULTICHARGE EXISTENTES:", existingOffices);

    const existingValues = existingOffices?.map((o) => o.Office) ?? [];

    console.log("🟣 MULTICHARGE EXISTING VALUES:", existingValues);

    // Deletar o que não está mais selecionado
    const toDelete =
      existingOffices
        ?.filter((o) => !offices.includes(o.Office))
        .map((o) => o.id) ?? [];

    console.log("🟣 MULTICHARGE PARA DELETAR:", toDelete);

    if (toDelete.length) {
      const { error } = await supabase
        .from("Multicharge")
        .delete()
        .in("id", toDelete);

      console.log("🟣 MULTICHARGE DELETE ERROR:", error);
    }

    // Inserir o que é novo
    const toInsert = offices
      .filter((office: string) => !existingValues.includes(office))
      .map((office: string) => ({
        Office: office,
        "User profile_id": profileId,
      }));

    console.log("🟣 MULTICHARGE PARA INSERIR:", toInsert);

    if (toInsert.length) {
      const { data, error } = await supabase
        .from("Multicharge")
        .insert(toInsert)
        .select();

      console.log("🟣 MULTICHARGE INSERT RESULT:", data);
      console.log("🟣 MULTICHARGE INSERT ERROR:", error);
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
        // 🔥 Corrigido: função para atualizar offices corretamente
        onOfficesChange: (value: any) => {
          console.log("SELECT ALTERADO:", value);
          console.log("TIPO:", typeof value);
          console.log("É ARRAY?", Array.isArray(value));

          setFormData((prev: any) => ({
            ...prev,
            offices: Array.isArray(value) ? [...value] : [value],
          }));
        },
      }}
    />
  );
}
