import * as React from "react";
import {
  PlasmicCanvasHost,
  registerComponent,
} from "@plasmicapp/react-web/lib/host";
import CropUpload from "../components/CropUpload";

registerComponent(CropUpload, {
  name: "CropUpload",
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
