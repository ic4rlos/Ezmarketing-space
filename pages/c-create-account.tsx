import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  PageParamsProvider as PageParamsProvider__,
  PlasmicLink,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

import { getSupabaseC } from "../lib/c-supabaseClient";

/**
 * CLogin — Código TRUNFO
 *
 * ✔ Plasmic é o ROOT visual
 * ✔ React mantém a lógica
 * ✔ Supabase explícito
 * ✔ Fluxo auditável
 * ✔ Nada mágico
 */
export default function CLogin() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 Fonte única da verdade
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin() {
    if (loading) return;

    console.log("🧪 LOGIN CLICK:", { email, password });

    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("📦 Supabase data:", data);
    console.log("❌ Supabase error:", error);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Login — Ez Marketing</title>
        <meta name="robots" content="noindex" />
      </Head>

      <GlobalContextsProvider>
        <PageParamsProvider__
          route={router.pathname}
          params={router.query}
          query={router.query}
        >
          {/* 
            🔥 PLASMIC COMO ROOT
            Ele desenha.
            Nós mandamos.
          */}
          <PlasmicLCLogin
            // Inputs controlados (sem runtime de form)
            emailInput={{
              value: email,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("EMAIL:", e.target.value);
                setEmail(e.target.value);
              },
            }}
            passwordInput={{
              value: password,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("PASSWORD:", e.target.value);
                setPassword(e.target.value);
              },
            }}

            // Botão explícito
            loginButton={{
              onClick: handleLogin,
              disabled: loading,
            }}

            // Erro visível
            errorText={{
              children: error,
              hidden: !error,
            }}

            // Links continuam declarados
            forgotPasswordLink={{
              component: PlasmicLink,
              href: "/c-reset-password",
            }}

            createAccountLink={{
              component: PlasmicLink,
              href: "/c-create-account",
            }}
          />
        </PageParamsProvider__>
      </GlobalContextsProvider>
    </>
  );
}
