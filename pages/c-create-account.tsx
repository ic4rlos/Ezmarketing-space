// pages/c-create-account.tsx
import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 ÚNICA FONTE DA VERDADE
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    if (loading) return;

    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid email or password");
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
      <PlasmicImg
        className={styles.img}
        src={{
          src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
          fullWidth: 297,
          fullHeight: 210,
        } as any}
        alt="EZ Marketing"
      />

      {/* CARD */}
      <div className={classNames(projectcss.all, styles.rectangle)}>
        <h6>Create account</h6>

        {/* NÃO É FORM */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <UserSvgIcon className={styles.svg__f2O7} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <LockSvgIcon className={styles.svg__elYWb} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <LockSvgIcon className={styles.svg__hmebx} />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* ERRO */}
          {error && (
            <div style={{ color: "red", marginTop: 8 }}>
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

          {/* LINK */}
          <div className={styles.createAccount}>
            <span>Already have an account?</span>
            <PlasmicLink component={Link} href="/c-login">
              Log in
            </PlasmicLink>
          </div>
        </div>
      </div>
    </div>
  );
}
