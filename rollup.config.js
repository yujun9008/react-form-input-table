import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import css from "rollup-plugin-import-css";

import { terser } from "rollup-plugin-terser";
export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundles.js",
  },
  external: ["react", "react-dom"],
  plugins: [
    resolve(), // 查找和打包node_modules中的第三方模块

    commonjs({
      include: "/node_modules/",
    }),
    typescript(), // 解析TypeScript
    css(),
  ],
};
