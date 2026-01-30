import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabaseC } from "../lib/c-supabaseClient";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfilePage() {
  const router = useRouter();

  useEffect(() => {
    console.log("🔥 TSX c-edit-profile EXECUTOU");
    alert("🔥 TSX EXECUTOU — SENTINELA ATIVA");
  }, []);

  async function SENTINELA_SUBMIT() {
    alert("🟡 1/3 — LENDO INPUTS DO PLASMIC");

    const inputs = Array.from(
      document.querySelectorAll("input, textarea, select")
    ) as HTMLInputElement[];

    if (inputs.length === 0) {
      alert("❌ NENHUM INPUT ENCONTRADO — PLASMIC NÃO ENTREGOU NADA");
      return;
    }

    const data: Record<string, any> = {};
    inputs.forEach((el) => {
      const key = el.name || el.id || el.placeholder || "sem_nome";
      data[key] = el.value;
    });

    console.log("🧪 INPUTS LIDOS DO PLASMIC:", data);
    alert("✅ INPUTS LIDOS — veja o console");

    // ===============================
    alert("🟡 2/3 — ENVIANDO AO SUPABASE");

    const supabase = getSupabaseC();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth?.user) {
      alert("❌ USUÁRIO NÃO LOGADO");
      return;
    }

    const payload = {
      user_id: auth.user.id,
      debug_payload: data,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("companies").insert(payload);

    if (error) {
      console.error("❌ ERRO SUPABASE:", error);
      alert("❌ SUPABASE BLOQUEOU INSERT (veja console)");
      return;
    }

    alert("✅ 2/3 — SUPABASE CONFIRMOU INSERT");

    // ===============================
    alert("🟢 3/3 — REDIRECIONANDO");
    router.push("/find-affiliate");
  }

  return (
    <GlobalContextsProvider>
      {/* 👇 PLASMIC VOLTOU A EXISTIR */}
      <PlasmicCEditProfile />

      {/* 👇 SENTINELA SOBREPOSTO */}
      <button
        onClick={SENTINELA_SUBMIT}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 99999,
          background: "red",
          color: "white",
          padding: "14px 18px",
          fontWeight: "bold",
          borderRadius: 8,
          fontSize: 14,
        }}
      >
        🔥 SENTINELA TESTE BACKEND
      </button>
    </GlobalContextsProvider>
  );
}
