import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const isAgency = router.pathname.startsWith("/a-");
    const supabase = isAgency ? getSupabaseA() : getSupabaseC();

    // pega token inicial (refresh / reload)
    const token = localStorage.getItem(
      isAgency ? "sb-agency-access-token" : "sb-company-access-token"
    );
    setAuthToken(token);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const newToken = session?.access_token ?? null;
        setAuthToken(newToken);

        if (newToken) {
          localStorage.setItem(
            isAgency ? "sb-agency-access-token" : "sb-company-access-token",
            newToken
          );
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router.pathname]);

  return (
    <PlasmicRootProvider
      pageParams={{
        authToken, // 👈 ISSO É O MAIS IMPORTANTE
      }}
    >
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}
