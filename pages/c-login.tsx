import React from "react";
import Head from "next/head";
import Link from "next/link";
import classNames from "classnames";

// CSS do Plasmic: projectcss + componente específico
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

// Tokens provider (apenas para obter classes de tokens se existir)
import { _useStyleTokens } from "../components/plasmic/ez_marketing_platform/PlasmicStyleTokensProvider";

// Ícones PLASMIC (versão B: componentes SVG exportados pelo Plasmic)
import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";
import GoogleSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon38"; // ou outro svg de google se existir

/**
 * Página de login — "modo moderado"
 * - Usa CSS modules do Plasmic (projectcss + component css)
 * - Usa tokens leves via _useStyleTokens quando disponível
 * - NÃO usa Plasmic runtime/state (useDollarState, FormWrapper, etc)
 */
export default function CLogin(): JSX.Element {
  const styleTokensClassNames = (() => {
    try {
      return _useStyleTokens() || "";
    } catch {
      return "";
    }
  })();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log("Design-only submit:", {
      email: fd.get("email"),
      password: fd.get("password"),
    });
    // alerta visual curto para o teste
    alert("Design-only submit — check console for values.");
  }

  // Combina project-wide CSS do Plasmic com o CSS do componente
  const rootClass = classNames(
    projectcss?.plasmic_page_wrapper,
    styles.root,
    styleTokensClassNames
  );

  return (
    <>
      <Head>
        <title>Login — Ez Marketing</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={rootClass} style={{ minHeight: "100vh" }}>
        {/* LOGO */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          className={styles.img}
          alt="Ez Marketing Logo"
        />

        {/* CARD */}
        <div className={classNames(projectcss?.all, styles.rectangle)}>
          {/* título */}
          <div className={classNames(projectcss?.__wab_text, styles.text__o0KFf)}>
            <h6 className={classNames(projectcss?.h6, styles.h6)}>Login</h6>
          </div>

          {/* FORM (simples, sem FormWrapper) */}
          <form className={classNames(styles.form)} onSubmit={handleSubmit} noValidate>
            {/* EMAIL */}
            <div className={classNames(styles.formField__nVf3S)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserSvgIcon className={styles.svg__wXpbV} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={styles.email}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    fontSize: 15,
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={classNames(styles.formField__p0HYe)} style={{ marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LockSvgIcon className={styles.svg__ihNhg} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={styles.password}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    fontSize: 15,
                  }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <button
                type="submit"
                className={styles.loginButton}
                style={{
                  width: 248,
                  height: 37,
                  borderRadius: 8,
                  border: "none",
                  background: "#31c42f",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </div>

            {/* FORGOT */}
            <div style={{ width: "100%", paddingLeft: 6, marginTop: 10 }}>
              <Link href="/c-reset-password" className={styles.link__o7Usc}>
                Forgot password?
              </Link>
            </div>

            {/* SIGN-IN GOOGLE (visual) */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <button
                type="button"
                className={styles.signInWithGoogle}
                style={{
                  width: 248,
                  height: 37,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
                onClick={() => alert("Google sign-in disabled in design-only mode")}
              >
                <GoogleSvgIcon style={{ width: 18, height: 18 }} />
                <span style={{ fontWeight: 600 }}>Sign in with Google</span>
              </button>
            </div>
          </form>

          {/* CREATE ACCOUNT */}
          <div className={styles.createAccount} style={{ marginTop: 18 }}>
            <div className={styles.text__aXkee}>New to Ez Marketing?</div>
            <Link href="/c-create-account" className={styles.link__dNNeM}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
