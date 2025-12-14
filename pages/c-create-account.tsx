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

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();

    setError(null);

    // 🔒 validações locais (antes de chamar Supabase)
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Mensagens humanas e controladas
      if (error.message.toLowerCase().includes("already")) {
        setError("This email is already registered.");
      } else if (error.message.toLowerCase().includes("password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Unable to create account. Please try again.");
      }

      setLoading(false);
      return;
    }

    // ✅ sucesso
    router.push("/find-a-affiliate");
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
               EMAIL
            ========================== */
            input2: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value),
              },
            },

            /* =========================
               PASSWORD
            ========================== */
            input3: {
              props: {
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value),
              },
            },

            /* =========================
               CONFIRM PASSWORD
            ========================== */
            input4: {
              props: {
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value),
              },
            },

            /* =========================
               FORM
            ========================== */
            form2: {
              props: {
                onSubmit: handleCreateAccount,
                noValidate: true,
              },
            },

            /* =========================
               CREATE ACCOUNT BUTTON
            ========================== */
            loginButton: {
              props: {
                type: "submit",
                disabled: loading,
                onClick: handleCreateAccount,
              },
            },

            /* =========================
               ERROR MESSAGE
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
               TERMS CHECKBOX
            ========================== */
            checkbox2: {
              props: {
                onChange: (checked: boolean) => {
                  setAcceptedTerms(checked);
                },
              },
            },

            /* =========================
               GOOGLE SIGNUP
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
