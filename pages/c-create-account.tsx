/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import * as React from "react";
import Head from "next/head";
import Link from "next/link";

import {
  PlasmicImg as PlasmicImg__,
  PlasmicLink as PlasmicLink__,
  classNames
} from "@plasmicapp/react-web";

import { FormItemWrapper } from "@plasmicpkgs/antd5/skinny/FormItem";
import { AntdInput } from "@plasmicpkgs/antd5/skinny/registerInput";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import sty from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__LockSvg";

export default function CreateAccountPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleCreateAccount() {
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 👉 SUPABASE ENTRA AQUI
    // await supabase.auth.signUp({ email, password });
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>

      <div className={projectcss.plasmic_page_wrapper}>
        <div
          className={classNames(
            projectcss.all,
            projectcss.root_reset,
            projectcss.plasmic_default_styles,
            projectcss.plasmic_mixins,
            sty.root
          )}
        >
          <PlasmicImg__
            className={sty.img}
            alt=""
            displayWidth="700px"
            src={{
              src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
              fullWidth: 297,
              fullHeight: 210
            }}
          />

          <div className={classNames(projectcss.all, sty.rectangle)}>
            <h6
              className={classNames(
                projectcss.all,
                projectcss.h6,
                projectcss.__wab_text,
                sty.h6
              )}
            >
              Create corporative account
            </h6>

            {/* EMAIL */}
            <FormItemWrapper
              className={classNames("__wab_instance", sty.formField__bwLhI)}
              label={
                <UserSvgIcon
                  className={classNames(projectcss.all, sty.svg__f2O7)}
                />
              }
            >
              <AntdInput
                className={classNames("__wab_instance", sty.email)}
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormItemWrapper>

            {/* PASSWORD */}
            <FormItemWrapper
              className={classNames("__wab_instance", sty.formField___4XlWd)}
              label={
                <LockSvgIcon
                  className={classNames(projectcss.all, sty.svg__elYWb)}
                />
              }
            >
              <AntdInput
                className={classNames("__wab_instance", sty.password)}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormItemWrapper>

            {/* CONFIRM PASSWORD */}
            <FormItemWrapper
              className={classNames("__wab_instance", sty.formField___0Hc3Z)}
              label={
                <LockSvgIcon
                  className={classNames(projectcss.all, sty.svg__hmebx)}
                />
              }
            >
              <AntdInput
                className={classNames("__wab_instance", sty.confirmPassword)}
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormItemWrapper>

            {error && (
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.errorText
                )}
              >
                {error}
              </div>
            )}

            <LoginButton
              className={classNames("__wab_instance", sty.loginButton)}
              onClick={handleCreateAccount}
            >
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__vk2Nl
                )}
              >
                Create account
              </div>
            </LoginButton>

            <SignInWithGoogle
              className={classNames("__wab_instance", sty.signInWithGoogle)}
            />

            <div className={classNames(projectcss.all, sty.createAccount)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__j3Au8
                )}
              >
                Already have account?
              </div>

              <PlasmicLink__
                className={classNames(
                  projectcss.all,
                  projectcss.a,
                  projectcss.__wab_text,
                  sty.link__z76Ps
                )}
                component={Link}
                href="/c-login"
                platform="nextjs"
              >
                Log in
              </PlasmicLink__>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
