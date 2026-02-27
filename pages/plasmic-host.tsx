import * as React from "react";
import dynamic from "next/dynamic";
import { registerComponent } from "@plasmicapp/react-web/lib/host";
import CropUpload from "../components/CropUpload";

// 🔒 Carregar o PlasmicCanvasHost apenas no client (sem SSR)
const PlasmicCanvasHost = dynamic(
  () =>
    import("@plasmicapp/react-web/lib/host").then((m) => m.PlasmicCanvasHost),
  { ssr: false }
);

// Registrar o componente customizado
registerComponent(CropUpload, {
  name: "CropUpload",
  importPath: "../components/CropUpload",
  isDefaultExport: true,
  props: {
    onChange: {
      type: "eventHandler",
      argTypes: [
        {
          name: "file",
          type: "object",
        },
      ],
    },
    accept: {
      type: "string",
      defaultValue: "image/*",
    },
    className: {
      type: "class",
    },
    children: {
      type: "slot",
    },
  },
});

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}

// Evita pré-render pesado que pode causar resolução de módulos no build
export const dynamicConfig = "force-dynamic";
