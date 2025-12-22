import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getSupabaseC } from "../lib/c-supabaseClient";

import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/PlasmicCreateAccount.module.css";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    setError(null);

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://www.ezmarketing.space/c-edit-profile",
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-check-email");
  }

  async function handleGoogleSignUp() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://www.ezmarketing.space/c-edit-profile",
      },
    });
  }

  return (
    <>
      <Head>
        <title>Create account</title>
      </Head>

      <div className={projectcss.root}>
        <div className={projectcss.card}>
          <h2 className={projectcss.title}>Create corporate account</h2>

          <AntdInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="user"
          />

          <AntdInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="lock"
          />

          <AntdInput
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon="lock"
          />

          <label className={projectcss.checkbox}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            I accept the terms and conditions
          </label>

          {error && <p className={projectcss.error}>{error}</p>}

          <LoginButton
            label="Create account"
            onClick={handleCreateAccount}
            loading={loading}
          />

          <SignInWithGoogle
            label="Sign up with Google"
            onClick={handleGoogleSignUp}
          />

          <p className={projectcss.footer}>
            Already have an account? <a href="/c-login">Log in</a>
          </p>
        </div>
      </div>
    </>
  );
}
