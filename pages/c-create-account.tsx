// pages/c-create-account.tsx
import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

import { getSupabaseC } from "../lib/c-supabaseClient";

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
      password,
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

      <GlobalContextsProvider>
        <PageParamsProvider__
          route={router.pathname}
          params={router.query}
          query={router.query}
        >
          <PlasmicLCCreateAccount
            /* EMAIL */
            email={
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            }

            /* PASSWORD */
            password={
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            }

            /* CONFIRM PASSWORD */
            confirmPassword={
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            }

            /* ERROR TEXT */
            errorText={error ?? ""}

            /* CREATE BUTTON */
            loginButton={
              <button
                type="button"
                disabled={loading}
                onClick={handleCreateAccount}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            }
          />
        </PageParamsProvider__>
      </GlobalContextsProvider>
    </>
  );
}
