import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";

import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";
import { useRouter } from "next/router";
import getSupabaseC from "../lib/c-supabaseClient";

export default function LCLogin() {
  const router = useRouter();
  const supabase = getSupabaseC();

  // Override only the login button behavior
  const loginOverride = {
    loginButton: {
      props: {
        onClick: async () => {
          try {
            // Get email and password from Plasmic's internal state system
            const email = (window as any).__PlasmicState?.["email.value"];
            const password = (window as any).__PlasmicState?.["password.value"];

            if (!email || !password) {
              alert("Please enter both email and password.");
              return;
            }

            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              alert(error.message);
              return;
            }

            router.push("/c-dashboard");
          } catch (err: any) {
            console.error("Login error:", err);
            alert("An unexpected error occurred.");
          }
        },
      },
    },
  };

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router?.pathname}
        params={router?.query}
        query={router?.query}
      >
        <PlasmicLCLogin overrides={loginOverride} />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}

