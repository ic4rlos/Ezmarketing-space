import type { AppProps } from "next/app";

import "@/styles/globals.css";

/**
 * CSS GLOBAL OBRIGATÓRIO PARA O DESIGN DO PLASMIC
 * (seguro no Pages Router)
 */
import "@plasmicapp/react-web/lib/plasmic.css";

/**
 * CSS GLOBAL OBRIGATÓRIO PARA ANT DESIGN
 * ⚠️ DEPENDÊNCIA VISUAL
 * Se remover, inputs do AntD perdem estilo
 */
import "antd/dist/reset.css";

/**
 * ⚠️ NOTA IMPORTANTE
 * PlasmicRootProvider NÃO é mais necessário
 * porque:
 * - você NÃO está usando runtime do Plasmic
 * - NÃO usa <PlasmicComponent />
 * - NÃO usa slots / variants
 *
 * Manter ele aqui não ajuda no visual
 * e só adiciona complexidade invisível.
 */

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
