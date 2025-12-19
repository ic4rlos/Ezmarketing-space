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

      <div
        style={{
          minHeight: "100vh",
          background: "#d9d9d9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* LOGO */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 700,
            maxWidth: "90%",
            height: 100,
            marginTop: 40,
            marginBottom: 25
          }}
        />

        {/* CARD */}
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            background: "#fff",
            borderRadius: 51,
            padding: "65px 100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
            marginTop: 20 // ⬅️ card levemente mais para baixo
          }}
        >
          {/* TITLE */}
          <h6
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              marginBottom: 40,
              textAlign: "center"
            }}
          >
            Create corporative account
          </h6>

          {/* EMAIL */}
          <div style={{ width: "100%", marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 25,
                paddingRight: 25
              }}
            >
              <UserSvgIcon width={24} height={24} />
              <AntdInput
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ width: "100%", marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 25,
                paddingRight: 25
              }}
            >
              <LockSvgIcon width={24} height={24} />
              <AntdInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={{ width: "100%", marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 25,
                paddingRight: 25
              }}
            >
              <LockSvgIcon width={24} height={24} />
              <AntdInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                fontSize: 12,
                color: "red",
                marginBottom: 16,
                textAlign: "center",
                fontStyle: "italic"
              }}
            >
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <LoginButton
            onClick={handleCreateAccount}
            isDisabled={loading}
            style={{ width: 248, marginBottom: 16 }}
          >
            {loading ? "Creating..." : "Create account"}
          </LoginButton>

          <SignInWithGoogle style={{ width: 248, marginBottom: 20 }} />

          {/* FOOTER */}
          <div style={{ fontSize: 14, textAlign: "center" }}>
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
