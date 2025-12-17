import * as React from "react";
import { useRouter } from "next/router";
import {
  PageParamsProvider as PageParamsProvider__,
} from "@plasmicapp/react-web/lib/host";

import GlobalContextsProvider from
  "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";

import { PlasmicLCCreateAccount } from
  "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";

export default function CCreateAccount() {
  const router = useRouter();

  /**
   * Código suicida:
   * - ZERO controle de input
   * - ZERO estado no Plasmic
   * - 100% layout, breakpoints, tokens e estrutura no Studio
   */

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* 
          ⚠️ Plasmic controla TUDO:
          - DOM
          - Grid
          - Espaçamento
          - Tokens
          - Breakpoints
          Inputs continuam "cegos" propositalmente
        */}
        <PlasmicLCCreateAccount
          overrides={{
            /**
             * Overrides VISUAIS apenas.
             * Nada de props funcionais.
             * Nada de estado.
             */
            root: {
              style: {
                minHeight: "100vh",
              },
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
