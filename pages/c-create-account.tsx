import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

// ✅ Ícones Plasmic como componentes React
import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 FONTE ÚNICA DA VERDADE (LEI IMUTÁVEL)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    if (loading) return;

    console.log("🧪 STATE NO CLICK:", { email, password, confirmPassword });

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

    const { error } = await supabase.auth.signUp({ email, password });

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
      {/* Logo */}
      <PlasmicImg
        className={styles.img}
        src={{
          src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
          fullWidth: 297,
          fullHeight: 210,
        } as any}
        alt="Ez Marketing Logo"
      />

      {/* Card */}
      <div className={classNames(projectcss?.all, styles.rectangle)}>
        <h6>Create account</h6>

        {/* 🔥 NÃO É FORM */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserSvgIcon className={styles.svg__f2O7} />
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
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LockSvgIcon className={styles.svg__elYWb} />
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
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LockSvgIcon className={styles.svg__hmebx} />
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
