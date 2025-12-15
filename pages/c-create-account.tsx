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
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    if (loading) return;

    console.log("🔹 handleCreateAccount foi chamada");
    console.log("Valores digitados:", { email, password, confirmpassword });

    setError(null);

    // 🔹 Validações básicas
    if (!email || !password || !confirmpassword) {
      console.log("❌ Campos obrigatórios não preenchidos");
      setError("All fields are required.");
      return;
    }

    if (password !== confirmpassword) {
      console.log("❌ Senhas não conferem");
      setError("Passwords do not match.");
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
      console.log("🔥 Erro inesperado:", err);
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
               EMAIL
            ========================== */
            email: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value),
              },
            },

            /* =========================
               PASSWORD
            ========================== */
            password: {
              props: {
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value),
              },
            },

            /* =========================
               CONFIRM PASSWORD
            ========================== */
            confirmpassword: {
              props: {
                value: confirmpassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value),
              },
            },

            /* =========================
               BOTÃO (ÚNICO GATILHO)
            ========================== */
            loginButton: {
              props: {
                type: "button",
                onClick: () => setTimeout(handleCreateAccount, 0),
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
