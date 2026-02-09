import * as React from "react";
import { useRouter } from "next/router";
import { useCAuth } from "../contexts/c-AuthContext";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const { user, loading } = useCAuth();

  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/c-login");
    }
  }, [loading, user, router]);

  if (loading) return null;
  if (!user) return null;

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={{
          ...router.query,
          userId: user.id,
        }}
        query={router.query}
      >
        <PlasmicCEditProfile />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
