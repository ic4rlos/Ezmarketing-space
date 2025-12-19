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

  async function handleSubmit(formValues: any) {
    const { email, password, confirmPassword } = formValues || {};

    if (!email || !password || !confirmPassword) {
      throw new Error("Fill in all fields");
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
          onSubmit={handleSubmit}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
