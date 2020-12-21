import { storybookPlugin } from "@web/dev-server-storybook";
import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  nodeResolve: true,
  open: true,
  plugins: [
    esbuildPlugin({ts: true}),
    storybookPlugin({ type: "web-components" }),
  ],
};
