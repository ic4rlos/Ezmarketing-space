import React from "react";
import { useRouter } from "next/router";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import Link from "next/link";
import { PlasmicLink } from "@plasmicapp/react-web";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 FONTE ÚNICA DA VERDADE (LEI)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    if (loading) return;

    console.log("🧪 STATE NO CLICK:", {
      email,
      password,
      confirmPassword,
    });

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("📦 Supabase data:", data);
    console.log("❌ Supabase error:", error);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // 👉 fluxo simples, sem mágica
    router.push("/c-edit-profile");
  }

  return (
    <div className={styles.root}>
      {/* Logo */}
      <img
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        className={styles.img}
        alt="Ez Marketing Logo"
      />

      {/* Caixa branca */}
      <div className={styles.rectangle}>
        <h6>Create account</h6>

        {/* 🔥 NÃO É FORM */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                console.log("EMAIL:", e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                console.log("PASSWORD:", e.target.value);
                setPassword(e.target.value);
              }}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                console.log("CONFIRM:", e.target.value);
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          {/* ERRO */}
          {error && (
            <div style={{ color: "red", fontSize: 12 }}>{error}</div>
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

          {/* LINK */}
          <div className={styles.createAccount}>
            <span>Already have an account?</span>
            <PlasmicLink component={Link} href="/c-login">
              Login
            </PlasmicLink>
          </div>
        </div>
      </div>
    </div>
  );
}
