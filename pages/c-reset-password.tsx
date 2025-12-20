// pages/c-reset-password.tsx
import * as React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import LoginButton from "../components/LoginButton";
import { getSupabaseC } from "../lib/c-supabaseClient";
import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";

// Antd Input must be loaded client-side (SSR-safe) — mesma regra que o Alpha
const AntdInput = dynamic(() => import("antd").then((m) => m.Input), {
  ssr: false,
});

export default function CResetPassword() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleRequestReset(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    if (e) e.preventDefault();
    if (loading) return;

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
      setError("Unable to send recovery email");
      return;
    }

    // sucesso → segue o fluxo
    router.push("/c-code-verification-new-password");
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

        {/* CARD — 800 x 547 (Alpha) */}
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
          <form
            onSubmit={handleRequestReset}
            noValidate
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

            {/* helper text */}
            <div style={{ fontSize: 14, textAlign: "center" }}>
              Enter your email address and we'll send you a link to reset your
              password
            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "red",
                  marginTop: 8,
                }}
              >
                {error}
              </div>
            )}

            {/* ACTION */}
            <LoginButton
              type="submit"
              onClick={handleRequestReset}
              isDisabled={loading}
              style={{ width: 248, height: 37 }}
            >
              {loading ? "Sending..." : "Send"}
            </LoginButton>
          </form>

          {/* FOOTER */}
          <div style={{ fontSize: 14 }}>
            <a
              href="/c-login"
              style={{ marginLeft: 4, fontWeight: 600, textDecoration: "underline" }}
            >
              Back to login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Field helper — replicates Alpha field geometry ===== */
function Field({
  icon,
  placeholder,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
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
      {/* Antd Input (client-only) */}
      <AntdInput
        type={type || "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}
