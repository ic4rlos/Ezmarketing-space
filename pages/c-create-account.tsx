import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    setError(null);

    const { email, password } = values;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/c-login");
  };

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* 
          ⚠️ SONDA SUICIDA ATIVA
          Plasmic controla:
          - layout
          - tokens
          - breakpoints
          - assets
          - estrutura interna
          React só injeta comportamento
        */}
        <PlasmicLCCreateAccount
          overrides={{
            form2: {
              onFinish: handleSubmit,
            },

            errorText: {
              children: error ?? "",
              style: {
                display: error ? "block" : "none",
              },
            },

            loginButton: {
              props: {
                disabled: submitting,
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
