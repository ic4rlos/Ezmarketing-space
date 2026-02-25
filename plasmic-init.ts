import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import CropUpload from './components/CropUpload';

export const PLASMIC = initPlasmicLoader({
  projects: [
    // seus projetos aqui
  ],
  preview: true,
});

PLASMIC.registerComponent(CropUpload, {
  name: 'CropUpload',
  importPath: './components/CropUpload',
  isDefaultExport: true,
  props: {
    children: {
      type: "slot"
    },
    accept: {
      type: "string",
      defaultValue: "image/*"
    },
    onChange: {
      type: "eventHandler",
      argTypes: []
    }
  }
});
