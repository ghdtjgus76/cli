import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

process.env.BABEL_ENV = "production";

export default {
  input: "./src/index.ts",
  output: {
    dir: "./dist",
    format: "esm",
    entryFileNames: "[name].js",
  },
  plugins: [
    peerDepsExternal(),
    resolve({ extensions, preferBuiltins: true }),
    commonjs(),
    babel({ extensions, include: ["src/**/*"], runtimeHelpers: true }),
    json(),
    terser(),
  ],
};
