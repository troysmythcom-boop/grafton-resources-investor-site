import {defineConfig} from 'vite';
export default defineConfig({
 build:{rollupOptions:{onwarn(warning,warn){if(warning.code!=='MODULE_LEVEL_DIRECTIVE')warn(warning)},output:{manualChunks(id){if(id.includes('node_modules/three'))return 'three';if(id.includes('node_modules/motion')||id.includes('node_modules/framer-motion'))return 'motion';if(id.includes('map-data'))return 'project-map';}}}},
 server:{host:'127.0.0.1'}
});
