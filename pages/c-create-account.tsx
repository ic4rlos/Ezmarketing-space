import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getSupabaseC } from "../lib/c-supabaseClient";

import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

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

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f7",
        }}
      >
        <div
          style={{
            width: 800,
            minHeight: 547,
            background: "#fff",
            padding: 32,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Create corporate account
          </h2>

          <AntdInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AntdInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AntdInput
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label style={{ fontSize: 12 }}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            I accept the terms and conditions
          </label>

          {error && (
            <p style={{ color: "red", fontSize: 12 }}>{error}</p>
          )}

          <LoginButton onClick={handleCreateAccount}>
            {loading ? "Creating account..." : "Create account"}
          </LoginButton>

          <SignInWithGoogle onClick={handleGoogleSignUp}>
            Sign up with Google
          </SignInWithGoogle>

          <p style={{ fontSize: 12, textAlign: "center" }}>
            Already have an account?{" "}
            <a href="/c-login">Log in</a>
          </p>
        </div>
      </div>
    </>
  );
}
