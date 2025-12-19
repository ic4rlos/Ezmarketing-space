import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getSupabaseC } from "../lib/c-supabaseClient";

import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";

export default function CCreateAccount() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = getSupabaseC();
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-login");
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>

      <PlasmicLCCreateAccount
        overrides={{
          // EMAIL
          email: {
            as: AntdInput,
            props: {
              type: "email",
              placeholder: "email",
              value: email,
              onChange: (e: any) => setEmail(e.target.value)
            }
          },

          // PASSWORD
          password: {
            as: AntdInput,
            props: {
              type: "password",
              placeholder: "Password",
              value: password,
              onChange: (e: any) => setPassword(e.target.value)
            }
          },

          // CONFIRM PASSWORD
          confirmPassword: {
            as: AntdInput,
            props: {
              type: "password",
              placeholder: "Confirm Password",
              value: confirmPassword,
              onChange: (e: any) =>
                setConfirmPassword(e.target.value)
            }
          },

          // ERROR TEXT
          errorText: {
            props: {
              children: error ?? null,
              style: {
                display: error ? "block" : "none",
                color: "red",
                fontSize: 12
              }
            }
          },

          // BUTTON
          loginButton: {
            as: LoginButton,
            props: {
              onClick: handleCreateAccount,
              isDisabled: loading,
              children: loading
                ? "Creating..."
                : "Create account"
            }
          }
        }}
      />
    </>
  );
}
