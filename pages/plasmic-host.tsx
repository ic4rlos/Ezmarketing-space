import * as React from 'react';
import { PlasmicCanvasHost, registerComponent } from '@plasmicapp/react-web/lib/host';
import CropUpload from '../components/CropUpload';

registerComponent(CropUpload, {
  name: "CropUpload",
  props: {
    onChange: {
      type: "eventHandler"
    },
    accept: {
      type: "string",
      defaultValue: "image/*"
    }
  }
});

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}
