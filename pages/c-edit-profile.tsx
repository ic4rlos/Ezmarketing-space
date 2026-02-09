import * as React from "react";
import { useRouter } from "next/router";
import { useCAuth } from "../contexts/c-AuthContext";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const { user, loading } = useCAuth();

  // ⏳ Enquanto o auth carrega, apenas espera
  if (loading) {
    return null;
  }

  // ⚠️ NÃO redireciona
  // ⚠️ NÃO bloqueia
  // ⚠️ Apenas passa userId se existir
  return (
    <PageParamsProvider__
      route={router.pathname}
      params={{
        ...router.query,
        userId: user?.id ?? null,
      }}
      query={router.query}
    >
      <PlasmicCEditProfile />
    </PageParamsProvider__>
  );
}
