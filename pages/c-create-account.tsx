import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Checkbox } from "antd";

import { getSupabaseC } from "../lib/c-supabaseClient";
import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";

export default function CreateAccountPage() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the terms to continue.");
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

    router.push("/c-login");
  }

  return (
    <>
      <Head>
        <title>Create account</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f2f2f2",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 800,
            padding: 40,
            borderRadius: 24,
            background: "#fff",
            marginTop: 20, // leve ajuste para não colar no topo
          }}
        >
          <h1 style={{ fontSize: 26, marginBottom: 32 }}>
            Create account
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* EMAIL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label>Email</label>
              <AntdInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label>Password</label>
              <AntdInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CHECKBOX */}
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            >
              <span style={{ fontSize: 10 }}>
                I accept the terms of use and privacy policy
              </span>
            </Checkbox>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                style={{
                  color: "#d32f2f",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* BUTTON */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LoginButton
                isDisabled={loading}
                onClick={handleCreateAccount}
              >
                {loading ? "Creating..." : "Create account"}
              </LoginButton>
            </div>

            <div style={{ textAlign: "center", fontSize: 12 }}>
              Already have an account?{" "}
              <Link href="/c-login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
