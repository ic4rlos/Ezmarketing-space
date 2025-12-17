import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

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
        projectcss.plasmic_page_wrapper,
        styles.root
      )}
    >
      {/* LOGO */}
      <img
        className={styles.img}
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        alt="Ez Marketing Logo"
      />

      {/* CARD */}
      <div className={classNames(projectcss.all, styles.rectangle)}>
        <h6 className={styles.h6}>Create corporative account</h6>

        {/* FORM (REACT REAL) */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserSvgIcon className={styles.svg__f2O7} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <LockSvgIcon className={styles.svg__elYWb} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <LockSvgIcon className={styles.svg__hmebx} />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className={styles.errorText} style={{ display: "block" }}>
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {/* FOOTER */}
          <div className={styles.createAccount}>
            <span>Already have account?</span>
            <Link href="/c-login" className={styles.link__z76Ps}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
