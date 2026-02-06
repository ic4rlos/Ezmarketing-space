import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Decide qual projeto Supabase usar pela rota
    const isAgency = router.pathname.startsWith("/a-");
    const isCompany = router.pathname.startsWith("/c-");

    // Se não for rota protegida, não faz nada
    if (!isAgency && !isCompany) return;

    const supabase = isAgency ? getSupabaseA() : getSupabaseC();

    // Cada projeto grava seu próprio token
    const storageKey = isAgency
      ? "sb-agency-access-token"
      : "sb-company-access-token";

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
          session?.access_token
        ) {
          localStorage.setItem(storageKey, session.access_token);
        }

        if (event === "SIGNED_OUT") {
          localStorage.removeItem(storageKey);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router.pathname]);

  return (
    <PlasmicRootProvider>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}
