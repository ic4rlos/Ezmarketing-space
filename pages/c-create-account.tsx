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

  /* =========================
     STATE — ÚNICA FONTE DA VERDADE
  ========================== */
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  /* =========================
     CREATE ACCOUNT (BURRO)
  ========================== */
  async function handleCreateAccount(
    e?: React.FormEvent | React.MouseEvent
  ) {
    if (e) e.preventDefault();
    if (loading) return;

    console.log("🧠 STATE AT SUBMIT:", {
      email,
      password,
      confirmPassword,
    });

    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

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
            /* =========================
               EMAIL — INPUT BURRO
            ========================== */
            email: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("🟢 EMAIL:", e.target.value);
                  setEmail(e.target.value);
                },
              },
            },

            /* =========================
               PASSWORD — INPUT BURRO
            ========================== */
            password: {
              props: {
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("🟢 PASSWORD:", e.target.value);
                  setPassword(e.target.value);
                },
              },
            },

            /* =========================
               CONFIRM PASSWORD — INPUT BURRO
               ⚠️ ATENÇÃO AO NOME DO SLOT
            ========================== */
            confirmpassword: {
              props: {
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("🟡 CONFIRM:", e.target.value);
                  setConfirmPassword(e.target.value);
                },
              },
            },

            /* =========================
               BOTÃO — NÃO SUBMETE FORM
            ========================== */
            loginButton: {
              props: {
                type: "button",
                onClick: handleCreateAccount,
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
