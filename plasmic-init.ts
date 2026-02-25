import { registerComponent } from '@plasmicapp/loader-nextjs';
import CropUpload from './components/CropUpload';

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
