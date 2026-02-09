import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import AuthProvider from "@/contexts/AuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlasmicRootProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </PlasmicRootProvider>
  );
}
