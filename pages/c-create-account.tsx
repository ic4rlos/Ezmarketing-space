import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { getSupabaseC } from "../lib/c-supabaseClient";

// 🔥 CLIENT-ONLY COMPONENTS
const AntdInput = dynamic(
  () => import("../components/ui/AntdInput"),
  { ssr: false }
);

const LoginButton = dynamic(
  () => import("../components/LoginButton"),
  { ssr: false }
);

const Checkbox = dynamic(
  () =>
    import(
      "../components/plasmic/blank_project/PlasmicCheckbox"
    ),
  { ssr: false }
);

export default function CreateAccountPage() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password) {
      setError("All fields are required.");
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
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 800,
            padding: 32,
            borderRadius: 12,
            border: "1px solid #eaeaea",
            background: "#fff",
          }}
        >
          <h1 style={{ marginBottom: 24 }}>
            Create your account
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <AntdInput
              value={email}
              onChange={(e: any) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
            />

            <AntdInput
              type="password"
              value={password}
              onChange={(e: any) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />

            <Checkbox
              value={acceptedTerms}
              onChange={(v: boolean) =>
                setAcceptedTerms(v)
              }
              label={
                <span style={{ fontSize: 10 }}>
                  I accept the{" "}
                  <a
                    href="#"
                    style={{
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    terms and conditions
                  </a>
                </span>
              }
            />

            {error && (
              <div
                style={{
                  color: "#d32f2f",
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <LoginButton
                onClick={handleCreateAccount}
              >
                {loading
                  ? "Creating..."
                  : "Create account"}
              </LoginButton>
            </div>

            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                fontSize: 12,
              }}
            >
              Already have an account?{" "}
              <Link href="/c-login">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
