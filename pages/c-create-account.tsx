import React from "react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

// 🔥 COMPONENTES VISUAIS ORIGINAIS (BELEZA)
import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

// 🔥 CSS ORIGINAL DO PLASMIC
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

// 🔥 SUPABASE (CORRETO)
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔒 ESTADO CONTROLADO (FONTE ÚNICA DA VERDADE)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // 🎨 TOKENS DE ESTILO DO PLASMIC (VISUAL PURO)
  const styleTokensClassNames = (() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require(
        "../components/plasmic/ez_marketing_platform/PlasmicStyleTokensProvider"
      );
      return m?._useStyleTokens?.() || "";
    } catch {
      return "";
    }
  })();

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
        styles.root,
        styleTokensClassNames
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
        <h6 className={styles.h6}>Create corporate account</h6>

        {/* FORM (NÃO SUBMIT HTML – CONTROLE TOTAL) */}
        <div className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <input
              type="email"
              className={styles.email}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <input
              type="password"
              className={styles.password}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <input
              type="password"
              className={styles.confirmPassword}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {error && <div className={styles.errorText}>{error}</div>}

          {/* CREATE ACCOUNT BUTTON (BELEZA ORIGINAL) */}
          <LoginButton
            className={styles.loginButton}
            onClick={handleCreateAccount}
            isDisabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </LoginButton>

          {/* GOOGLE */}
          <SignInWithGoogle />

          {/* LOGIN LINK */}
          <div className={styles.createAccount}>
            <span className={styles.text__j3Au8}>
              Already have an account?
            </span>
            <PlasmicLink component={Link} href="/c-login">
              <span className={styles.link__z76Ps}>Log in</span>
            </PlasmicLink>
          </div>
        </div>
      </div>
    </div>
  );
}
