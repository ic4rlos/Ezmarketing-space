import * as React from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

export default function CCreateAccount() {
  const router = useRouter();

  // Estado React (fonte da verdade)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setSubmitting(true);

    // ✅ Supabase criado SOMENTE no evento (client-side)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-login");
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
            email: {
              value: email,
              onChange: (e: any) => setEmail(e.target.value),
            },

            password: {
              value: password,
              onChange: (e: any) => setPassword(e.target.value),
            },

            confirmPassword: {
              value: confirmPassword,
              onChange: (e: any) => setConfirmPassword(e.target.value),
            },

            loginButton: {
              onClick: handleCreateAccount,
            },

            errorText: {
              children: error ?? "",
              style: { display: error ? "block" : "none" },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
