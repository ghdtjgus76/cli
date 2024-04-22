import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  treeshake: true,
  splitting: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: false,
  minify: true,
  target: "node18",
  outDir: "dist",
});
