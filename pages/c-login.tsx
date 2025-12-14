import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CLogin() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();

    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Supabase não diferencia usuário vs senha (e isso é correto)
      setError("Invalid email or password");
      return;
    }

    // login OK → redireciona
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
               INPUT PASSWORD
            ========================== */
            password: {
              props: {
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value),
              },
            },

            /* =========================
               FORM
            ========================== */
            form: {
              props: {
                onSubmit: handleLogin,
                noValidate: true,
              },
            },

            /* =========================
               BOTÃO LOGIN
            ========================== */
            loginButton: {
              props: {
                type: "submit",
                onClick: handleLogin,
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

            /* =========================
               GOOGLE LOGIN
            ========================== */
            signInWithGoogle: {
              props: {
                onClick: async () => {
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                  });
                },
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
