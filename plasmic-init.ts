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
  props: {
    children: 'slot',
    accept: 'string',
    onChange: 'eventHandler'
  },
  defaultStyles: {
    width: '100%',
    maxWidth: '180px'
  }
});
