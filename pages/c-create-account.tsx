import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 FONTE ÚNICA DA VERDADE
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount() {
    if (loading) return;

    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
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
      <PlasmicImg
        className={styles.img}
        src={{
          src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
          fullWidth: 297,
          fullHeight: 210,
        } as any}
        alt="Ez Marketing Logo"
      />

      {/* CARD */}
      <div className={classNames(projectcss.all, styles.rectangle)}>
        <h6 className={styles.h6}>Create corporative account</h6>

        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <UserSvgIcon className={styles.svg__f2O7} />
            <input
              type="email"
              placeholder="Email"
              className={styles.email}
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
              className={styles.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <LockSvgIcon className={styles.svg__hmebx} />
            <input
              type="password"
              placeholder="Confirm Password"
              className={styles.confirmPassword}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          {/* ERRO */}
          {error && (
            <div
              className={styles.errorText}
              style={{ display: "block" }}
            >
              {error}
            </div>
          )}

          {/* BOTÃO */}
          <LoginButton
            className={styles.loginButton}
            onClick={handleCreateAccount}
            isDisabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </LoginButton>

          {/* GOOGLE */}
          <SignInWithGoogle
            className={styles.signInWithGoogle}
          />

          {/* LOGIN */}
          <div className={styles.createAccount}>
            <span className={styles.text__j3Au8}>
              Already have an account?
            </span>
            <PlasmicLink component={Link} href="/c-login">
              Log in
            </PlasmicLink>
          </div>
        </div>
      </div>
    </div>
  );
}
