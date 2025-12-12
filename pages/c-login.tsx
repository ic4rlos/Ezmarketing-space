// pages/c-login.tsx
// Versão corrigida: usa useDollarState corretamente (retorna $state, não [state,setState])
import * as React from "react";
import Head from "next/head";
import Link from "next/link";

import {
  PlasmicImg,
  PlasmicLink,
  useDollarState,
  generateOnMutateForSpec,
  generateStateOnChangePropForCodeComponents,
  generateStateValueProp,
  initializeCodeComponentStates,
} from "@plasmicapp/react-web";

import { FormWrapper } from "@plasmicpkgs/antd5/skinny/Form";
import { FormItemWrapper } from "@plasmicpkgs/antd5/skinny/FormItem";
import { AntdInput } from "@plasmicpkgs/antd5/skinny/registerInput";
import { AntdPassword } from "@plasmicpkgs/antd5/skinny/registerInput";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";

import projectcss from "../components/plasmic/ez_marketing_platform/plasmic.module.css";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";

/*
  Nota: este arquivo ativa várias helpers do Plasmic que podem provocar o erro
  runtime que você queria testar. Use só para teste.
*/

export default function CLogin() {
  // refs/context props conforme padrão Plasmic
  const refsRef = React.useRef<any>({});
  const $refs = refsRef.current;
  const $ctx = {}; // ambiente de data-sources mínimo
  const $props = {}; // props simuladas
  const $queries = {};

  // 1) stateSpecs (igual ao gerado pelo Plasmic)
  const stateSpecs = React.useMemo(
    () => [
      {
        path: "email.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => undefined,
        onMutate: generateOnMutateForSpec("value", /*helpers*/ undefined),
      },
      {
        path: "password.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => undefined,
        onMutate: generateOnMutateForSpec("value", /*helpers*/ undefined),
      },
      {
        path: "form.value",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => undefined,
        refName: "form",
        onMutate: generateOnMutateForSpec("value", /*helpers*/ undefined),
      },
      {
        path: "form.isSubmitting",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => false,
        refName: "form",
        onMutate: generateOnMutateForSpec("isSubmitting", /*helpers*/ undefined),
      },
    ],
    []
  );

  // 2) CHAVE: useDollarState retorna UM objeto $state (não array)
  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries,
    $refs,
  });

  // 3) handlers que usam helpers Plasmic — isto é o gatilho para os internals
  const handleEmailChange = React.useCallback(
    (...args: any[]) =>
      generateStateOnChangePropForCodeComponents(
        $state,
        "value",
        ["email", "value"],
        /*helpers*/ undefined
      ).apply(null, args),
    [$state]
  );

  const handlePasswordChange = React.useCallback(
    (...args: any[]) =>
      generateStateOnChangePropForCodeComponents(
        $state,
        "value",
        ["password", "value"],
        /*helpers*/ undefined
      ).apply(null, args),
    [$state]
  );

  // 4) Inicializações de state para inputs — segue padrão Plasmic
  const emailChildProps: any = {
    autoFocus: false,
    bordered: true,
    className: styles.email,
    onChange: handleEmailChange,
    placeholder: "Email",
    readOnly: false,
    size: "middle",
    type: "email",
    value: generateStateValueProp($state, ["email", "value"]),
  };

  initializeCodeComponentStates(
    $state,
    [{ name: "value", plasmicStateName: "email.value" }],
    [],
    /*helpers*/ {},
    emailChildProps
  );

  const passwordChildProps: any = {
    className: styles.password,
    onChange: handlePasswordChange,
    placeholder: "Password",
    value: generateStateValueProp($state, ["password", "value"]),
  };

  initializeCodeComponentStates(
    $state,
    [{ name: "value", plasmicStateName: "password.value" }],
    [],
    /*helpers*/ {},
    passwordChildProps
  );

  return (
    <>
      <Head>
        <title>Company Login — test</title>
      </Head>

      <div className={styles.root}>
        <PlasmicImg
          className={styles.img}
          src={{
            src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
            fullWidth: 297,
            fullHeight: 210,
          } as any}
        />

        <div className={styles.rectangle}>
          <div className={styles.text__o0KFf}>
            <h6 className={styles.h6}>Login</h6>
          </div>

          <FormWrapper className={styles.form}>
            <FormItemWrapper className={styles.formField__nVf3S} label="">
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* ícone left */}
                <img
                  src="/plasmic/ez_marketing_platform/icons/user.svg"
                  className={styles.svg__wXpbV}
                  alt=""
                />
                <AntdInput {...emailChildProps} />
              </div>
            </FormItemWrapper>

            <FormItemWrapper className={styles.formField__p0HYe} label="">
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/plasmic/ez_marketing_platform/icons/lock.svg"
                  className={styles.svg__ihNhg}
                  alt=""
                />
                <AntdPassword {...passwordChildProps} />
              </div>
            </FormItemWrapper>

            <LoginButton className={styles.loginButton}>Login</LoginButton>

            <PlasmicLink component={Link} href="/c-reset-password" className={styles.link__o7Usc}>
              Forgot password?
            </PlasmicLink>

            <SignInWithGoogle className={styles.signInWithGoogle} />
          </FormWrapper>

          <div className={styles.createAccount}>
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
