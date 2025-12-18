import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Form, Input, ConfigProvider } from "antd";

import { getSupabaseC } from "../lib/c-supabaseClient";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import sty from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

export default function CCreateAccount() {
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount(values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    setError(null);

    const { email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = getSupabaseC();
    const { error } = await supabase.auth.signUp({ email, password });

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
          <img
            src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
            className={sty.img}
            alt="Logo"
          />

          <div className={sty.rectangle}>
            <h6 className={sty.h6}>Create corporative account</h6>

            <ConfigProvider>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateAccount}
              >
                {/* EMAIL */}
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "Email required" }]}
                >
                  <Input
                    type="email"
                    placeholder="email"
                    prefix={<UserSvgIcon className={sty.svg__f2O7} />}
                    className={sty.email}
                  />
                </Form.Item>

                {/* PASSWORD */}
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Password required" }]}
                >
                  <Input.Password
                    placeholder="Password"
                    prefix={<LockSvgIcon className={sty.svg__elYWb} />}
                    className={sty.password}
                  />
                </Form.Item>

                {/* CONFIRM PASSWORD */}
                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: "Confirm password" }]}
                >
                  <Input.Password
                    placeholder="Confirm Password"
                    prefix={<LockSvgIcon className={sty.svg__hmebx} />}
                    className={sty.confirmPassword}
                  />
                </Form.Item>

                {error && <div className={sty.errorText}>{error}</div>}

                <LoginButton
                  className={sty.loginButton}
                  isDisabled={loading}
                  onClick={() => form.submit()}
                >
                  {loading ? "Creating..." : "Create account"}
                </LoginButton>
              </Form>
            </ConfigProvider>

            <SignInWithGoogle className={sty.signInWithGoogle} />

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
