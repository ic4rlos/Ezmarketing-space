import { useEffect, useState } from "react";
import supabase from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfile() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 1. Buscar usuário
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("❌ Error loading user:", error);
      }
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

      const { data: solutions, error: solutionsError } = await supabase
        .from("solutions")
        .select(`
          id,
          Title,
          Description,
          Price,
          solutions_steps (
            id,
            step_text,
            Step_order
          )
        `)
        .eq("Company_id", companyData.id)
        .order("id", { ascending: true });

      if (solutionsError) {
        console.error("❌ Error loading solutions:", solutionsError);
      }

      const structured =
        solutions?.map((sol: any) => ({
          id: sol.id,
          title: sol.Title,
          description: sol.Description,
          price: sol.Price,
          steps:
            sol.solutions_steps
              ?.sort((a: any, b: any) => a.Step_order - b.Step_order)
              .map((step: any) => ({
                id: step.id,
                step_text: step.step_text,
                step_order: step.Step_order,
              })) ?? [],
        })) ?? [];

      setFormData(structured);
      setLoading(false);
    }

    loadAll();
  }, [user]);

  // 🔹 3. Sincronização completa (COM DEBUG REAL)
  async function handleSave(payload: any) {
    if (!user) return;

    console.log("========== SAVE START ==========");
    console.log("Incoming payload:", payload);

    const { company: companyValues, solutions } = payload;

    // 1️⃣ Upsert Company
    const { data: savedCompany, error: companyError } = await supabase
      .from("companies")
      .upsert(
        { user_id: user.id, ...companyValues },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (companyError) {
      console.error("❌ Company upsert failed:", companyError);
      return;
    }

    console.log("✅ Company saved:", savedCompany);

    const companyId = savedCompany.id;

    // 2️⃣ Buscar solutions existentes
    const { data: existingSolutions, error: fetchSolError } =
      await supabase
        .from("solutions")
        .select("id")
        .eq("Company_id", companyId);

    if (fetchSolError) {
      console.error("❌ Fetch existing solutions failed:", fetchSolError);
      return;
    }

    const existingSolutionIds =
      existingSolutions?.map((s) => s.id) ?? [];

    const incomingSolutionIds = solutions
      .filter((s: any) => s.id)
      .map((s: any) => s.id);

    const solutionsToDelete = existingSolutionIds.filter(
      (id) => !incomingSolutionIds.includes(id)
    );

    if (solutionsToDelete.length > 0) {
      const { error: deleteSolError } = await supabase
        .from("solutions")
        .delete()
        .in("id", solutionsToDelete);

      if (deleteSolError) {
        console.error("❌ Delete solutions failed:", deleteSolError);
        return;
      }

      console.log("🗑 Solutions deleted:", solutionsToDelete);
    }

    // 4️⃣ Upsert Solutions
    const solutionsPayload = solutions.map((sol: any) => ({
      id: sol.id ?? undefined,
      Company_id: companyId,
      Title: sol.title,
      Description: sol.description,
      Price: sol.price,
    }));

    console.log("📦 Solutions payload:", solutionsPayload);

    const { data: savedSolutions, error: solutionsError } =
      await supabase
        .from("solutions")
        .upsert(solutionsPayload, {
          onConflict: "Company_id,Title",
        })
        .select();

    if (solutionsError) {
      console.error("❌ Solutions upsert failed:", solutionsError);
      return;
    }

    console.log("✅ Solutions saved:", savedSolutions);

    const solutionMap = new Map();
    savedSolutions?.forEach((s: any) => {
      solutionMap.set(s.Title, s.id);
    });

    // 5️⃣ Steps
    for (const sol of solutions) {
      const solutionId = solutionMap.get(sol.title);

      if (!solutionId) {
        console.error("❌ solutionId undefined for:", sol.title);
        return;
      }

      const { data: existingSteps, error: fetchStepsError } =
        await supabase
          .from("solutions_steps")
          .select("id")
          .eq("solution_id", solutionId);

      if (fetchStepsError) {
        console.error("❌ Fetch steps failed:", fetchStepsError);
        return;
      }

      const existingStepIds =
        existingSteps?.map((s) => s.id) ?? [];

      const incomingStepIds = sol.steps
        .filter((st: any) => st.id)
        .map((st: any) => st.id);

      const stepsToDelete = existingStepIds.filter(
        (id) => !incomingStepIds.includes(id)
      );

      if (stepsToDelete.length > 0) {
        const { error: deleteStepsError } = await supabase
          .from("solutions_steps")
          .delete()
          .in("id", stepsToDelete);

        if (deleteStepsError) {
          console.error("❌ Delete steps failed:", deleteStepsError);
          return;
        }

        console.log("🗑 Steps deleted:", stepsToDelete);
      }

      const stepsPayload = sol.steps.map(
        (step: any, index: number) => ({
          id: step.id ?? undefined,
          solution_id: solutionId,
          step_text: step.step_text,
          Step_order: index,
        })
      );

      console.log("📦 Steps payload:", stepsPayload);

      const { error: stepsError } = await supabase
        .from("solutions_steps")
        .upsert(stepsPayload, {
          onConflict: "solution_id,Step_order",
        });

      if (stepsError) {
        console.error("❌ Steps upsert failed:", stepsError);
        return;
      }
    }

    console.log("========== SAVE SUCCESS ==========");
    setCompany(savedCompany);
  }

  if (loading) return null;

  return (
    <PlasmicCEditProfile
      args={{
        company,
        formData,
        setFormData,
        onSave: handleSave,
      }}
    />
  );
}
