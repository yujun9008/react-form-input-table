import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import css from "rollup-plugin-import-css";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/main.js",
    name: "ReactFormInputTable",
    format: "umd",
  },
  external: ["react", "react-dom", "antd"],
  plugins: [
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs({
      include: "node_modules/**",
      namedExports: {
        "node_modules/react-is/index.js": ["isFragment", "isMemo"],
      },
    }),
    typescript(), // 解析TypeScript
    babel({
      // exclude: "node_modules/**",
      // presets: ["@babel/env"],
    }),
    postcss({
      extensions: [".css", ".less"],
    }),
    css(),
  ],
};
