import api from './server/routes'
import { resolve } from 'path'


export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    publicDir: resolve(__dirname, 'public'),
    uiExports: {
      visTypes: [
        'plugins/image-display/image-display',
      ]
    },

    init(server) {
      api(server)
    }
  });
};
