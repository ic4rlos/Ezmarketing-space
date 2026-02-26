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
  // 1️⃣ AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // 2️⃣ LOAD PROFILE + RELAÇÕES
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
        .maybeSingle(); // evita 406

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

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // 3️⃣ SAVE
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

    // =========================
    // EDUCATION
    // UNIQUE: User profile_id + Major
    // =========================

    const { data: existingEdu } = await supabase
      .from("Education")
      .select("id")
      .eq("User profile_id", profileId);

    const existingEduIds = existingEdu?.map(e => e.id) ?? [];
    const incomingEduIds = education
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

    const eduPayload = education.map((e: any) => ({
      id: e.id ?? undefined,
      University: e.University ?? null,
      Major: e.Major ?? null,
      "Graduation year": e["Graduation year"] ?? null,
      "Education level": e["Education level"] ?? null,
      Degree: e.Degree ?? null,
      "User profile_id": profileId,
    }));

    if (eduPayload.length) {
      await supabase
        .from("Education")
        .upsert(eduPayload, {
          onConflict: "User profile_id,Major",
        });
    }

    // =========================
    // JOBS (Charge)
    // UNIQUE: User profile_id + Company
    // =========================

    const { data: existingJobs } = await supabase
      .from("Charge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingJobIds = existingJobs?.map(j => j.id) ?? [];
    const incomingJobIds = jobs
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

    const jobsPayload = jobs.map((j: any) => ({
      id: j.id ?? undefined,
      Charge: j.Charge ?? null,
      Company: j.Company ?? null,
      "How long in office": j["How long in office"] ?? null,
      "User profile_id": profileId,
    }));

    if (jobsPayload.length) {
      await supabase
        .from("Charge")
        .upsert(jobsPayload, {
          onConflict: "User profile_id,Company",
        });
    }

    // =========================
    // OFFICES (Multicharge)
    // =========================

    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingOfficeIds =
      existingOffices?.map(o => o.id) ?? [];

    const incomingOfficeIds =
      offices.filter((o: any) => o.id).map((o: any) => o.id);

    const officesToDelete = existingOfficeIds.filter(
      id => !incomingOfficeIds.includes(id)
    );

    if (officesToDelete.length) {
      await supabase
        .from("Multicharge")
        .delete()
        .in("id", officesToDelete);
    }

    const officesPayload = offices.map((o: any) => ({
      id: o.id ?? undefined,
      Office: o.Office ?? null, // ajuste se sua coluna tiver outro nome
      "User profile_id": profileId,
    }));

    if (officesPayload.length) {
      await supabase
        .from("Multicharge")
        .upsert(officesPayload);
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
