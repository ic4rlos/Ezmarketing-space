import * as React from "react";
import { useRouter } from "next/router";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(formValue: any) {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const { email, password, confirmPassword } = formValue || {};

    if (!email || !password) {
      setError("Missing credentials");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-edit-profile");
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
            form2: {
              onFinish: handleSubmit,
            },

            errorText: {
              children: error ?? "",
              style: { display: error ? "block" : "none" },
            },

            loginButton: {
              disabled: submitting,
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
