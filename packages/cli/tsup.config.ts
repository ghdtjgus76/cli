import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  treeshake: true,
  splitting: false,
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  minify: true,
  target: "node18",
  outDir: "dist",
});
