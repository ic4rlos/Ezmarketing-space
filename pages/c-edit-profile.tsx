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
  const [status, setStatus] = useState("🟡 iniciando...");
  const [logs, setLogs] = useState<string[]>([]);

  function log(msg: string) {
    console.log(msg);
    setLogs((l) => [...l, msg]);
  }

  // ============================
  // 🔥 SENTINELA 1 — TSX executou
  // ============================
  useEffect(() => {
    log("🔥 TSX c-edit-profile EXECUTOU");
    alert("🔥 TSX EXECUTOU (sem upload)");
    setStatus("🟢 TSX rodando");
  }, []);

  // ============================
  // 🔐 SENTINELA 2 — Auth
  // ============================
  useEffect(() => {
    async function checkAuth() {
      log("🔐 Verificando auth Supabase (c-)");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        log("❌ ERRO AUTH: " + error.message);
        setStatus("❌ erro auth");
        return;
      }

      if (!user) {
        log("❌ NÃO LOGADO");
        alert("❌ NÃO LOGADO — redirect");
        router.replace("/c-login");
        return;
      }

      log("✅ LOGADO: " + user.email);
      setUser(user);
      setStatus("✅ auth ok");
    }

    checkAuth();
  }, []);

  // ============================
  // 💾 SENTINELA 3 — Insert fake
  // ============================
  async function handleTestSave() {
    log("💾 BOTÃO TESTE CLICADO");

    if (!user) {
      alert("❌ sem user");
      return;
    }

    log("📡 Enviando teste para Supabase...");

    const { error } = await supabase.from("companies").upsert({
      user_id: user.id,
      company_name: "TESTE SEM UPLOAD",
    });

    if (error) {
      log("❌ ERRO SUPABASE: " + error.message);
      alert("❌ ERRO SUPABASE");
      return;
    }

    log("✅ SALVO COM SUCESSO");
    alert("✅ SALVOU NO SUPABASE");
    setStatus("✅ salvamento ok");
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
            🚨 PAINEL SENTINELA
           ============================ */}
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 9999,
            background: "#111",
            color: "#0f0",
            padding: 16,
            borderRadius: 8,
            fontFamily: "monospace",
            maxWidth: 400,
          }}
        >
          <div><b>STATUS:</b> {status}</div>
          <div><b>USER:</b> {user ? user.email : "null"}</div>

          <button
            style={{
              marginTop: 10,
              padding: "6px 10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleTestSave}
          >
            TESTAR BACKEND (SEM UPLOAD)
          </button>

          <hr style={{ margin: "10px 0", borderColor: "#333" }} />

          <div style={{ maxHeight: 200, overflow: "auto" }}>
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>

        {/* ============================
            🎨 PLASMIC (UI PASSIVA)
           ============================ */}
        <PlasmicCEditProfile />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
