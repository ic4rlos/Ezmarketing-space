import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CEditProfileSentinelaV41() {
  const router = useRouter();
  const supabase = getSupabaseC();

  useEffect(() => {
    console.log("🔥 SENTINELA v4.1 CARREGADA");
  }, []);

  async function handleDone() {
    alert("🔥 BOTÃO DONE DISPAROU (sentinela v4.1)");

    // 1️⃣ LER INPUTS DO DOM (PLASMIC)
    const inputs = Array.from(
      document.querySelectorAll("input, textarea, select")
    );

    const values: Record<string, any> = {};

    inputs.forEach((el: any) => {
      const key =
        el.placeholder ||
        el.name ||
        el.getAttribute("aria-label") ||
        el.id;

      if (key) {
        values[key] = el.value;
      }
    });

    console.log("✅ INPUTS LIDOS DO PLASMIC:", values);
    alert("✅ Inputs do Plasmic lidos (veja o console)");

    // 2️⃣ AUTH
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      alert("❌ USUÁRIO NÃO LOGADO");
      console.error("Auth falhou");
      return;
    }

    alert("🔐 Auth OK: " + authData.user.email);

    // 3️⃣ PAYLOAD MÍNIMO (SEM debug_payload)
    const payload = {
      user_id: authData.user.id,
      about: JSON.stringify(values),
      created_at: new Date().toISOString(),
    };

    console.log("📦 PAYLOAD SUPABASE:", payload);

    // 4️⃣ INSERT
    const { error } = await supabase.from("companies").insert(payload);

    if (error) {
      console.error("❌ ERRO SUPABASE:", error);
      alert("❌ ERRO SUPABASE:\n" + error.message);
      return;
    }

    // 5️⃣ SUCESSO + REDIRECT
    alert("🎉 DADOS SALVOS COM SUCESSO");
    alert("➡️ Redirecionando para /find-a-affiliate");
    router.push("/find-a-affiliate");
  }

  return (
    <GlobalContextsProvider>
      {/* ⚠️ OBRIGATÓRIO: UM ÚNICO FILHO */}
      <div>
        <PlasmicCEditProfile
          overrides={{
            doneButton: {
              props: {
                onClick: handleDone,
              },
            },
          }}
        />

        {/* 🔥 BOTÃO SENTINELA FORA DO PLASMIC */}
        <button
          onClick={handleDone}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "red",
            color: "white",
            padding: "14px 18px",
            fontWeight: "bold",
            zIndex: 9999,
          }}
        >
          🔥 SENTINELA v4.1 TESTE
        </button>
      </div>
    </GlobalContextsProvider>
  );
}
