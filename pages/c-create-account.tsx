import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getSupabaseC } from "../lib/c-supabaseClient";

import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

export default function CCreateAccount() {
  const router = useRouter();

  async function handleSubmit(_: any, formValues: any) {
    const { email, password, confirmPassword } = formValues || {};

    if (!email || !password || !confirmPassword) {
      throw new Error("kkkkkkkkkkkkkkkk fudeu");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const supabase = getSupabaseC();

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    router.push("/c-login");
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <Head>
          <title>Create Account</title>
        </Head>

        <PlasmicLCCreateAccount
          overrides={{
            loginButton: {
              props: {
                submitsForm: true,
                onClick: handleSubmit
              }
            }
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
