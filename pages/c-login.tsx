import React from "react";
import Head from "next/head";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

// Ícones Plasmic (componentes React, não img!)
import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

// Componentes visuais
import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

// CSS do Plasmic
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

export default function CLogin(): JSX.Element {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <Head>
        <title>Login — Ez Marketing</title>
        <meta name="robots" content="noindex" />
      </Head>

      {/* Viewport centralizado */}
      <div
        className={classNames(projectcss?.plasmic_page_wrapper, styles.root)}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Coluna central (logo + card) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            transform: "translateY(-40px)",
          }}
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
            {/* Title */}
            <div className={classNames(projectcss?.__wab_text, styles.text__o0KFf)}>
              <h6 className={classNames(projectcss?.h6, styles.h6)}>Login</h6>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className={styles.formField__nVf3S}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserSvgIcon className={styles.svg__wXpbV} />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className={styles.email}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.formField__p0HYe} style={{ marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <LockSvgIcon className={styles.svg__ihNhg} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={styles.password}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Login */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <LoginButton className={styles.loginButton}>
                  <div style={{ color: "#fff", fontWeight: 600 }}>Login</div>
                </LoginButton>
              </div>

              {/* Forgot */}
              <div style={{ marginTop: 10 }}>
                <PlasmicLink component={Link} href="/c-reset-password" className={styles.link__o7Usc}>
                  Forgot password?
                </PlasmicLink>
              </div>

              {/* Google */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                <SignInWithGoogle className={styles.signInWithGoogle} />
              </div>
            </form>

            {/* Create account */}
            <div className={styles.createAccount} style={{ marginTop: 18 }}>
              <div className={styles.text__aXkee}>New to Ez Marketing?</div>
              <PlasmicLink component={Link} href="/c-create-account" className={styles.link__dNNeM}>
                Create account
              </PlasmicLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
