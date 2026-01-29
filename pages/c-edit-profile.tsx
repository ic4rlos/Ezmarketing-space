// pages/c-edit-profile.tsx
import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CEditProfile() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("🟡 Página carregando...");
  const [lastAction, setLastAction] = useState("Nenhuma");

  // ============================
  // 🔍 SENTINELA 1 — Página executou
  // ============================
  useEffect(() => {
    console.log("🔥 C-EDIT-PROFILE TSX EXECUTOU");
    alert("🔥 TSX DA PÁGINA c-edit-profile.tsx EXECUTOU");
    setStatus("🟢 TSX executado");
  }, []);

  // ============================
  // 🔐 SENTINELA 2 — Auth Supabase
  // ============================
  useEffect(() => {
    async function checkAuth() {
      alert("🔐 Verificando auth no Supabase (c-)");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("🔐 AUTH USER:", user);
      console.log("🔐 AUTH ERROR:", error);

      if (!user) {
        alert("❌ NÃO LOGADO — redirecionando");
        setStatus("❌ Não logado");
        router.replace("/c-login");
        return;
      }

      alert(`✅ LOGADO COMO: ${user.email}`);
      setUser(user);
      setStatus("✅ Auth OK");
    }

    checkAuth();
  }, []);

  // ============================
  // 💾 SENTINELA 3 — Salvamento fake
  // ============================
  async function handleSaveTest() {
    alert("💾 BOTÃO DONE FOI CLICADO");
    setLastAction("Clique no DONE");

    if (!user) {
      alert("❌ Sem usuário — não vai salvar");
      return;
    }

    alert("📡 Tentando falar com o Supabase...");
    console.log("📡 Tentando salvar teste no Supabase");

    const { data, error } = await supabase
      .from("companies")
      .upsert({
        user_id: user.id,
        company_name: "TESTE SENTINELA",
      })
      .select();

    console.log("💾 DATA:", data);
    console.log("💾 ERROR:", error);

    if (error) {
      alert("❌ ERRO AO SALVAR (ver console)");
      setStatus("❌ Erro Supabase");
      return;
    }

    alert("✅ SALVOU NO SUPABASE (companies)");
    setStatus("✅ Salvamento OK");
  }

  // ============================
  // 🧠 RENDER
  // ============================
  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* ============================
            🚨 PAINEL SENTINELA VISUAL
           ============================ */}
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            background: "black",
            color: "lime",
            padding: 12,
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          <div><b>STATUS:</b> {status}</div>
          <div><b>LAST ACTION:</b> {lastAction}</div>
          <div><b>USER:</b> {user ? user.email : "null"}</div>
          <button
            style={{
              marginTop: 8,
              padding: "6px 10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleSaveTest}
          >
            TESTE DONE (BACKEND)
          </button>
        </div>

        {/* ============================
            🎨 PLASMIC (UI BURRA)
           ============================ */}
        <PlasmicCEditProfile />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
