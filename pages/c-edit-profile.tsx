import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import supabase from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

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

  console.log("🧠 COMPONENT RENDER");

  useEffect(() => {
    console.log("🔄 useEffect loadUser DISPARADO");

    async function loadUser() {
      console.log("👤 Buscando usuário autenticado...");
      const { data, error } = await supabase.auth.getUser();
      console.log("👤 Resultado getUser:", data);
      console.log("👤 Erro getUser:", error);
      setUser(data?.user ?? null);
    }

    loadUser();
  }, []);

  useEffect(() => {
    console.log("🔄 useEffect loadAll DISPARADO — user:", user);

    if (!user) {
      console.log("⚠️ user ainda não existe");
      if (!loading) setLoading(false);
      return;
    }

    async function loadAll() {
      console.log("🏢 Buscando company do user:", user.id);

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      console.log("🏢 companyData:", companyData);
      console.log("🏢 companyError:", companyError);

      if (companyError || !companyData) {
        console.log("❌ Empresa não encontrada ou erro");
        setLoading(false);
        return;
      }

      setCompany(companyData);

      console.log("🧩 Buscando solutions da company:", companyData.id);

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

      console.log("🧩 solutions:", solutions);
      console.log("🧩 solutionsError:", solutionsError);

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

      console.log("🧩 structured solutions:", structured);

      setFormData(structured);
      setLoading(false);
    }

    loadAll();
  }, [user]);

  async function handleSave(payload: any) {
    console.log("=================================================");
    console.log("🔥🔥🔥 SAVE DISPARADO 🔥🔥🔥");
    console.log("⏱ Timestamp:", new Date().toISOString());
    console.log("📦 PAYLOAD COMPLETO:", payload);

    if (!user) {
      console.error("🚨 USER NULL — SAVE ABORTADO");
      return;
    }

    const { company: companyValues, solutions } = payload;

    console.log("🏢 companyValues:", companyValues);
    console.log("🧩 solutions:", solutions);

    // LOGO DEBUG
    const rawLogo = companyValues["Company Logo"];
    console.log("🔎 RAW LOGO:", rawLogo);
    console.log("🔎 TYPEOF RAW LOGO:", typeof rawLogo);

    let logoUrl: string | null = null;

    if (typeof rawLogo === "string") {
      console.log("✅ Logo string direta");
      logoUrl = rawLogo;
    } else if (rawLogo?.url) {
      console.log("✅ Logo objeto.url");
      logoUrl = rawLogo.url;
    } else if (rawLogo?.files?.[0]?.url) {
      console.log("✅ Logo files[0].url");
      logoUrl = rawLogo.files[0].url;
    } else {
      console.log("⚠️ Logo não identificado");
    }

    console.log("🎯 logoUrl final:", logoUrl);

    // IMAGE DEBUG
    const rawImage = companyValues["Company image"];
    console.log("🖼 RAW IMAGE:", rawImage);
    console.log("🖼 TYPEOF RAW IMAGE:", typeof rawImage);

    let companyImageUrl: string | null = null;

    if (rawImage?.files && rawImage.files.length > 0) {
      console.log("📦 IMAGE detectado como files[]");

      const fileObj = rawImage.files[0];
      console.log("📄 fileObj:", fileObj);

      if (fileObj.contents) {
        console.log("📦 Base64 detectado");

        const base64Data = fileObj.contents;
        const fileExt = fileObj.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `company-images/${user.id}/${fileName}`;
        const buffer = Buffer.from(base64Data, "base64");

        console.log("🚀 Upload path:", filePath);

        const { error: uploadError } = await supabase.storage
          .from("company-logos")
          .upload(filePath, buffer, {
            contentType: fileObj.type,
            upsert: true,
          });

        console.log("📡 uploadError:", uploadError);

        if (!uploadError) {
          const { data } = supabase.storage
            .from("company-logos")
            .getPublicUrl(filePath);

          companyImageUrl = data.publicUrl;
          console.log("✅ companyImageUrl:", companyImageUrl);
        }
      }
    } else if (typeof rawImage === "string") {
      console.log("✅ IMAGE já string");
      companyImageUrl = rawImage;
    }

    console.log("🎯 companyImageUrl final:", companyImageUrl);

    console.log("🚀 Iniciando UPSERT companies...");

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

    console.log("📡 Resultado upsert company:", savedCompany);
    console.log("📡 Erro upsert company:", companyError);

    if (companyError) return;

    const companyId = savedCompany.id;
    console.log("🏢 companyId:", companyId);

    const { data: existingSolutions } = await supabase
      .from("solutions")
      .select("id")
      .eq("Company_id", companyId);

    console.log("🧩 existingSolutions:", existingSolutions);

    const existingSolutionIds = existingSolutions?.map((s) => s.id) ?? [];
    const incomingSolutionIds = solutions.filter((s: any) => s.id).map((s: any) => s.id);

    console.log("🧩 existingSolutionIds:", existingSolutionIds);
    console.log("🧩 incomingSolutionIds:", incomingSolutionIds);

    const solutionsToDelete = existingSolutionIds.filter(
      (id) => !incomingSolutionIds.includes(id)
    );

    console.log("🧩 solutionsToDelete:", solutionsToDelete);

    if (solutionsToDelete.length > 0) {
      await supabase.from("solutions").delete().in("id", solutionsToDelete);
    }

    const solutionsPayload = solutions.map((sol: any) => ({
      ...(sol.id ? { id: sol.id } : {}),
      Company_id: companyId,
      Title: sol.title,
      Description: sol.description,
      Price: sol.price ? Number(sol.price) : null,
    }));

    console.log("🧩 solutionsPayload:", solutionsPayload);

    const { data: savedSolutions } = await supabase
      .from("solutions")
      .upsert(solutionsPayload, { onConflict: "id" })
      .select();

    console.log("🧩 savedSolutions:", savedSolutions);

    for (const sol of solutions) {
      console.log("🔄 Processando solution:", sol.title);

      const targetSolution = savedSolutions?.find(
        (s: any) => s.Title === sol.title
      );

      if (!targetSolution) {
        console.log("⚠️ targetSolution não encontrado");
        continue;
      }

      const solutionId = targetSolution.id;
      console.log("🧩 solutionId:", solutionId);

      const { data: existingSteps } = await supabase
        .from("solutions_steps")
        .select("id")
        .eq("solution_id", solutionId);

      console.log("🪜 existingSteps:", existingSteps);

      const existingStepIds = existingSteps?.map((s) => s.id) ?? [];
      const incomingStepIds = sol.steps
        .filter((st: any) => st.id)
        .map((st: any) => st.id);

      console.log("🪜 existingStepIds:", existingStepIds);
      console.log("🪜 incomingStepIds:", incomingStepIds);

      const stepsToDelete = existingStepIds.filter(
        (id) => !incomingStepIds.includes(id)
      );

      console.log("🪜 stepsToDelete:", stepsToDelete);

      if (stepsToDelete.length > 0) {
        await supabase.from("solutions_steps").delete().in("id", stepsToDelete);
      }

      const stepsPayload = sol.steps.map((step: any, index: number) => ({
        ...(step.id ? { id: step.id } : {}),
        solution_id: solutionId,
        step_text: step.step_text,
        Step_order: index,
      }));

      console.log("🪜 stepsPayload:", stepsPayload);

      await supabase
        .from("solutions_steps")
        .upsert(stepsPayload, { onConflict: "id" });
    }

    console.log("✅ SAVE FINALIZADO — REDIRECIONANDO");
    router.replace("/company-profile");
  }

  if (loading) return null;

  return (
    <PlasmicCEditProfile
      args={{
        company: company,
        formData: formData,
        onSave: handleSave,
      }}
    />
  );
}
