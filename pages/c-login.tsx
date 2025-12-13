import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CLogin() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <PlasmicLCLogin
          /* ========= INPUTS ========= */
          email={{
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value),
          }}
          password={{
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value),
          }}

          /* ========= FORM / LOGIN ========= */
          loginForm={{
            onSubmit: handleLogin,
          }}
          loginButton={{
            disabled: loading,
            onClick: handleLogin,
            children: loading ? "Logando..." : "Login",
          }}

          /* ========= GOOGLE ========= */
          signInWithGoogle={{
            onClick: () =>
              supabase.auth.signInWithOAuth({ provider: "google" }),
          }}

          /* ========= ERROR ========= */
          errorMessage={{
            children: error,
            style: { display: error ? "block" : "none" },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
