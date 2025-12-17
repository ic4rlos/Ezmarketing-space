import React from "react";
import Link from "next/link";
import styles from "./PlasmicLCCreateAccount.module.css";

import UserSvgIcon from "./icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "./icons/PlasmicIcon__LockSvg";
import SignInWithGoogle from "../../SignInWithGoogle";

// 🔒 Componente React REAL, controlado, sem Plasmic

export type PlasmicLCCreateAccountProps = {
  email: string;
  password: string;
  confirmPassword: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onSubmit: () => void;
  error?: string | null;
  loading?: boolean;
};

export function PlasmicLCCreateAccount({
  email,
  password,
  confirmPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  error,
  loading = false
}: PlasmicLCCreateAccountProps) {
  return (
    <div className={styles.root}>
      {/* Logo */}
      <img
        className={styles.img}
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        alt="Ez Marketing"
      />

      {/* Card */}
      <div className={styles.rectangle}>
        <h6 className={styles.h6}>Create corporative account</h6>

        {/* FORM VISUAL (React puro) */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserSvgIcon className={styles.svg__f2O7} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
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
                onChange={(e) => onPasswordChange(e.target.value)}
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
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
              />
            </div>
          </div>

          {/* ERRO */}
          {error && <div className={styles.errorText}>{error}</div>}

          {/* BOTÃO */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {/* CHECKBOX (visual) */}
          <div className={styles.checkbox2}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" />
              <span className={styles.text__uc3Vt}>
                I accept the <a className={styles.link__kwYd}>terms and conditions</a>
              </span>
            </label>
          </div>

          {/* GOOGLE */}
          <SignInWithGoogle className={styles.signInWithGoogle} />

          {/* FOOTER */}
          <div className={styles.createAccount}>
            <span className={styles.text__j3Au8}>Already have account?</span>
            <Link href="/c-login" className={styles.link__z76Ps}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlasmicLCCreateAccount;
