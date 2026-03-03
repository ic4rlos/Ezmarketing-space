import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import supabase from "../lib/c-supabaseClient";

// 🔥 Configurações de Renderização
export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

// 🔥 Plasmic sem SSR para evitar conflitos de hidratação
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

  // 🔹 1. Buscar usuário autenticado
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("❌ Error loading user:", error);
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // 🔹 2. Buscar dados da Empresa + Soluções
  useEffect(() => {
    if (!user) {
      if (!loading) setLoading(false);
      return;
    }

    async function loadAll() {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (companyError || !companyData) {
        console.error("❌ Error loading company:", companyError);
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

      if (solutionsError) console.error("❌ Error loading solutions:", solutionsError);

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

  // 🔥 FUNÇÃO DE SALVAMENTO PRINCIPAL
  async function handleSave(payload: any) {
    console.log("🔥🔥🔥 SAVE DISPARADO 🔥🔥🔥");
    if (!user) {
      console.error("🚨 USER NULL — SAVE ABORTADO");
      return;
    }

    const { company: companyValues, solutions } = payload;

    // ✅ CORREÇÃO SEGURA PARA O LOGO (Trata String, Objeto Plasmic ou Array de Arquivos)
    const rawLogo = companyValues["Company Logo"];
    let logoUrl: string | null = null;
    if (typeof rawLogo === "string") {
      logoUrl = rawLogo;
    } else if (rawLogo?.url) {
      logoUrl = rawLogo.url;
    } else if (rawLogo?.files?.[0]?.url) {
      logoUrl = rawLogo.files[0].url;
    }

    // ✅ TRATAMENTO DA IMAGEM DA EMPRESA (Upload para Storage se necessário)
    const rawImage = companyValues["Company image"];
    let companyImageUrl: string | null = null;

    if (rawImage?.files && rawImage.files.length > 0) {
      const fileObj = rawImage.files[0];
      if (fileObj.contents) {
        const base64Data = fileObj.contents;
        const fileExt = fileObj.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `company-images/${user.id}/${fileName}`;
        
        // Converter base64 para Buffer (Node runtime)
        const buffer = Buffer.from(base64Data, "base64");

        const { error: uploadError } = await supabase.storage
          .from("company-logos")
          .upload(filePath, buffer, {
            contentType: fileObj.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from("company-logos").getPublicUrl(filePath);
          companyImageUrl = data.publicUrl;
        }
      }
    } else if (typeof rawImage === "string") {
      companyImageUrl = rawImage;
    }

    // 🚀 UPSERT DA TABELA 'COMPANIES'
    const { data: savedCompany, error: companyError } = await supabase
      .from("companies")
      .upsert(
        {
          user_id: user.id,
          ...companyValues,
          "Company Logo": logoUrl,
          "Company image": companyImageUrl,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (companyError) {
      console.error("🚨 ERRO NO UPSERT DA EMPRESA:", companyError);
      return;
    }

    const companyId = savedCompany.id;

    // 🔹 1. Deletar Solutions removidas no front-end
    const { data: existingSolutions } = await supabase
      .from("solutions")
      .select("id")
      .eq("Company_id", companyId);

    const existingSolutionIds = existingSolutions?.map((s) => s.id) ?? [];
    const incomingSolutionIds = solutions.filter((s: any) => s.id).map((s: any) => s.id);
    const solutionsToDelete = existingSolutionIds.filter((id) => !incomingSolutionIds.includes(id));

    if (solutionsToDelete.length > 0) {
      await supabase.from("solutions").delete().in("id", solutionsToDelete);
    }

    // 🔹 2. Upsert Solutions
    const solutionsPayload = solutions.map((sol: any) => ({
      ...(sol.id ? { id: sol.id } : {}),
      Company_id: companyId,
      Title: sol.title,
      Description: sol.description,
      Price: sol.price ? Number(sol.price) : null,
    }));

    const { data: savedSolutions, error: solUpsertError } = await supabase
      .from("solutions")
      .upsert(solutionsPayload, { onConflict: "id" }) // Usando ID como conflito para garantir match
      .select();

    if (solUpsertError) console.error("❌ Erro ao salvar soluções", solUpsertError);

    // 🔹 3. Sincronizar Steps para cada solução
    for (const sol of solutions) {
      // Encontrar o ID da solução salva (especialmente útil para novas solutions)
      const targetSolution = savedSolutions?.find((s: any) => s.Title === sol.title);
      if (!targetSolution) continue;

      const solutionId = targetSolution.id;

      // Deletar steps antigos
      const { data: existingSteps } = await supabase
        .from("solutions_steps")
        .select("id")
        .eq("solution_id", solutionId);

      const existingStepIds = existingSteps?.map((s) => s.id) ?? [];
      const incomingStepIds = sol.steps.filter((st: any) => st.id).map((st: any) => st.id);
      const stepsToDelete = existingStepIds.filter((id) => !incomingStepIds.includes(id));

      if (stepsToDelete.length > 0) {
        await supabase.from("solutions_steps").delete().in("id", stepsToDelete);
      }

      // Upsert nos novos steps
      const stepsPayload = sol.steps.map((step: any, index: number) => ({
        ...(step.id ? { id: step.id } : {}),
        solution_id: solutionId,
        step_text: step.step_text,
        Step_order: index,
      }));

      await supabase.from("solutions_steps").upsert(stepsPayload, { onConflict: "id" });
    }

    // ✅ REDIRECIONAR APÓS SUCESSO
    router.replace("/company-profile");
  }

  if (loading) return null;

  return (
    <PlasmicCEditProfile
      company={company}
      solutionsData={formData}
      onSave={handleSave}
    />
  );
}
