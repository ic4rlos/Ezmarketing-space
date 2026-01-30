import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CEditProfileSentinel() {
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
      alert("❌ NENHUM INPUT ENCONTRADO — PLASMIC BLOQUEANDO");
      return;
    }

    const data: Record<string, any> = {};
    inputs.forEach((el) => {
      const key =
        el.name || el.id || el.placeholder || `input_${Math.random()}`;
      data[key] = el.value;
    });

    console.log("🧪 INPUTS LIDOS DO PLASMIC:", data);
    alert("✅ INPUTS LIDOS — veja console");

    // ===============================
    alert("🟡 2/3 — ENVIANDO AO SUPABASE");

    const supabase = getSupabaseC();

    const {
      data: auth,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !auth?.user) {
      alert("❌ NÃO LOGADO — auth falhou");
      return;
    }

    const payload = {
      user_id: auth.user.id,
      debug_payload: data,
      created_at: new Date().toISOString(),
    };

    console.log("🚀 PAYLOAD SUPABASE:", payload);

    const { error: insertError } = await supabase
      .from("companies")
      .insert(payload);

    if (insertError) {
      console.error("❌ SUPABASE ERRO:", insertError);
      alert("❌ SUPABASE REJEITOU O INSERT\nVeja console");
      return;
    }

    alert("✅ 2/3 — SUPABASE CONFIRMOU INSERT");

    // ===============================
    alert("🟢 3/3 — REDIRECIONANDO");
    router.push("/find-affiliate");
  }

  return (
    <>
      {/* PLASMIC PAGE RENDERIZA NORMALMENTE */}
      {/* BOTÃO SENTINELA FIXO */}
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
    </>
  );
}
