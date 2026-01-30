import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CEditProfileSentinelaV42() {
  const router = useRouter();
  const supabase = getSupabaseC();

  useEffect(() => {
    console.log("🔥 SENTINELA v4.2 CARREGADA");
  }, []);

  async function handleDone() {
    alert("🔥 BOTÃO DONE DISPAROU (sentinela v4.2)");

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

      if (key) values[key] = el.value;
    });

    console.log("✅ INPUTS LIDOS DO PLASMIC:", values);
    alert("✅ Inputs lidos (console)");

    // 2️⃣ AUTH
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      alert("❌ USUÁRIO NÃO LOGADO");
      return;
    }

    alert("🔐 Auth OK");

    // 3️⃣ PAYLOAD SIMPLES (SEM debug_payload)
    const payload = {
      user_id: authData.user.id,
      about: JSON.stringify(values),
      created_at: new Date().toISOString(),
    };

    console.log("📦 PAYLOAD:", payload);

    // 4️⃣ INSERT
    const { error } = await supabase.from("companies").insert(payload);

    if (error) {
      console.error("❌ ERRO SUPABASE:", error);
      alert("❌ ERRO SUPABASE:\n" + error.message);
      return;
    }

    // 5️⃣ OK + REDIRECT
    alert("🎉 SALVO COM SUCESSO");
    router.push("/find-a-affiliate");
  }

  return (
    <GlobalContextsProvider>
      {/* ⚠️ UM ÚNICO FILHO */}
      <div>
        <PlasmicCEditProfile
          overrides={
            {
              doneButton: {
                props: {
                  onClick: handleDone,
                },
              },
            } as any
          }
        />

        {/* 🔥 BOTÃO SENTINELA EXTERNO */}
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
          🔥 SENTINELA v4.2
        </button>
      </div>
    </GlobalContextsProvider>
  );
}
