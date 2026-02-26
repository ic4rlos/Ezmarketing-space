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
    offices: [], // agora é string[]
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

      const { data: offices } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      setFormData({
        ...profileData,
        education: education ?? [],
        jobs: jobs ?? [],
        // 🔥 CONVERSÃO CRÍTICA
        offices: offices?.map(o => o.Office) ?? [],
      });

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // SAVE
  // =========================
  async function handleSave(payload: any) {
    if (!user) return;

    const {
      education = [],
      jobs = [],
      offices = [], // agora string[]
      ...profileFields
    } = payload;

    // =========================
    // USER PROFILE
    // =========================
    const { data: savedProfile, error: profileError } =
      await supabase
        .from("User profile")
        .upsert(
          { user_id: user.id, ...profileFields },
          { onConflict: "user_id" }
        )
        .select()
        .single();

    if (profileError || !savedProfile) {
      console.error("Profile error:", profileError);
      return;
    }

    const profileId = savedProfile.id;

    // =====================================================
    // EDUCATION
    // =====================================================

    const cleanEducation = education.filter(
      (e: any) => e.Major && e.Major.trim() !== ""
    );

    await supabase
      .from("Education")
      .delete()
      .eq("User profile_id", profileId);

    if (cleanEducation.length) {
      const eduPayload = cleanEducation.map((e: any) => ({
        University: e.University ?? null,
        Major: e.Major,
        "Graduation year": e["Graduation year"] ?? null,
        "Education level": e["Education level"] ?? null,
        Degree: e.Degree ?? null,
        "User profile_id": profileId,
      }));

      const { error } = await supabase
        .from("Education")
        .insert(eduPayload);

      if (error) {
        console.error("Education insert error:", error);
        return;
      }
    }

    // =====================================================
    // JOBS
    // =====================================================

    const cleanJobs = jobs.filter(
      (j: any) => j.Company && j.Company.trim() !== ""
    );

    await supabase
      .from("Charge")
      .delete()
      .eq("User profile_id", profileId);

    if (cleanJobs.length) {
      const jobsPayload = cleanJobs.map((j: any) => ({
        Charge: j.Charge ?? null,
        Company: j.Company,
        "How long in office": j["How long in office"] ?? null,
        "User profile_id": profileId,
      }));

      const { error } = await supabase
        .from("Charge")
        .insert(jobsPayload);

      if (error) {
        console.error("Charge insert error:", error);
        return;
      }
    }

    // =====================================================
    // OFFICES (MULTISELECT CORRIGIDO)
    // =====================================================

    // 🔥 Remove todos primeiro
    await supabase
      .from("Multicharge")
      .delete()
      .eq("User profile_id", profileId);

    const cleanOffices = offices.filter(
      (o: string) => o && o.trim() !== ""
    );

    if (cleanOffices.length) {
      const officesPayload = cleanOffices.map((office: string) => ({
        Office: office,
        "User profile_id": profileId,
      }));

      const { error } = await supabase
        .from("Multicharge")
        .insert(officesPayload);

      if (error) {
        console.error("Multicharge insert error:", error);
        return;
      }
    }

    // =========================
    // FINAL
    // =========================
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
