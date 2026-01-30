import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CEditProfileSentinelaV4() {
  const router = useRouter();
  const supabase = getSupabaseC();

  useEffect(() => {
    console.log("🔥 SENTINELA v4.0 CARREGADA");
  }, []);

  async function handleDone() {
    alert("🔥 BOTÃO DONE DISPAROU (sentinela v4)");
    console.log("👉 Iniciando leitura dos inputs do Plasmic");

    // 🧲 Coleta BRUTA dos inputs visíveis
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

      if (key && el.value) {
        values[key] = el.value;
      }
    });

    console.log("✅ INPUTS LIDOS DO PLASMIC:", values);
    alert("✅ Inputs lidos do Plasmic (veja o console)");

    // 🔐 Confirma auth
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      alert("❌ USUÁRIO NÃO LOGADO");
      console.error("Usuário não autenticado");
      return;
    }

    console.log("🔐 USUÁRIO LOGADO:", authData.user.email);
    alert("🔐 Auth OK: " + authData.user.email);

    // 🧪 Payload MINIMO — só colunas que existem
    const payload = {
      user_id: authData.user.id,
      about: JSON.stringify(values), // joga tudo no about TEMPORARIAMENTE
      created_at: new Date().toISOString(),
    };

    console.log("📦 PAYLOAD ENVIADO AO SUPABASE:", payload);

    // 🚀 INSERT REAL
    const { error } = await supabase.from("companies").insert(payload);

    if (error) {
      console.error("❌ ERRO SUPABASE:", error);
      alert("❌ ERRO SUPABASE:\n" + error.message);
      return;
    }

    // 🎉 SUCESSO TOTAL
    console.log("🎉 SUPABASE CONFIRMOU INSERT");
    alert("🎉 DADOS SALVOS COM SUCESSO!");

    // 🔁 REDIRECIONAMENTO CONTROLADO
    alert("➡️ Redirecionando para /find-a-affiliate");
    router.push("/find-a-affiliate");
  }

  return (
    <GlobalContextsProvider>
      <PlasmicCEditProfile
        overrides={{
          // 🔴 AQUI ESTÁ O CONTROLE
          doneButton: {
            props: {
              onClick: handleDone,
            },
          },
        }}
      />

      {/* 🔥 BOTÃO EXTRA DE DEBUG (fora do Plasmic) */}
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
        🔥 SENTINELA v4 TESTE BACKEND
      </button>
    </GlobalContextsProvider>
  );
}
