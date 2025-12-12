// pages/c-login.tsx
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

export default function CLogin() {
  const refsRef = React.useRef<any>({});
  const $refs = refsRef.current;
  const $ctx = {};
  const $props = {};
  const $queries = {};

  // Corrigido: type agora é literal válido
  const stateSpecs = React.useMemo(
    () => [
      {
        path: "email.value",
        type: "private" as const,
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => undefined,
        onMutate: generateOnMutateForSpec("value", undefined),
      },
      {
        path: "password.value",
        type: "private" as const,
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => undefined,
        onMutate: generateOnMutateForSpec("value", undefined),
      },
      {
        path: "form.value",
        type: "private" as const,
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => undefined,
        refName: "form",
        onMutate: generateOnMutateForSpec("value", undefined),
      },
      {
        path: "form.isSubmitting",
        type: "private" as const,
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }: any) => false,
        refName: "form",
        onMutate: generateOnMutateForSpec("isSubmitting", undefined),
      },
    ],
    []
  );

  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries,
    $refs,
  });

  const handleEmailChange = React.useCallback(
    (...args: any[]) =>
      generateStateOnChangePropForCodeComponents(
        $state,
        "value",
        ["email", "value"],
        undefined
      ).apply(null, args),
    [$state]
  );

  const handlePasswordChange = React.useCallback(
    (...args: any[]) =>
      generateStateOnChangePropForCodeComponents(
        $state,
        "value",
        ["password", "value"],
        undefined
      ).apply(null, args),
    [$state]
  );

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
    {},
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
    {},
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
