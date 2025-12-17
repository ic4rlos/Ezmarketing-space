import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

import LoginButton from "../components/LoginButton";
import Checkbox from "../components/Checkbox";
import SignInWithGoogle from "../components/SignInWithGoogle";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 Fonte única da verdade
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

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

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions");
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

      {/* Caixa branca */}
      <div className={classNames(projectcss.all, styles.rectangle)}>
        <h6 className={styles.h6}>Create corporative account</h6>

        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <label>
              <UserSvgIcon className={styles.svg__f2O7} />
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              className={styles.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <label>
              <LockSvgIcon className={styles.svg__elYWb} />
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={styles.password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <label>
              <LockSvgIcon className={styles.svg__hmebx} />
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              className={styles.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* ERRO */}
          {error && (
            <div className={styles.errorText} style={{ display: "block" }}>
              {error}
            </div>
          )}

          {/* BOTÃO */}
          <LoginButton
            className={styles.loginButton}
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </LoginButton>

          {/* CHECKBOX */}
          <Checkbox
            checked={acceptedTerms}
            onChange={(v: boolean) => setAcceptedTerms(v)}
            className={styles.checkbox2}
            label={
              <div className={styles.freeBox}>
                <span className={styles.text__uc3Vt}>I accept the </span>
                <PlasmicLink component={Link} href="/terms">
                  terms and conditions
                </PlasmicLink>
              </div>
            }
          />

          {/* GOOGLE */}
          <SignInWithGoogle className={styles.signInWithGoogle} />

          {/* FOOTER */}
          <div className={styles.createAccount}>
            <span className={styles.text__j3Au8}>
              Already have account?
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
