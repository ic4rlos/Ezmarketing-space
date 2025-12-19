import * as React from "react";
import Head from "next/head";
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

  /* =========================
     STATE — ALPHA STYLE
  ========================== */
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /* =========================
     HANDLER — FONTE DE VERDADE
  ========================== */
  async function handleRequestReset(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();

    setError(null);

    if (!email) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/c-code-verification-new-password`,
    });

    setLoading(false);

    if (error) {
      setError("Unable to send recovery email");
      return;
    }

    router.push("/c-code-verification-new-password");
  }

  /* =========================
     RENDER — VIEW ONLY
  ========================== */
  return (
    <>
      <Head>
        <title>New password</title>
      </Head>

      <GlobalContextsProvider>
        <PageParamsProvider__
          route={router.pathname}
          params={router.query}
          query={router.query}
        >
          <PlasmicLCNewPassword
            overrides={{
              /* =========================
                 EMAIL INPUT
              ========================== */
              email: {
                props: {
                  value: email,
                  type: "email",
                  placeholder: "Email",
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
                 SUBMIT BUTTON
              ========================== */
              loginButton: {
                props: {
                  onClick: handleRequestReset,
                  disabled: loading,
                },
                children: loading ? "Sending..." : "Send recovery email",
              },

              /* =========================
                 ERROR TEXT
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
    </>
  );
}
