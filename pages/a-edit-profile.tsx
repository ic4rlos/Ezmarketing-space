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

      console.log("🟣 MULTICHARGE LOAD:", offices);

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
      offices = [],
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

    const { data: existingEdu } = await supabase
      .from("Education")
      .select("id")
      .eq("User profile_id", profileId);

    const existingEduIds = existingEdu?.map(e => e.id) ?? [];
    const incomingEduIds = cleanEducation
      .filter((e: any) => e.id)
      .map((e: any) => e.id);

    const eduToDelete = existingEduIds.filter(
      id => !incomingEduIds.includes(id)
    );

    if (eduToDelete.length) {
      await supabase
        .from("Education")
        .delete()
        .in("id", eduToDelete);
    }

    const eduPayload = cleanEducation.map((e: any) => {
      const base = {
        University: e.University ?? null,
        Major: e.Major,
        "Graduation year": e["Graduation year"] ?? null,
        "Education level": e["Education level"] ?? null,
        Degree: e.Degree ?? null,
        "User profile_id": profileId,
      };

      if (e.id !== undefined && e.id !== null) {
        return { ...base, id: e.id };
      }

      return base;
    });

    if (eduPayload.length) {
      await supabase
        .from("Education")
        .upsert(eduPayload, {
          onConflict: "User profile_id,Major",
        });
    }

    // =====================================================
    // JOBS (Charge)
    // =====================================================

    const cleanJobs = jobs.filter(
      (j: any) => j.Company && j.Company.trim() !== ""
    );

    const { data: existingJobs } = await supabase
      .from("Charge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingJobIds = existingJobs?.map(j => j.id) ?? [];
    const incomingJobIds = cleanJobs
      .filter((j: any) => j.id)
      .map((j: any) => j.id);

    const jobsToDelete = existingJobIds.filter(
      id => !incomingJobIds.includes(id)
    );

    if (jobsToDelete.length) {
      await supabase
        .from("Charge")
        .delete()
        .in("id", jobsToDelete);
    }

    const jobsPayload = cleanJobs.map((j: any) => {
      const base = {
        Charge: j.Charge ?? null,
        Company: j.Company,
        "How long in office": j["How long in office"] ?? null,
        "User profile_id": profileId,
      };

      if (j.id !== undefined && j.id !== null) {
        return { ...base, id: j.id };
      }

      return base;
    });

    if (jobsPayload.length) {
      await supabase
        .from("Charge")
        .upsert(jobsPayload, {
          onConflict: "User profile_id,Company",
        });
    }

    // =====================================================
    // OFFICES (SENTINELA)
    // =====================================================

    console.log("🟣 MULTICHARGE PAYLOAD RECEBIDO:", offices);

    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("id")
      .eq("User profile_id", profileId);

    console.log("🟣 MULTICHARGE EXISTENTES:", existingOffices);

    const existingOfficeIds =
      existingOffices?.map(o => o.id) ?? [];

    const incomingOfficeIds =
      offices?.filter((o: any) => o?.id)?.map((o: any) => o.id) ?? [];

    console.log("🟣 MULTICHARGE IDS EXISTENTES:", existingOfficeIds);
    console.log("🟣 MULTICHARGE IDS RECEBIDOS:", incomingOfficeIds);

    const officesToDelete = existingOfficeIds.filter(
      id => !incomingOfficeIds.includes(id)
    );

    console.log("🟣 MULTICHARGE PARA DELETAR:", officesToDelete);

    if (officesToDelete.length) {
      const { error } = await supabase
        .from("Multicharge")
        .delete()
        .in("id", officesToDelete);

      console.log("🟣 MULTICHARGE DELETE ERROR:", error);
    }

    const officesPayload = offices?.map((o: any) => {
      const base = {
        Office: o?.Office ?? null,
        "User profile_id": profileId,
      };

      if (o?.id !== undefined && o?.id !== null) {
        return { ...base, id: o.id };
      }

      return base;
    }) ?? [];

    console.log("🟣 MULTICHARGE UPSERT PAYLOAD:", officesPayload);

    if (officesPayload.length) {
      const { data, error } =
        await supabase
          .from("Multicharge")
          .upsert(officesPayload)
          .select();

      console.log("🟣 MULTICHARGE UPSERT RESULT:", data);
      console.log("🟣 MULTICHARGE UPSERT ERROR:", error);
    } else {
      console.log("🟣 MULTICHARGE NENHUM PAYLOAD");
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
