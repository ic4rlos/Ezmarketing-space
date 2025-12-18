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
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* LOGO */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 360,
            maxWidth: "90%",
            marginBottom: 32
          }}
        />

        {/* CARD */}
        <div
          style={{
            width: 440,
            maxWidth: "90%",
            background: "#fff",
            borderRadius: 48,
            padding: "56px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box"
          }}
        >
          {/* TITLE */}
          <h5
            style={{
              marginBottom: 32,
              fontWeight: 500,
              textAlign: "center"
            }}
          >
            Create corporative account
          </h5>

          {/* EMAIL */}
          <div style={{ width: "100%", marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 8
              }}
            >
              <UserSvgIcon width={20} height={20} />
              <span style={{ opacity: 0.6 }}>:</span>
              <div style={{ flex: 1 }}>
                <AntdInput
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ width: "100%", marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 8
              }}
            >
              <LockSvgIcon width={20} height={20} />
              <span style={{ opacity: 0.6 }}>:</span>
              <div style={{ flex: 1 }}>
                <AntdInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={{ width: "100%", marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 8
              }}
            >
              <LockSvgIcon width={20} height={20} />
              <span style={{ opacity: 0.6 }}>:</span>
              <div style={{ flex: 1 }}>
                <AntdInput
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                fontSize: 11,
                color: "red",
                marginBottom: 16,
                textAlign: "center"
              }}
            >
              {error}
            </div>
          )}

          {/* BUTTON */}
          <LoginButton
            onClick={handleCreateAccount}
            isDisabled={loading}
            style={{ width: 248, marginBottom: 16 }}
          >
            {loading ? "Creating..." : "Create account"}
          </LoginButton>

          {/* GOOGLE */}
          <SignInWithGoogle style={{ width: 248, marginBottom: 24 }} />

          {/* FOOTER */}
          <div style={{ fontSize: 13 }}>
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
