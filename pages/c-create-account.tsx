import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getSupabaseC } from "../lib/c-supabaseClient";

import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

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
    const { error } = await supabase.auth.signUp({ email, password });

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

      {/* ROOT */}
      <div
        style={{
          minHeight: "100vh",
          background: "#d9d9d9",
          display: "grid",
          placeItems: "center",
          gridAutoRows: "min-content"
        }}
      >
        {/* LOGO */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 700,
            height: 100,
            objectFit: "cover",
            marginBottom: 25
          }}
        />

        {/* CARD */}
        <div
          style={{
            width: "100%",
            maxWidth: 860,
            height: 547,
            background: "#fff",
            borderRadius: 51,
            padding: "65px 100px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10 // 🔧 leve ajuste vertical
          }}
        >
          <h6 style={{ fontWeight: 500, margin: 0 }}>
            Create corporative account
          </h6>

          <div
            style={{
              width: "100%",
              maxWidth: 608,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "100%",
              alignItems: "center" // 🔧 centraliza tudo melhor
            }}
          >
            <Field
              icon={<UserSvgIcon width={24} height={24} />}
              value={email}
              onChange={setEmail}
              placeholder="email"
              type="email"
            />

            <Field
              icon={<LockSvgIcon width={24} height={24} />}
              value={password}
              onChange={setPassword}
              placeholder="Password"
              type="password"
            />

            <Field
              icon={<LockSvgIcon width={24} height={24} />}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              type="password"
            />

            {error && (
              <div style={{ fontSize: 12, color: "red" }}>{error}</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <LoginButton
                onClick={handleCreateAccount}
                isDisabled={loading}
                style={{ width: 248, height: 37 }}
              >
                {loading ? "Creating..." : "Create account"}
              </LoginButton>

              <SignInWithGoogle style={{ width: 248, height: 37 }} />
            </div>
          </div>

          <div style={{ fontSize: 14 }}>
            Already have account?
            <Link href="/c-login" style={{ marginLeft: 4, fontWeight: 600 }}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ icon, value, onChange, placeholder, type }: any) {
  return (
    <div style={{ width: "100%", padding: "0 25px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <AntdInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
