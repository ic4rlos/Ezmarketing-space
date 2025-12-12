// 🚨 FORÇA O ERRO — NÃO USAR EM PRODUÇÃO
// Ativa TODOS os módulos críticos do Plasmic que causam o erro lendário

import * as React from "react";
import Head from "next/head";
import Link from "next/link";

import {
  PlasmicImg,
  PlasmicLink,
  useDollarState,
  generateStateOnChangeProp,
  generateOnMutateForSpec,
  initializeCodeComponentStates
} from "@plasmicapp/react-web";

import { FormWrapper } from "@plasmicpkgs/antd5/skinny/Form";
import { FormItemWrapper } from "@plasmicpkgs/antd5/skinny/FormItem";
import { AntdInput } from "@plasmicpkgs/antd5/skinny/registerInput";
import { AntdPassword } from "@plasmicpkgs/antd5/skinny/registerInput";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

export default function CLogin() {

  // 🚨 1) ATIVAR useDollarState (um dos detonadores principais)
  const [state, setState] = useDollarState([
    {
      path: "email.value",
      type: "private",
      variableType: "text",
      initFunc: () => ""
    },
    {
      path: "password.value",
      type: "private",
      variableType: "text",
      initFunc: () => ""
    }
  ]);

  function handleEmailChange(e: any) {
    // 🚨 2) ATIVAR generateStateOnChangeProp (o gatilho clássico)
    generateStateOnChangeProp(
      state,
      "value",
      ["email", "value"]
    )(e);
  }

  function handlePasswordChange(e: any) {
    generateStateOnChangeProp(
      state,
      "value",
      ["password", "value"]
    )(e);
  }

  // 🚨 3) ATIVAR initializeCodeComponentStates para inputs Plasmic
  const emailProps: any = {
    value: state.email?.value,
    placeholder: "Email",
    onChange: handleEmailChange
  };

  initializeCodeComponentStates(
    state,
    [{ name: "value", plasmicStateName: "email.value" }],
    [],
    {},
    emailProps
  );

  const passwordProps: any = {
    value: state.password?.value,
    placeholder: "Password",
    onChange: handlePasswordChange
  };

  initializeCodeComponentStates(
    state,
    [{ name: "value", plasmicStateName: "password.value" }],
    [],
    {},
    passwordProps
  );

  // 🚨 4) ATIVAR FORMWRAPPER / FORMITEMWRAPPER (fatal para deploy)
  return (
    <>
      <Head>
        <title>Login — FORÇANDO ERRO</title>
      </Head>

      <div className={styles.root}>
        <PlasmicImg
          className={styles.img}
          src={{
            src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
            fullWidth: 297,
            fullHeight: 210
          } as any}
        />

        <div className={styles.rectangle}>
          <div className={styles.text__o0KFf}>
            <h6 className={styles.h6}>Login</h6>
          </div>

          <FormWrapper className={styles.form}>
            <FormItemWrapper
              label="Email"
              className={styles.formField__nVf3S}
            >
              <AntdInput className={styles.email} {...emailProps} />
            </FormItemWrapper>

            <FormItemWrapper
              label="Password"
              className={styles.formField__p0HYe}
            >
              <AntdPassword className={styles.password} {...passwordProps} />
            </FormItemWrapper>

            <LoginButton className={styles.loginButton}>
              Login
            </LoginButton>

            <PlasmicLink
              component={Link}
              href="/c-reset-password"
              className={styles.link__o7Usc}
            >
              Forgot password?
            </PlasmicLink>

            <SignInWithGoogle className={styles.signInWithGoogle} />

          </FormWrapper>

          <div className={styles.createAccount}>
            <div className={styles.text__aXkee}>New to Ez Marketing?</div>
            <PlasmicLink
              component={Link}
              href="/c-create-account"
              className={styles.link__dNNeM}
            >
              Create account
            </PlasmicLink>
          </div>
        </div>
      </div>
    </>
  );
}
