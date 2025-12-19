import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getSupabaseC } from "../lib/c-supabaseClient";

import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";
import Checkbox from "../components/Checkbox";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

export default function CCreateAccount() {
  const router = useRouter();

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
      setError("You must accept the terms");
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

      {/* ROOT GRID */}
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns:
            "minmax(0,1fr) min(1200px, 100%) minmax(0,1fr)",
          background: "#d9d9d9",
          alignItems: "center",
          justifyItems: "center"
        }}
      >
        <div style={{ gridColumn: 2, width: "100%" }}>
          {/* LOGO */}
          <img
            src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
            alt="ezmarketing"
            style={{
              width: 700,
              height: 100,
              objectFit: "cover",
              margin: "0 auto 25px",
              display: "block"
            }}
          />

          {/* CARD */}
          <div
            style={{
              width: "100%",
              maxWidth: 800,
              height: 547,
              background: "#fff",
              borderRadius: 51,
              padding: "65px 100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0 auto",
              position: "relative",
              top: 12
            }}
          >
            {/* TITLE */}
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                textAlign: "center"
              }}
            >
              Create corporative account
            </div>

            {/* FORM */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 18
              }}
            >
              <Field
                icon={<UserSvgIcon width={24} height={24} />}
                placeholder="email"
                type="email"
                value={email}
                onChange={setEmail}
              />

              <Field
                icon={<LockSvgIcon width={24} height={24} />}
                placeholder="Password"
                type="password"
                value={password}
                onChange={setPassword}
              />

              <Field
                icon={<LockSvgIcon width={24} height={24} />}
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  fontSize: 12,
                  color: "red",
                  fontStyle: "italic",
                  textAlign: "center"
                }}
              >
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14
              }}
            >
              <LoginButton
                onClick={handleCreateAccount}
                isDisabled={loading}
                style={{ width: 248, height: 37 }}
              >
                {loading ? "Creating..." : "Create account"}
              </LoginButton>

              {/* ✅ PLASMIC CHECKBOX — CORRETO */}
              <Checkbox
                value="accept-terms"
                isChecked={acceptedTerms}
                onChange={(checked) => setAcceptedTerms(checked)}
                label={
                  <span style={{ fontSize: 10 }}>
                    I accept the{" "}
                    <a
                      href="#"
                      style={{
                        fontWeight: 600,
                        textDecoration: "underline"
                      }}
                    >
                      terms and conditions
                    </a>
                  </span>
                }
              />

              <SignInWithGoogle style={{ width: 248, height: 37 }} />
            </div>

            {/* FOOTER */}
            <div style={{ fontSize: 14 }}>
              Already have account?
              <Link href="/c-login" style={{ fontWeight: 600, marginLeft: 4 }}>
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Field helper ===== */

function Field({
  icon,
  placeholder,
  type,
  value,
  onChange
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: 25,
        paddingRight: 25,
        gap: 10
      }}
    >
      {icon}
      <AntdInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
