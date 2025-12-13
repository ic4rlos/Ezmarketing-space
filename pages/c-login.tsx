import * as React from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

// 🔑 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CLogin() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(formData: any) {
    setLoading(true);
    setErrorMessage(null);

    const email = formData?.email;
    const password = formData?.password;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 🔴 Aqui entram TODAS as mensagens possíveis
      if (error.message === "Invalid login credentials") {
        setErrorMessage("Email ou senha inválidos");
      } else {
        setErrorMessage(error.message);
      }
    } else {
      // ✅ Login ok
      router.push("/find-a-affiliate"); // ajuste se quiser
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
          overrides={{
            form: {
              props: {
                onFinish: handleLogin,
              },
            },

            errorText: {
              props: {
                children: errorMessage ?? "",
                style: {
                  display: errorMessage ? "block" : "none",
                  color: "red",
                  marginTop: "8px",
                },
              },
            },

            loginButton: {
              props: {
                disabled: loading,
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
