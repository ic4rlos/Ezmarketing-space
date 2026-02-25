import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/c-supabaseClient";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any[]>([]);
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

      if (solutionsError)
        console.error("❌ Error loading solutions:", solutionsError);

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
    }

    // 3️⃣ Upsert Solutions
    const solutionsPayload = solutions.map((sol: any) => {
      const base = {
        Company_id: companyId,
        Title: sol.title,
        Description: sol.description,
        Price:
          sol.price === "" || sol.price === undefined || sol.price === null
            ? null
            : Number(sol.price),
      };

      if (sol.id !== undefined && sol.id !== null) {
        return { ...base, id: sol.id };
      }

      return base;
    });

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

    const solutionMap = new Map();
    savedSolutions?.forEach((s: any) => {
      solutionMap.set(s.Title, s.id);
    });

    // 4️⃣ Steps
    for (const sol of solutions) {
      const solutionId = solutionMap.get(sol.title);
      if (!solutionId) return;

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
        (step: any, index: number) => {
          const base = {
            solution_id: solutionId,
            step_text: step.step_text,
            Step_order: index,
          };

          if (step.id !== undefined && step.id !== null) {
            return { ...base, id: step.id };
          }

          return base;
        }
      );

      await supabase
        .from("solutions_steps")
        .upsert(stepsPayload, {
          onConflict: "solution_id,Step_order",
        });
    }

    // ✅ FINAL SUCESSO → REDIRECIONA
    router.replace("/company-profile");
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
