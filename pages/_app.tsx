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
    const isAgency = router.pathname.startsWith("/a-");
    const supabase = isAgency ? getSupabaseA() : getSupabaseC();

    // pega token atual (reload / refresh)
    const storageKey = isAgency
      ? "sb-agency-access-token"
      : "sb-company-access-token";

    const session = supabase.auth.getSession?.();
    if (session && "data" in session) {
      const token = session.data.session?.access_token;
      if (token) {
        localStorage.setItem(storageKey, token);
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const token = session?.access_token;
        if (token) {
          localStorage.setItem(storageKey, token);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router.pathname]);

  return (
    <PlasmicRootProvider>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}
