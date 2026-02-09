import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import { CAuthProvider } from "../contexts/c-AuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlasmicRootProvider>
      <CAuthProvider>
        <Component {...pageProps} />
      </CAuthProvider>
    </PlasmicRootProvider>
  );
}
