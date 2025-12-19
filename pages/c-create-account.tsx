import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { getSupabaseC } from "../lib/c-supabaseClient";

// Client-only UI
const AntdInput = dynamic(
  () => import("../components/ui/AntdInput"),
  { ssr: false }
);

const LoginButton = dynamic(
  () => import("../components/LoginButton"),
  { ssr: false }
);

const SignInWithGoogle = dynamic(
  () => import("../components/SignInWithGoogle"),
  { ssr: false }
);

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
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

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions");
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
          background: "#d9d9d9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* LOGO */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 700,
            height: 100,
            objectFit: "contain",
            marginBottom: 40,
          }}
        />

        {/* CARD */}
        <div
          style={{
            width: 800,
            maxWidth: "90%",
            background: "#fff",
            borderRadius: 48,
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* TITLE */}
          <h5
            style={{
              marginBottom: 32,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Create corporative account
          </h5>

          {/* EMAIL */}
          <div style={{ width: "100%", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserSvgIcon width={20} height={20} />
              <div style={{ flex: 1 }}>
                <AntdInput
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ width: "100%", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LockSvgIcon width={20} height={20} />
              <div style={{ flex: 1 }}>
                <AntdInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={{ width: "100%", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LockSvgIcon width={20} height={20} />
              <div style={{ flex: 1 }}>
                <AntdInput
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e: any) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* CHECKBOX */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              marginBottom: 16,
            }}
          >
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              I accept the{" "}
              <a
                href="#"
                style={{ fontWeight: 600, textDecoration: "underline" }}
              >
                terms and conditions
              </a>
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                fontSize: 11,
                color: "red",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* BUTTON */}
          <LoginButton
            onClick={handleCreateAccount}
            isDisabled={loading}
            style={{ width: 248, marginBottom: 12 }}
          >
            {loading ? "Creating..." : "Create account"}
          </LoginButton>

          {/* GOOGLE SIGNUP */}
          <div style={{ marginBottom: 20 }}>
            <SignInWithGoogle />
          </div>

          {/* FOOTER */}
          <div style={{ fontSize: 13 }}>
            Already have account?
            <Link
              href="/c-login"
              style={{ marginLeft: 4, fontWeight: 600 }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
