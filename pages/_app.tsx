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
    // decide qual client usar pelo prefixo da rota
    const isAgency = router.pathname.startsWith("/a-");
    const isClient = router.pathname.startsWith("/c-");

    const supabase = isAgency ? getSupabaseA() : getSupabaseC();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.access_token) {
          localStorage.setItem("sb-access-token", session.access_token);
        }
      }
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("sb-access-token");
      }
    });
  }, [router.pathname]);

  return (
    <PlasmicRootProvider>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}
