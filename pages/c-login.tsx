import * as React from "react";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CLogin() {
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "sans-serif",
      }}
    >
      <h1>LOGIN RIDÍCULO</h1>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: 8,
          width: 260,
        }}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: 8,
          width: 260,
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: 10,
          width: 260,
          cursor: "pointer",
        }}
      >
        {loading ? "LOGANDO..." : "LOGIN"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "lime" }}>LOGIN OK</div>}
    </div>
  );
}
