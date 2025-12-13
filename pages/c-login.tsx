import * as React from "react";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicLCLogin } from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin";

export default function CLogin() {
  return (
    <GlobalContextsProvider>
      {/*
        Opção A:
        - REMOVIDO PageParamsProvider__
        - ZERO wrappers extras
        - O .root do Plasmic continua sendo a página
        - Nenhuma lógica de Supabase aqui ainda
      */}
      <PlasmicLCLogin />
    </GlobalContextsProvider>
  );
}
