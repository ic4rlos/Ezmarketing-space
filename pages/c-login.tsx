import React from "react";
import Head from "next/head";
import Link from "next/link";
import classNames from "classnames";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CLogin(): JSX.Element {
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const styleTokensClassNames = (() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require("../components/plasmic/ez_marketing_platform/PlasmicStyleTokensProvider");
      if (m && typeof m._useStyleTokens === "function") {
        return m._useStyleTokens() || "";
      }
    } catch {}
    return "";
  })();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

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
        <PlasmicImg
          className={styles.img}
          src={{
            src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
            fullWidth: 297,
            fullHeight: 210,
          } as any}
          alt="Ez Marketing Logo"
        />

        <div className={classNames(projectcss?.all, styles.rectangle)}>
          <div className={classNames(projectcss?.__wab_text, styles.text__o0KFf)}>
            <h6 className={classNames(projectcss?.h6, styles.h6)}>Login</h6>
          </div>

          {/* FORM */}
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* EMAIL */}
            <div className={styles.formField__nVf3S}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src="/plasmic/ez_marketing_platform/icons/user.svg"
                  alt=""
                  className={styles.svg__wXpbV}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={styles.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={styles.formField__p0HYe} style={{ marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src="/plasmic/ez_marketing_platform/icons/lock.svg"
                  alt=""
                  className={styles.svg__ihNhg}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={styles.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* LOGIN */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <LoginButton
                className={styles.loginButton}
                style={{ width: 248, height: 37, borderRadius: 8 }}
                // força submit do form
                onClick={() => {}}
              >
                <div style={{ color: "#fff", fontWeight: 600 }}>
                  {loading ? "Logando..." : "Login"}
                </div>
              </LoginButton>
            </div>

            {/* ERROR */}
            {error && (
              <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>
                {error}
              </div>
            )}

            <div style={{ width: "100%", paddingLeft: 6, marginTop: 10 }}>
              <PlasmicLink component={Link} href="/c-reset-password" className={styles.link__o7Usc}>
                Forgot password?
              </PlasmicLink>
            </div>

            {/* GOOGLE */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <SignInWithGoogle
                className={styles.signInWithGoogle}
                onClick={() =>
                  supabase.auth.signInWithOAuth({ provider: "google" })
                }
              />
            </div>
          </form>

          <div className={styles.createAccount} style={{ marginTop: 18 }}>
            <div className={styles.text__aXkee}>New to Ez Marketing?</div>
            <PlasmicLink component={Link} href="/c-create-account" className={styles.link__dNNeM}>
              Create account
            </PlasmicLink>
          </div>
        </div>
      </div>
    </>
  );
}
