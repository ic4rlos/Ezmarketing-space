import * as React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const { userId, loading } = useAuth();

  // 🚫 SEM LOGIN
  if (!loading && !userId) {
    router.replace("/c-login");
    return null;
  }

  if (loading) return null;

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={{
          ...router.query,
          userId, // ✅ vem do AuthContext
        }}
        query={router.query}
      >
        <PlasmicCEditProfile />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
