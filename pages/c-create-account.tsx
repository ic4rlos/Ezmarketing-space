import * as React from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

import {
  PageParamsProvider as PageParamsProvider__,
  PlasmicLink,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";

import { PlasmicImg } from "@plasmicapp/react-web";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount(): JSX.Element {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 FONTE ÚNICA DA VERDADE
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // ⚠️ STYLE TOKENS — ARRISCADO, MAS CONTROLADO
  const styleTokensClassNames = (() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require(
        "../components/plasmic/ez_marketing_platform/PlasmicStyleTokensProvider"
      );
      return typeof m?._useStyleTokens === "function"
        ? m._useStyleTokens()
        : "";
    } catch {
      return "";
    }
  })();

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
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* 
          ✅ Root visual 100% Plasmic
          ❌ Nenhum wrapper lógico
        */}
        <div
          className={classNames(
            projectcss.plasmic_page_wrapper,
            styles.root,
            styleTokensClassNames
          )}
        >
          {/* 🖼️ Asset Plasmic */}
          <PlasmicImg
            className={styles.img}
            src={{
              src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
              fullWidth: 297,
              fullHeight: 210,
            } as any}
            alt="Ez Marketing Logo"
          />

          {/* 📦 Card */}
          <div className={classNames(projectcss.all, styles.rectangle)}>
            <h6 className={classNames(projectcss.h6)}>Create account</h6>

            {/* 🔒 Estrutura visual pura */}
            <div className={styles.form2}>
              <div className={styles.formField__bwLhI}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className={styles.formField___4XlWd}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.formField___0Hc3Z}>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className={styles.errorText}>{error}</div>
              )}

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={loading}
                className={styles.loginButton}
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              {/* ⚠️ PlasmicLink — isolado */}
              <div className={styles.createAccount}>
                <span>Already have an account?</span>
                <PlasmicLink href="/c-login">
                  Login
                </PlasmicLink>
              </div>
            </div>
          </div>
        </div>
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
