import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const extensions = [".js", ".jsx", ".ts", ".tsx"]; // 어떤 확장자를 처리 할 지 정함

// babel-preset-react-app를 사용한다면 BABEL_ENV를 필수로 설정해야함.
process.env.BABEL_ENV = "production";

export default {
  input: "./src/index.ts", // 어떤 파일부터 불러올지 정함.
  plugins: [
    peerDepsExternal(), // peerDependencies로 설치한 라이브러리들을 external 모듈로 설정
    resolve({ extensions, preferBuiltins: true }), // node_modules 에서 모듈을 불러올 수 있게 해줌. ts/tsx 파일도 불러올 수 있게 해줌
    commonjs(), // CommonJS 형태로 만들어진 모듈도 불러와서 사용 할 수 있게 해줌. 현재 프로젝트 상황에서는 없어도 무방함
    babel({ extensions, include: ["src/**/*"], runtimeHelpers: true }), // Babel을 사용 할 수 있게 해줌
    json(),
  ],
  output: [
    {
      file: "./dist/index.js", // 번들링한 파일을 저장 할 경로
      format: "es", // ES Module 형태로 번들링함
    },
  ],
};
