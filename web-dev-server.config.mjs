import { esbuildPlugin } from "@web/dev-server-esbuild";
export default {
  nodeResolve: true,
  watch: true,
  open: true,
  plugins: [esbuildPlugin({ ts: true })],
}
