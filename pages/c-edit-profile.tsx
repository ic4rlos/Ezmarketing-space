import * as React from "react";
import { useRouter } from "next/router";
import { useCAuth } from "../contexts/c-AuthContext";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";

export default function CEditProfile() {
  const router = useRouter();
  const { user, loading } = useCAuth();

  // 🔒 Redirect APENAS após o auth estabilizar
  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/c-login");
    }
  }, [loading, user, router]);

  // ⏳ Enquanto valida auth
  if (loading) {
    return null;
  }

  // 🚫 Sem usuário, nada renderiza (redirect já foi disparado)
  if (!user) {
    return null;
  }

  return (
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
  );
}
