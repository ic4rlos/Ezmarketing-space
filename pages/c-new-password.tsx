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
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /* =========================
     HANDLER — APPLY NEW PASSWORD
  ========================== */
  async function handleSetNewPassword(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();

    setError(null);

    if (!password || !confirmPassword) {
      setError("Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError("Unable to update password");
      return;
    }

    router.push("/find-a-affiliate");
  }

  /* =========================
     RENDER — VIEW ONLY
  ========================== */
  return (
    <>
      <Head>
        <title>Create new password</title>
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
                 SUBMIT BUTTON
              ========================== */
              loginButton: {
                props: {
                  onClick: handleSetNewPassword,
                  disabled: loading,
                },
                children: loading ? "Saving..." : "Save new password",
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
