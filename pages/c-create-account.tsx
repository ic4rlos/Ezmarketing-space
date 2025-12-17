import * as React from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

// Supabase client (ajuste se já existir em outro lugar)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CCreateAccount() {
  const router = useRouter();

  // 🔒 Estado controlado (React)
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

    try {
      setSubmitting(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/c-login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* 
          🔥 Código trunfo:
          - Plasmic como root
          - Nenhum wrapper visual
          - Lógica isolada
        */}
        <PlasmicLCCreateAccount
          overrides={{
            email: {
              onChange: (e: any) => setEmail(e.target.value),
              value: email,
            },

            password: {
              onChange: (e: any) => setPassword(e.target.value),
              value: password,
            },

            confirmPassword: {
              onChange: (e: any) => setConfirmPassword(e.target.value),
              value: confirmPassword,
            },

            loginButton: {
              onClick: handleCreateAccount,
            },

            errorText: {
              children: error ?? "",
              style: {
                display: error ? "block" : "none",
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
