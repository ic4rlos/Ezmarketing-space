import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";

import { getSupabaseC } from "../lib/c-supabaseClient";

const AntdInput = dynamic(
  () => import("../components/ui/AntdInput"),
  { ssr: false }
);

const LoginButton = dynamic(
  () => import("../components/LoginButton"),
  { ssr: false }
);

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";

export default function CResetPassword() {
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [requested, setRequested] = React.useState(false);

  async function handleResetPassword() {
    setError(null);

    if (!email) {
      setError("Fill in all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/c-newpassword`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ⚠️ Não afirma sucesso — apenas confirma tentativa
    setRequested(true);
  }

  return (
    <>
      <Head>
        <title>Reset password</title>
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
        {/* LOGO — 700x100 */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 700,
            height: 100,
            objectFit: "contain",
            marginBottom: 25,
          }}
        />

        {/* CARD — 800 x 547 */}
        <div
          style={{
            width: 800,
            height: 547,
            background: "#ffffff",
            borderRadius: 51,
            padding: "65px 100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* TITLE */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Reset password
          </div>

          {/* FORM */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
            }}
          >
            <Field
              icon={<UserSvgIcon width={24} height={24} />}
              placeholder="Email"
              type="email"
              value={email}
              onChange={setEmail}
            />

            {/* SUPABASE-CORRECT MESSAGE */}
            <div
              style={{
                fontSize: 14,
                textAlign: "center",
                maxWidth: 420,
              }}
            >
              {requested
                ? "If an account exists for this email, you will receive a password reset link."
                : "Enter your email address to reset your password."}
            </div>
          </div>

          {/* ERROR — ALPHA STYLE */}
          {error && (
            <div
              style={{
                fontSize: 12,
                color: "red",
                fontStyle: "italic",
              }}
            >
              {error}
            </div>
          )}

          {/* ACTION */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <LoginButton
              onClick={handleResetPassword}
              isDisabled={loading || requested}
              style={{ width: 248, height: 37 }}
            >
              {loading ? "Sending..." : "Send"}
            </LoginButton>
          </div>

          {/* FOOTER */}
          <div style={{ fontSize: 14 }}>
            Back to
            <Link
              href="/c-login"
              style={{ marginLeft: 4, fontWeight: 600 }}
            >
              login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Field helper — 504x32 ===== */

function Field({
  icon,
  placeholder,
  type,
  value,
  onChange,
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
        width: 504,
        height: 32,
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingLeft: 25,
        paddingRight: 25,
        boxSizing: "border-box",
      }}
    >
      {icon}
      <AntdInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}
