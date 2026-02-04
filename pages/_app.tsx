import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import { useEffect } from "react";

// importa os dois clients
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const supabaseA = getSupabaseA();
    const supabaseC = getSupabaseC();

    const attachListener = (supabase: any) => {
      supabase.auth.onAuthStateChange((event: string, session: any) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.access_token) {
            localStorage.setItem("sb-access-token", session.access_token);
          }
        }
        if (event === "SIGNED_OUT") {
          localStorage.removeItem("sb-access-token");
        }
      });
    };

    attachListener(supabaseA);
    attachListener(supabaseC);
  }, []);

  return (
    <PlasmicRootProvider>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}
