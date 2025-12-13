// pages/c-login.tsx
import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

export default function CLogin() {
  const router = useRouter();

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* 
          NADA de wrappers.
          NADA de centralização manual.
          O .root do Plasmic é a página.
        */}
        <PlasmicLCLogin />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
