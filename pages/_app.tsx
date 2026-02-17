import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import { useCAuth } from "../contexts/c-AuthContext";

function AppInner({ Component, pageProps }: AppProps) {
  const { loading } = useCAuth();

  // ⛔ NÃO renderiza Plasmic enquanto auth não existe
  if (loading) {
    return null;
  }

  return (
    <PlasmicRootProvider>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}

export default function MyApp(props: AppProps) {
  return <AppInner {...props} />;
}
