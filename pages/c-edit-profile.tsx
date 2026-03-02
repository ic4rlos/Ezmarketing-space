import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import supabase from "../lib/c-supabaseClient";

// 🔥 PASSO 1: Forçar renderização dinâmica e definir o runtime
export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

// 🔥 PASSO 2: Carregamento dinâmico do Plasmic (Desativa SSR para este componente)
const PlasmicCEditProfile = dynamic(
  () =>
    import("../components/plasmic/ez_marketing_platform/PlasmicCEditProfile").then(
      (m) => m.PlasmicCEditProfile
    ),
  { ssr: false }
);

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

    // ✅ 1. Upload logo
    const logoFile = companyValues.logoFile?.originFileObj;
    let logoUrl = companyValues.Logo;

    if (logoFile) {
      const filePath = `logos/${user.id}/${Date.now()}-${logoFile.name}`;
      const { error } = await supabase.storage
        .from("company-logos")
        .upload(filePath, logoFile);

      if (error) {
        console.error("❌ Logo upload failed:", error);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("company-logos")
          .getPublicUrl(filePath);
        logoUrl = publicUrlData.publicUrl;
      }
    }

    // ✅ 2. Upload imagem da empresa
    const companyImageFile = companyValues["Company image"]?.[0]?.originFileObj;
    let companyImageUrl = companyValues["Company image"] ?? null;

    if (companyImageFile) {
      const fileExt = companyImageFile.name.split(".").pop();
      const fileName = `${Date.now()}-cover.${fileExt}`;
      const filePath = `company-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, companyImageFile, { upsert: true });

      if (uploadError) {
        console.error("❌ Company image upload failed:", uploadError);
      } else {
        const { data } = supabase.storage
          .from("company-logos")
          .getPublicUrl(filePath);
        companyImageUrl = data.publicUrl;
      }
    }

    // ✅ 3. Upsert Company
    const { data: savedCompany, error: companyError } = await supabase
      .from("companies")
      .upsert(
        {
          user_id: user.id,
          ...companyValues,
          Logo: logoUrl,
          "Company image": companyImageUrl,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (companyError) {
      console.error("❌ Company upsert failed:", companyError);
      return;
    }

    const companyId = savedCompany.id;

    // 4️⃣ Buscar solutions existentes
    const { data: existingSolutions } = await supabase
      .from("solutions")
      .select("id")
      .eq("Company_id", companyId);

    const existingSolutionIds = existingSolutions?.map((s) => s.id) ?? [];
    const incomingSolutionIds = solutions
      .filter((s: any) => s.id)
      .map((s: any) => s.id);

    const solutionsToDelete = existingSolutionIds.filter(
      (id) => !incomingSolutionIds.includes(id)
    );

    if (solutionsToDelete.length > 0) {
      await supabase.from("solutions").delete().in("id", solutionsToDelete);
    }

    // 5️⃣ Upsert Solutions
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
      return sol.id ? { ...base, id: sol.id } : base;
    });

    const { data: savedSolutions } = await supabase
      .from("solutions")
      .upsert(solutionsPayload, { onConflict: "Company_id,Title" })
      .select();

    const solutionMap = new Map();
    savedSolutions?.forEach((s: any) => {
      solutionMap.set(s.Title, s.id);
    });

    // 6️⃣ Steps
    for (const sol of solutions) {
      const solutionId = solutionMap.get(sol.title);
      if (!solutionId) continue;

      const { data: existingSteps } = await supabase
        .from("solutions_steps")
        .select("id")
        .eq("solution_id", solutionId);

      const existingStepIds = existingSteps?.map((s) => s.id) ?? [];
      const incomingStepIds = sol.steps
        .filter((st: any) => st.id)
        .map((st: any) => st.id);

      const stepsToDelete = existingStepIds.filter(
        (id) => !incomingStepIds.includes(id)
      );

      if (stepsToDelete.length > 0) {
        await supabase.from("solutions_steps").delete().in("id", stepsToDelete);
      }

      const stepsPayload = sol.steps.map((step: any, index: number) => {
        const base = {
          solution_id: solutionId,
          step_text: step.step_text,
          Step_order: index,
        };
        return step.id ? { ...base, id: step.id } : base;
      });

      await supabase
        .from("solutions_steps")
        .upsert(stepsPayload, { onConflict: "solution_id,Step_order" });
    }

    // ✅ FINAL SUCESSO
    router.replace("/company-profile");
  }

  return (
    <PlasmicCEditProfile
      user={user}
      company={company}
      formData={formData}
      loading={loading}
      onSave={handleSave}
    />
  );
}
