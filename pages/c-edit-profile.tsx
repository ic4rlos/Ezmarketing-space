import { useEffect, useState } from "react";
import supabase from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfile() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any[]>([]);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 1. Buscar usuário
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("❌ Error loading user:", error);
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // 🔹 2. Buscar company + solutions + steps
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (companyError) {
        console.error("❌ Error loading company:", companyError);
        setLoading(false);
        return;
      }

      if (!companyData) {
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setLoading(false);
    }

    loadAll();
  }, [user]);

  // 🔹 Upload avatar com crop (recebe File já cortado)
  async function uploadAvatar(file: File) {
    if (!user) return null;

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Avatar upload failed:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // 🔹 3. Save completo com avatar
  async function handleSave(payload: any) {
    if (!user) return;

    console.log("========== SAVE START ==========");

    const { company: companyValues, solutions } = payload;

    let avatarUrl = company?.avatar_url ?? null;

    // Se usuário selecionou novo avatar
    if (avatarFiles.length > 0) {
      const uploadedUrl = await uploadAvatar(avatarFiles[0]);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      }
    }

    // 1️⃣ Upsert Company (agora inclui avatar_url)
    const { data: savedCompany, error: companyError } = await supabase
      .from("companies")
      .upsert(
        {
          user_id: user.id,
          avatar_url: avatarUrl,
          ...companyValues,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (companyError) {
      console.error("❌ Company upsert failed:", companyError);
      return;
    }

    console.log("✅ Company saved:", savedCompany);

    setCompany(savedCompany);

    console.log("========== SAVE SUCCESS ==========");
  }

  if (loading) return null;

  return (
    <PlasmicCEditProfile
      args={{
        company,
        formData,
        setFormData,
        avatarFiles,
        setAvatarFiles,
        onSave: handleSave,
      }}
    />
  );
}
