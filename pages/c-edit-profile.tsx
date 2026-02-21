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
      const { data } = await supabase.auth.getUser();
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
      // Company
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!companyData) {
        setLoading(false);
        return;
      }

      setCompany(companyData);

      // Solutions + Steps
      const { data: solutions } = await supabase
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

  // 🔹 3. Sincronização completa
  async function handleSave(payload: any) {
    if (!user) return;

    const { company: companyValues, solutions } = payload;

    // 1️⃣ Upsert Company
    const { data: savedCompany } = await supabase
      .from("companies")
      .upsert(
        { user_id: user.id, ...companyValues },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    const companyId = savedCompany.id;

    // 2️⃣ Buscar solutions existentes
    const { data: existingSolutions } = await supabase
      .from("solutions")
      .select("id")
      .eq("Company_id", companyId);

    const existingSolutionIds =
      existingSolutions?.map((s) => s.id) ?? [];

    const incomingSolutionIds = solutions
      .filter((s: any) => s.id)
      .map((s: any) => s.id);

    // 3️⃣ Deletar solutions removidas
    const solutionsToDelete = existingSolutionIds.filter(
      (id) => !incomingSolutionIds.includes(id)
    );

    if (solutionsToDelete.length > 0) {
      await supabase
        .from("solutions")
        .delete()
        .in("id", solutionsToDelete);
    }

    // 4️⃣ Upsert Solutions
    const solutionsPayload = solutions.map((sol: any) => ({
      id: sol.id ?? undefined,
      Company_id: companyId,
      Title: sol.title,
      Description: sol.description,
      Price: sol.price,
    }));

    const { data: savedSolutions } = await supabase
      .from("solutions")
      .upsert(solutionsPayload, {
        onConflict: "Company_id,Title",
      })
      .select();

    // Map id definitivo
    const solutionMap = new Map();
    savedSolutions?.forEach((s: any) => {
      solutionMap.set(s.Title, s.id);
    });

    // 5️⃣ Sincronizar Steps por solution
    for (const sol of solutions) {
      const solutionId = solutionMap.get(sol.title);

      const { data: existingSteps } = await supabase
        .from("solutions_steps")
        .select("id")
        .eq("solution_id", solutionId);

      const existingStepIds =
        existingSteps?.map((s) => s.id) ?? [];

      const incomingStepIds = sol.steps
        .filter((st: any) => st.id)
        .map((st: any) => st.id);

      const stepsToDelete = existingStepIds.filter(
        (id) => !incomingStepIds.includes(id)
      );

      if (stepsToDelete.length > 0) {
        await supabase
          .from("solutions_steps")
          .delete()
          .in("id", stepsToDelete);
      }

      const stepsPayload = sol.steps.map(
        (step: any, index: number) => ({
          id: step.id ?? undefined,
          solution_id: solutionId,
          step_text: step.step_text,
          Step_order: index,
        })
      );

      await supabase
        .from("solutions_steps")
        .upsert(stepsPayload, {
          onConflict: "solution_id,Step_order",
        });
    }

    setCompany(savedCompany);
  }

  if (loading) return null;

  return (
    <PlasmicCEditProfile
      args={{
        company,
        formData,
        setFormData, // 👈 ESSA É A ÚNICA ADIÇÃO
        onSave: handleSave,
      }}
    />
  );
}
