import * as React from "react";
import { useRouter } from "next/router";
import { Input } from "antd";
import LoginButton from "../components/LoginButton";
import { getSupabaseC } from "../lib/c-supabaseClient";

const AntdPassword = Input.Password;

export default function CNewPassword() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords must match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/find-a-affiliate");
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#d9d9d9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* LOGO */}
      <img
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        alt="EZ Marketing"
        style={{
          width: 700,
          height: 100,
          marginBottom: 25,
          objectFit: "contain",
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
        }}
      >
        {/* TITLE */}
        <h3
          style={{
            fontWeight: 500,
            fontSize: 16,
            margin: 0,
          }}
        >
          Create a new password
        </h3>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div style={{ width: 504 }}>
            <AntdPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              style={{ height: 32 }}
            />
          </div>

          <div style={{ width: 504 }}>
            <AntdPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              style={{ height: 32 }}
            />
          </div>

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

          <LoginButton
            type="submit"
            isDisabled={loading}   // ✅ API CORRETA DO ALPHA
            style={{
              width: 248,
              height: 37,
              marginTop: 10,
            }}
          >
            Save new password
          </LoginButton>
        </form>
      </div>
    </div>
  );
}
