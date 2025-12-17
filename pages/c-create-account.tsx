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

  // 🔥 React é a ÚNICA fonte da verdade
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Email and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

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
               EMAIL — INPUT REAL
            ========================== */
            email: {
              render: () => (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    console.log("EMAIL:", e.target.value);
                    setEmail(e.target.value);
                  }}
                />
              ),
            },

            /* =========================
               PASSWORD — INPUT REAL
            ========================== */
            password: {
              render: () => (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    console.log("PASSWORD:", e.target.value);
                    setPassword(e.target.value);
                  }}
                />
              ),
            },

            /* =========================
               CONFIRM PASSWORD — INPUT REAL
            ========================== */
            confirmPassword: {
              render: () => (
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    console.log("CONFIRM:", e.target.value);
                    setConfirmPassword(e.target.value);
                  }}
                />
              ),
            },

            /* =========================
               BOTÃO — PLASMIC
            ========================== */
            loginButton: {
              props: {
                type: "button",
                disabled: loading,
                onClick: handleCreateAccount,
              },
            },

            /* =========================
               ERRO
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
