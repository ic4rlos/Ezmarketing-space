// File: pages/c-login.tsx
// Reconstructed Company login page using Plasmic CSS module for styling.
// No Plasmic runtime, no Plasmic state hooks — visual preserved by CSS module.

import React, { useState } from "react";
import { useRouter } from "next/router";
import getSupabaseC from "../lib/c-supabaseClient";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

export default function CLogin(): JSX.Element {
  const supabase = getSupabaseC();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setBusy(true);
      const { data, error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signError) {
        setError(`Login failed: ${signError.message ?? signError}`);
        return;
      }

      // Successful login — redirect to company area
      router.push("/find-a-business");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(`Unexpected error: ${err?.message ?? String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setBusy(true);
      await supabase.auth.signInWithOAuth({ provider: "google" });
      // Supabase manages redirect flows — no immediate redirect here
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(`Google sign-in error: ${err?.message ?? String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.root}>
      {/* Image / logo area (uses CSS .img sizing from Plasmic) */}
      <div className={styles.img} aria-hidden>
        {/* If you have a logo asset, replace src below with actual file under /public */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{ maxWidth: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Card */}
      <div className={styles.rectangle} role="main" aria-labelledby="login-title">
        <div className={styles.text__o0KFf}>
          <h6 id="login-title" className={styles.h6}>
            Login
          </h6>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className={styles.formField__nVf3S}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={styles.svg__wXpbV} aria-hidden>
                {/* envelope icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                className={styles.email}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15 }}
                type="email"
                aria-label="Email"
                placeholder="Email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div className={styles.formField__p0HYe}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={styles.svg__ihNhg} aria-hidden>
                {/* lock icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                className={styles.password}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15 }}
                type="password"
                aria-label="Password"
                placeholder="Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error message (simple visual) */}
          {error && (
            <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 6 }}>
              {error}
            </div>
          )}

          {/* Login button — use Plasmic class but set full width inline for consistent UX */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <button
              type="submit"
              className={styles.loginButton}
              style={{ width: "100%", cursor: busy ? "default" : "pointer" }}
              disabled={busy}
              aria-disabled={busy}
            >
              <div className={styles.text___4Z38H}>
                {busy ? "Signing in..." : "Login"}
              </div>
            </button>
          </div>

          {/* Forgot password link (uses Plasmic class for alignment) */}
          <div style={{ width: "100%", paddingLeft: 25, paddingRight: 25, marginTop: 8 }}>
            <a className={styles.link__o7Usc} href="/c-reset-password">
              Forgot password?
            </a>
          </div>

          {/* Sign in with Google (preserve Plasmic class) */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <button
              type="button"
              className={styles.signInWithGoogle}
              onClick={handleGoogleSignIn}
              disabled={busy}
              style={{ width: "100%", cursor: busy ? "default" : "pointer", background: "white", border: "1px solid #e5e7eb" }}
            >
              <span className={styles.svg__tKvUw} aria-hidden style={{ marginRight: 8 }}>
                {/* small Google icon (keeps it compact) */}
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.4-34.1-4-50.4H272v95.5h146.9c-6.3 34-25.6 62.9-54.6 82l88.1 68c51.4-47.5 80.1-117.5 80.1-195.1z"/>
                  <path fill="#34a853" d="M272 544.3c73 0 134.3-24.2 179-65.7l-88.1-68c-24.6 16.5-56 26-90.9 26-69.9 0-129.3-47.2-150.5-110.7l-91.3 70.4c43.7 87 132.7 148 241.7 148z"/>
                  <path fill="#fbbc04" d="M121.5 327.9c-10.1-29.9-10.1-62 0-91.9L30.2 165.6C-19.1 246.3-19.1 377.9 30.2 458.6l91.3-70.7z"/>
                  <path fill="#ea4335" d="M272 107.7c39.6 0 75.2 13.6 103.3 40.3l77.4-77.4C406.3 23 349.4 0 272 0 162.9 0 73.9 61 30.2 148.7l91.3 70.4C142.7 155 202.1 107.7 272 107.7z"/>
                </svg>
              </span>
              <span className={styles.svg___0BBm2}>Sign in with Google</span>
            </button>
          </div>
        </form>

        {/* Create account area — uses Plasmic classes */}
        <div className={styles.createAccount} style={{ marginTop: 18 }}>
          <div className={styles.text__aXkee}>New to Ez Marketing?</div>
          <a className={styles.link__dNNeM} href="/c-create-account">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
