import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLALogin } from "../components/plasmic/ez_marketing_platform/PlasmicLALogin";

export default function CLogin() {
  const router = useRouter();

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* CONTAINER RESPONSÁVEL PELO LAYOUT — NÃO TOQUE NO PLASMIC */}
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0e0e0",
          }}
        >
          {/* PLASMIC PURO, SEM WRAPPER PERIGOSO */}
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PlasmicLALogin />
          </div>
        </div>
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
