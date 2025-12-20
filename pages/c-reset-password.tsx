import * as React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import { getSupabaseC } from "../lib/c-supabaseClient";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";

const AntdInput = dynamic(
  () => import("../components/ui/AntdInput"),
  { ssr: false }
);

const LoginButton = dynamic(
  () => import("../components/LoginButton"),
  { ssr: false }
);

export default function CResetPassword() {
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleResetPassword() {
    setError(null);

    if (!email) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/c-code-verification-new-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ⚠️ NENHUM redirect aqui
    // Fluxo continua exclusivamente via email
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
        {/* LOGO */}
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

        {/* CARD */}
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
          </div>

          {/* ERROR */}
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
          <LoginButton
            onClick={handleResetPassword}
            isDisabled={loading}
            style={{ width: 248, height: 37 }}
          >
            {loading ? "Sending..." : "Send"}
          </LoginButton>

          {/* FOOTER */}
          <div style={{ fontSize: 14 }} />
        </div>
      </div>
    </>
  );
}

/* ===== Field helper — IDÊNTICO AO ALPHA ===== */

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
