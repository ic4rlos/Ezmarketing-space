import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import { PlasmicLink } from "@plasmicapp/react-web";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CLogin() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 FONTE ÚNICA DA VERDADE
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
            ✔ Plasmic é o root visual
            ✔ React governa lógica
            ✔ Nada escondido
          */}
          <PlasmicLCLogin
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
            loginButton={{
              onClick: handleLogin,
              disabled: loading,
            }}
            errorText={{
              children: error,
              hidden: !error,
            }}
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
