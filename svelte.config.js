import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { execSync } from "node:child_process";

/** @type {import('@sveltejs/kit').Config} */

let commitHash = "";
try {
  commitHash = execSync("git rev-parse HEAD").toString().trim();
} catch (e) {
  console.warn(
    "warning: git not installed or not found. using current timestamp as build date instead",
  );
  commitHash = `build-${Date.now()}`;
}

const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    version: {
      name: commitHash,
    },
  },
  compilerOptions: {
    customElement: true,
  },
};

export default config;
