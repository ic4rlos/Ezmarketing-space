import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import { PlasmicImg, PlasmicLink } from "@plasmicapp/react-web";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";

import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // 🔥 lógica blindada (React puro)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

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
        <div
          className={classNames(
            projectcss.plasmic_page_wrapper,
            styles.root
          )}
        >
          {/* Logo (asset Plasmic — seguro) */}
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
          <div className={classNames(projectcss.all, styles.rectangle)}>
            <h6>Create account</h6>

            {/* NÃO é form */}
            <div className={styles.form2}>
              <div className={styles.formField__bwLhI}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formField___4XlWd}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className={styles.formField___0Hc3Z}>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: "red", fontSize: 12 }}>{error}</div>
              )}

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={loading}
                className={styles.loginButton}
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <div className={styles.createAccount}>
                <span>Already have an account?</span>
                <PlasmicLink component={Link} href="/c-login">
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
