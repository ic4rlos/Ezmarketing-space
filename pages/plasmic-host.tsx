import * as React from "react";
import { PlasmicCanvasHost, registerComponent } from "@plasmicapp/react-web/lib/host";
import CropUpload from "../components/CropUpload";

// Register the component for the classic host mode
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

// prevent heavy pre-render behavior that can cause module resolution at build time
export const dynamic = "force-dynamic";
