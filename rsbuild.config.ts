import { defineConfig } from '@rsbuild/core';
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [UnoCSSRspackPlugin()],
    },
  },
});
