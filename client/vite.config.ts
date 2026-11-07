import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { config as loadDotenv } from "dotenv";
import { fileURLToPath } from "node:url";

loadDotenv({
	path: fileURLToPath(new URL("../.env", import.meta.url)),
	quiet: true,
});

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
