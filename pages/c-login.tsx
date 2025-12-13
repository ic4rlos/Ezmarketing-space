import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

// Supabase corporativo
import getSupabaseC from "../lib/c-supabaseClient";

export default function CLogin() {
  const router = useRouter();
  const supabase = React.useMemo(() => getSupabaseC(), []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // sucesso
    router.push("/find-a-affiliate");
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <PlasmicLCLogin
          overrides={{
            // FORM FIELD EMAIL
            email: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value),
              },
            },

            // FORM FIELD PASSWORD
            password: {
              props: {
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value),
              },
            },

            // BOTÃO DE LOGIN (visual)
            loginButton: {
              props: {
                onClick: handleLogin,
                disabled: loading,
              },
            },

            // TEXTO DE ERRO (se existir no design)
            errorText: error
              ? {
                  children: error,
                }
              : undefined,
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
