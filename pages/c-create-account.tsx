import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Input } from "antd";

import { getSupabaseC } from "../lib/c-supabaseClient";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import sty from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

export default function CCreateAccount() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = getSupabaseC();
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-login");
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>

      <div className={projectcss.plasmic_page_wrapper}>
        <div
          className={[
            projectcss.all,
            projectcss.root_reset,
            projectcss.plasmic_default_styles,
            projectcss.plasmic_mixins,
            sty.root
          ].join(" ")}
        >
          {/* LOGO */}
          <img
            src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
            className={sty.img}
            alt="Logo"
          />

          <div className={sty.rectangle}>
            <h6 className={sty.h6}>Create corporative account</h6>

            {/* EMAIL */}
            <div className={sty.formField__bwLhI}>
              <UserSvgIcon className={sty.svg__f2O7} />
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={sty.email}
              />
            </div>

            {/* PASSWORD */}
            <div className={sty.formField___4XlWd}>
              <LockSvgIcon className={sty.svg__elYWb} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={sty.password}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className={sty.formField___0Hc3Z}>
              <LockSvgIcon className={sty.svg__hmebx} />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={sty.confirmPassword}
              />
            </div>

            {/* ERROR */}
            {error && <div className={sty.errorText}>{error}</div>}

            {/* BUTTON */}
            <LoginButton
              className={sty.loginButton}
              onClick={handleCreateAccount}
              isDisabled={loading}
            >
              {loading ? "Creating..." : "Create account"}
            </LoginButton>

            {/* GOOGLE */}
            <SignInWithGoogle className={sty.signInWithGoogle} />

            {/* FOOTER */}
            <div className={sty.createAccount}>
              <span>Already have account?</span>
              <Link href="/c-login">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
