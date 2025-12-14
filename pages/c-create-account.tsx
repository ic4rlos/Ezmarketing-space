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

    /* =========================
       FRONTEND VALIDATION
    ========================== */
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

    /* =========================
       SUPABASE SIGN UP
    ========================== */
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();

      if (msg.includes("already registered")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("password")) {
        setError(
          "Password is too weak. Please choose a stronger password."
        );
      } else if (msg.includes("email")) {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to create account. Please try again.");
      }

      setLoading(false);
      return;
    }

    /* =========================
       SUCCESS
    ========================== */
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
               BUTTON
            ========================== */
            loginButton: {
              props: {
                type: "submit",
                disabled: loading,
                onClick: handleCreateAccount,
              },
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
                  marginTop: 8,
                },
              },
            },

            /* =========================
               TERMS CHECKBOX
            ========================== */
            checkbox2: {
              props: {
                onChange: (_: any, checked: boolean) =>
                  setAcceptedTerms(checked),
              },
            },

            /* =========================
               GOOGLE SIGN IN
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
