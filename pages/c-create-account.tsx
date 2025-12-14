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

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();

    if (loading) return;

    setError(null);

    // =========================
    // FRONT-END VALIDATIONS
    // =========================
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
      const msg = error.message.toLowerCase();

      if (msg.includes("password")) {
        setError("Password does not meet security requirements.");
      } else if (msg.includes("email")) {
        setError("Invalid or already registered email.");
      } else {
        setError("Unable to create account.");
      }

      setLoading(false);
      return;
    }

    // ✅ Success
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
            email: {
              props: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value),
              },
            },

            /* =========================
               PASSWORD
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
            confirmpassword: {
              props: {
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value),
              },
            },

            /* =========================
               TERMS CHECKBOX
            ========================== */
            checkbox2: {
              props: {
                checked: acceptedTerms,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setAcceptedTerms(e.target.checked),
              },
            },

            /* =========================
               FORM
            ========================== */
            form: {
              props: {
                onSubmit: handleCreateAccount,
                noValidate: true,
              },
            },

            /* =========================
               SUBMIT BUTTON
            ========================== */
            loginButton: {
              props: {
                type: "submit",
                disabled: loading,
                onClick: handleCreateAccount, // redundante por segurança
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
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
