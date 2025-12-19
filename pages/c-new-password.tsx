import * as React from "react";
import { useRouter } from "next/router";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCNewPassword } from "../components/plasmic/ez_marketing_platform/PlasmicLCNewPassword";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CNewPassword() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 FONTE ÚNICA DA VERDADE (ALPHA)
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSetNewPassword(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();
    if (loading) return;

    setError(null);

    // ✅ ÚNICA validação local PERMITIDA
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    // 🔥 Supabase é o juiz final
    if (error) {
      setError(error.message);
      return;
    }

    router.push("/find-a-affiliate");
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <PlasmicLCNewPassword
          overrides={{
            /* =========================
               NEW PASSWORD
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
            confirmPassword: {
              props: {
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value),
              },
            },

            /* =========================
               FORM
            ========================== */
            form: {
              props: {
                onSubmit: handleSetNewPassword,
                noValidate: true,
              },
            },

            /* =========================
               BOTÃO
            ========================== */
            loginButton: {
              props: {
                type: "submit",
                onClick: handleSetNewPassword,
                disabled: loading,
              },
            },

            /* =========================
               ERRO — SEM FILTRO
            ========================== */
            errorText: {
              props: {
                children: error,
                style: {
                  display: error ? "block" : "none",
                  color: "red",
                },
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
