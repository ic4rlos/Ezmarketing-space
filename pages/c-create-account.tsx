import * as React from "react";
import { useRouter } from "next/router";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    if (loading) return;

    console.log("🔹 handleCreateAccount chamada");
    console.log("📌 STATE:", { email, password, confirmPassword });

    setError(null);

    if (!email || !password) {
      console.log("❌ Email ou password vazio");
      setError("Email and password required");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("📦 Supabase data:", data);
    console.log("⚠️ Supabase error:", error);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-edit-profile");
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <PlasmicLCCreateAccount
          overrides={{
            /* =========================
               EMAIL (ESPIÃO)
            ========================== */
            email: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("🟢 EMAIL onChange:", e.target.value);
                  setEmail(e.target.value);
                },
              },
            },

            /* =========================
               PASSWORD (ESPIÃO)
            ========================== */
            password: {
              props: {
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("🟢 PASSWORD onChange:", e.target.value);
                  setPassword(e.target.value);
                },
              },
            },

            /* =========================
               CONFIRM PASSWORD (ESPIÃO)
            ========================== */
            confirmPassword: {
              props: {
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log(
                    "🟡 CONFIRM PASSWORD onChange:",
                    e.target.value
                  );
                  setConfirmPassword(e.target.value);
                },
              },
            },

            /* =========================
               BOTÃO — DOMINADO
            ========================== */
            loginButton: {
              props: {
                type: "button",
                submitsForm: false, // 🔥 CRÍTICO
                onClick: handleCreateAccount,
                disabled: loading,
              },
            },

            /* =========================
               ERRO
            ========================== */
            errorText: {
              props: {
                children: error,
                style: {
                  display: error ? "block" : "none",
                  color: "red",
                  marginTop: 8,
                },
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
