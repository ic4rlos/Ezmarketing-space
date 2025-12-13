import React from "react";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";
import Link from "next/link";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CLogin() {
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div className={styles.root}>
      <img
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        className={styles.img}
        alt="Ez Marketing Logo"
      />

      <div className={styles.rectangle}>
        <div className={styles.text__o0KFf}>
          <h6 className={styles.h6}>Login</h6>
        </div>

        {/* FORM */}
        <form className={styles.form} onSubmit={handleLogin}>
          {/* EMAIL */}
          <div className={styles.formField__nVf3S}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/user.svg"
                alt=""
                className={styles.svg__wXpbV}
              />
              <input
                type="email"
                placeholder="Email"
                className={styles.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className={styles.formField__p0HYe}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/lock.svg"
                alt=""
                className={styles.svg__ihNhg}
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Logando..." : "Login"}
          </button>

          {/* ERRO */}
          {error && (
            <div style={{ color: "red", marginTop: 8 }}>{error}</div>
          )}

          <Link href="/c-reset-password" className={styles.link__o7Usc}>
            Forgot password?
          </Link>

          {/* GOOGLE (ainda sem lógica) */}
          <button
            type="button"
            className={styles.signInWithGoogle}
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
          >
            <img
              src="/plasmic/ez_marketing_platform/icons/google.svg"
              alt=""
              width="18"
            />
            Sign in with Google
          </button>
        </form>

        <div className={styles.createAccount}>
          <div className={styles.text__aXkee}>New to Ez Marketing?</div>
          <Link href="/c-create-account" className={styles.link__dNNeM}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
