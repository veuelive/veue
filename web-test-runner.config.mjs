import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'app/javascript/components/**/*.test.ts',
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
};
