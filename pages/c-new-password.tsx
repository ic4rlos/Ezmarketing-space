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

  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleRequestReset(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();

    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/c-code-verification-new-password`,
    });

    setLoading(false);

    if (error) {
      setError("Unable to send recovery email");
      return;
    }

    // sucesso → segue o fluxo
    router.push("/c-code-verification-new-password");
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
               INPUT EMAIL
            ========================== */
            email: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value),
              },
            },

            /* =========================
               FORM
            ========================== */
            form: {
              props: {
                onSubmit: handleRequestReset,
                noValidate: true,
              },
            },

            /* =========================
               BOTÃO SUBMIT
            ========================== */
            submitButton: {
              props: {
                type: "submit",
                onClick: handleRequestReset,
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
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
