import React, { useState } from "react";
import { useRouter } from "next/router";
import getSupabaseC from "../lib/c-supabaseClient";
import styles from "../styles/CLogin.module.css";

/*
  Minimal, faithful reconstruction of the Plasmic login UI (Company).
  - No Plasmic runtime
  - Controlled inputs
  - Supabase signInWithPassword integration
  - Google sign-in button stub (calls supabase.auth.signInWithOAuth)
*/

export default function CLogin(): JSX.Element {
  const supabase = getSupabaseC();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
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

      // Optionally check data.session etc
      // Redirect to company dashboard /find-a-business or /c-dashboard
      router.push("/find-a-business");
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setError(`Unexpected error: ${err?.message ?? String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setBusy(true);
      // This will redirect to provider (ensure redirect URL configured in Supabase)
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(`Google sign-in error: ${err?.message ?? String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card} role="main" aria-labelledby="login-title">
        <div className={styles.logoWrap}>
          {/* Replace src with your real logo path in /public */}
          <div className={styles.logo}>
            <span className={styles.logoEz}>ez</span>
            <span className={styles.logoMarketing}>marketing</span>
          </div>
        </div>

        <h1 id="login-title" className={styles.title}>
          Login
        </h1>

        <form className={styles.form} onSubmit={handleLogin} noValidate>
          <label className={styles.field}>
            <div className={styles.inputWrapper}>
              <span className={styles.icon} aria-hidden>
                {/* simple envelope svg */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6.5L12 13L21 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </span>
              <input
                type="email"
                name="email"
                aria-label="Email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </label>

          <label className={styles.field}>
            <div className={styles.inputWrapper}>
              <span className={styles.icon} aria-hidden>
                {/* simple lock svg */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="10" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="password"
                name="password"
                aria-label="Password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.loginBtn} type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Login"}
          </button>

          <div className={styles.rowBelow}>
            <a href="/c-reset-password" className={styles.forgot}>
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleSignIn}
            disabled={busy}
            aria-label="Sign in with Google"
          >
            <span className={styles.googleIcon} aria-hidden>
              {/* simple Google icon */}
              <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.4-34.1-4-50.4H272v95.5h146.9c-6.3 34-25.6 62.9-54.6 82l88.1 68c51.4-47.5 80.1-117.5 80.1-195.1z"/>
                <path fill="#34a853" d="M272 544.3c73 0 134.3-24.2 179-65.7l-88.1-68c-24.6 16.5-56 26-90.9 26-69.9 0-129.3-47.2-150.5-110.7l-91.3 70.4c43.7 87 132.7 148 241.7 148z"/>
                <path fill="#fbbc04" d="M121.5 327.9c-10.1-29.9-10.1-62 0-91.9L30.2 165.6C-19.1 246.3-19.1 377.9 30.2 458.6l91.3-70.7z"/>
                <path fill="#ea4335" d="M272 107.7c39.6 0 75.2 13.6 103.3 40.3l77.4-77.4C406.3 23 349.4 0 272 0 162.9 0 73.9 61 30.2 148.7l91.3 70.4C142.7 155 202.1 107.7 272 107.7z"/>
              </svg>
            </span>
            <span className={styles.googleText}>Sign in with Google</span>
          </button>

        </form>

        <div className={styles.footer}>
          <div className={styles.smallText}>New to Ez Marketing?</div>
          <a href="/c-create-account" className={styles.createLink}>
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
