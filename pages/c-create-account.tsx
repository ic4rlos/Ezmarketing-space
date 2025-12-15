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
  const [confirmPassword, setConfirmPassword] = React.useState(""); // ignorado
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    if (loading) return;

    console.log("🔹 handleCreateAccount foi chamada");
    console.log("📌 STATE:", { email, password, confirmPassword });

    setError(null);

    // 🔥 TESTE: ignorando COMPLETAMENTE confirm password
    if (!email || !password) {
      console.log("❌ Email ou password vazio");
      setError("Email and password required.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("📦 Supabase data:", data);
      console.log("⚠️ Supabase error:", error);

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/c-edit-profile");
    } catch (err) {
      console.error("🔥 Erro inesperado:", err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
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
               EMAIL (COM ESPIÃO)
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
               PASSWORD (COM ESPIÃO)
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
               CONFIRM PASSWORD (IGNORADO)
            ========================== */
            confirmpassword: {
              props: {
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log(
                    "🔴 CONFIRM PASSWORD onChange (NÃO DEVERIA ACONTECER):",
                    e.target.value
                  );
                  setConfirmPassword(e.target.value);
                },
              },
            },

            /* =========================
               BOTÃO (ÚNICO GATILHO)
            ========================== */
            loginButton: {
              props: {
                type: "button",
                onClick: handleCreateAccount,
                disabled: loading,
              },
            },

            /* =========================
               TEXTO DE ERRO
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

            /* =========================
               GOOGLE SIGNUP
            ========================== */
            signInWithGoogle: {
              props: {
                onClick: async () => {
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                  });
                },
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
