import React from "react";
import Head from "next/head";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

export default function CLogin(): JSX.Element {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log("Design-only submit", {
      email: fd.get("email"),
      password: fd.get("password"),
    });
  }

  return (
    <>
      <Head>
        <title>Login — Ez Marketing</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div
        className={classNames(
          projectcss.plasmic_page_wrapper,
          styles.root
        )}
        style={{ minHeight: "100vh" }}
      >
        <PlasmicImg
          className={styles.img}
          src={{
            src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
            fullWidth: 297,
            fullHeight: 210,
          } as any}
          alt="Ez Marketing Logo"
        />

        <div className={classNames(projectcss.all, styles.rectangle)}>
          <div className={classNames(projectcss.__wab_text, styles.text__o0KFf)}>
            <h6 className={classNames(projectcss.h6, styles.h6)}>Login</h6>
          </div>

          {/* === FORMWRAPPER VISUAL EMULATION === */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className={classNames(
              styles.form,
              projectcss.__wab_form,          // classe que o FormWrapper aplica
              projectcss.__wab_instance       // mantém hierarquia do Plasmic
            )}
          >
            {/* Email */}
            <div
              className={classNames(
                styles.formField__nVf3S,
                projectcss.__wab_form_item
              )}
            >
              <div className={projectcss.__wab_flex_container}>
                <img
                  src="/plasmic/ez_marketing_platform/icons/user.svg"
                  className={styles.svg__wXpbV}
                />
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
            <div
              className={classNames(
                styles.formField__p0HYe,
                projectcss.__wab_form_item
              )}
            >
              <div className={projectcss.__wab_flex_container}>
                <img
                  src="/plasmic/ez_marketing_platform/icons/lock.svg"
                  className={styles.svg__ihNhg}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={styles.password}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className={styles.loginButtonWrapper}>
              <LoginButton className={styles.loginButton}>
                <div style={{ color: "#fff", fontWeight: 600 }}>Login</div>
              </LoginButton>
            </div>

            <div className={styles.forgotPassword}>
              <PlasmicLink component={Link} href="/c-reset-password">
                Forgot password?
              </PlasmicLink>
            </div>

            <div className={styles.googleButton}>
              <SignInWithGoogle
                className={styles.signInWithGoogle}
                onClick={() =>
                  alert("Google sign-in disabled (design-only)")
                }
              />
            </div>
          </form>

          <div className={styles.createAccount}>
            <div className={styles.text__aXkee}>New to Ez Marketing?</div>
            <PlasmicLink component={Link} href="/c-create-account">
              Create account
            </PlasmicLink>
          </div>
        </div>
      </div>
    </>
  );
}
