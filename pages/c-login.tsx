import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";
import { useCLogin } from "../lib/useCLogin";

export default function CLogin() {
  const router = useRouter();
  const { login, loading, error } = useCLogin();

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <PlasmicLCLogin
          overrides={{
            email: {
              props: {
                onChange: (e) => (window as any).__email = e.target.value,
              },
            },
            password: {
              props: {
                onChange: (e) => (window as any).__password = e.target.value,
              },
            },
            loginButton: {
              props: {
                disabled: loading,
                onClick: () =>
                  login(
                    (window as any).__email,
                    (window as any).__password
                  ),
              },
            },
            errorText: {
              props: {
                children: error ?? "",
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
