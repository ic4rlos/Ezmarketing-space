// File: pages/c-login.tsx
// Minimal, robust Company login page using lib/c-supabaseClient.js
// Paste this file as-is into your repo (replace styles as you prefer)

import React, { useState } from "react";
import { useRouter } from "next/router";
import getSupabaseC from "@/lib/c-supabaseClient"; // assumes your file at /lib/c-supabaseClient.js

export default function CLoginPage(): JSX.Element {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }

    try {
      setBusy(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Friendly, English error for the user
        setErrorMsg(`Login failed: ${error.message ?? error}`);
        return;
      }

      // Optionally check data.session / data.user
      // Redirect after successful login
      router.push("/find-a-business");
    } catch (err: any) {
      setErrorMsg(`Unexpected error: ${err?.message ?? String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: 8 }}>Company login</h1>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <label style={labelStyle}>
            Email
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              style={inputStyle}
              placeholder="you@company.com"
              required
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              style={inputStyle}
              placeholder="Your password"
              required
            />
          </label>

          {errorMsg && <div style={errorStyle}>{errorMsg}</div>}

          <button type="submit" disabled={busy} style={buttonStyle}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          <a href="/c-reset-password">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

/* ---- minimal inline styles — replace with your CSS/Tailwind as needed ---- */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f6f8fa",
  padding: 16,
};

const cardStyle: React.CSSProperties = {
  width: 420,
  maxWidth: "95%",
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 6px 20px rgba(16,24,40,0.08)",
  padding: 24,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 12,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px 12px",
  marginTop: 6,
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 12,
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "none",
  background: "#0f62fe",
  color: "#fff",
  fontSize: 15,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#b91c1c",
  fontSize: 13,
};
