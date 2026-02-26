import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlasmicAEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicAEditProfile";
import { getSupabaseA } from "../lib/a-supabaseClient";

export default function AEditProfile() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    education: [],
    jobs: [],
    offices: [],
  });
  const [loading, setLoading] = useState(true);

  // 🔹 1️⃣ Pega usuário autenticado
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Auth error:", error);
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // 🔹 2️⃣ Carrega profile + filhos
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      const { data: profileData, error: profileError } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
        setLoading(false);
        return;
      }

      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const profileId = profileData.id;

      const { data: education } = await supabase
        .from("Education")
        .select("*")
        .eq("User profile_id", profileId);

      const { data: jobs } = await supabase
        .from("Charge")
        .select("*")
        .eq("User profile_id", profileId);

      const { data: offices } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      setFormData({
        ...profileData,
        education: education ?? [],
        jobs: jobs ?? [],
        offices: offices ?? [],
      });

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // 🔹 3️⃣ SAVE COMPLETO
  async function handleSave(payload: any) {
    if (!user) return;

    const {
      education,
      jobs,
      offices,
      ...profileFields
    } = payload;

    // 1️⃣ Upsert User profile
    const { data: savedProfile, error: profileError } =
      await supabase
        .from("User profile")
        .upsert(
          { user_id: user.id, ...profileFields },
          { onConflict: "user_id" }
        )
        .select()
        .single();

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      return;
    }

    const profileId = savedProfile.id;

    // ---------- EDUCATION ----------
    const { data: existingEdu } = await supabase
      .from("Education")
      .select("id")
      .eq("User profile_id", profileId);

    const existingEduIds = existingEdu?.map((e) => e.id) ?? [];
    const incomingEduIds = education.filter((e:any)=>e.id).map((e:any)=>e.id);

    const eduToDelete = existingEduIds.filter(
      (id) => !incomingEduIds.includes(id)
    );

    if (eduToDelete.length) {
      await supabase
        .from("Education")
        .delete()
        .in("id", eduToDelete);
    }

    const eduPayload = education.map((e:any) => ({
      ...e,
      "User profile_id": profileId,
    }));

    await supabase.from("Education").upsert(eduPayload);

    // ---------- JOBS ----------
    const { data: existingJobs } = await supabase
      .from("Charge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingJobIds = existingJobs?.map((j) => j.id) ?? [];
    const incomingJobIds = jobs.filter((j:any)=>j.id).map((j:any)=>j.id);

    const jobsToDelete = existingJobIds.filter(
      (id) => !incomingJobIds.includes(id)
    );

    if (jobsToDelete.length) {
      await supabase.from("Charge").delete().in("id", jobsToDelete);
    }

    const jobsPayload = jobs.map((j:any) => ({
      ...j,
      "User profile_id": profileId,
    }));

    await supabase.from("Charge").upsert(jobsPayload);

    // ---------- OFFICES ----------
    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingOfficeIds =
      existingOffices?.map((o) => o.id) ?? [];

    const incomingOfficeIds =
      offices.filter((o:any)=>o.id).map((o:any)=>o.id);

    const officesToDelete = existingOfficeIds.filter(
      (id) => !incomingOfficeIds.includes(id)
    );

    if (officesToDelete.length) {
      await supabase
        .from("Multicharge")
        .delete()
        .in("id", officesToDelete);
    }

    const officesPayload = offices.map((o:any) => ({
      ...o,
      "User profile_id": profileId,
    }));

    await supabase.from("Multicharge").upsert(officesPayload);

    // ✅ FINAL
    router.replace("/find-a-affiliate/");
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
