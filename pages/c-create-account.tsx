import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { supabase } from "../lib/supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();

  // 🔥 FONTE ÚNICA DA VERDADE
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    if (loading) return;

    setError(null);

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-edit-profile");
  }

  return (
    <div
      className={classNames(
        projectcss?.plasmic_page_wrapper,
        styles.root
      )}
    >
      {/* LOGO */}
      <img
        className={styles.img}
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        alt="Ez Marketing Logo"
      />

      {/* CAIXA BRANCA */}
      <div className={classNames(projectcss?.all, styles.rectangle)}>
        <h6>Create corporate account</h6>

        {/* FORM VISUAL (SEM <form>) */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* ERRO */}
          {error && (
            <div style={{ color: "red", fontSize: 12 }}>
              {error}
            </div>
          )}

          {/* BOTÃO */}
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {/* LINK LOGIN */}
          <div className={styles.createAccount}>
            <span>Already have an account?</span>
            <Link href="/c-login" style={{ marginLeft: 4 }}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
