import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundles.js",
    name: "ReactFormInputTable",
    format: "umd",
  },
  external: ["react", "react-dom", "antd"],
  plugins: [
    typescript(), // 解析TypeScript
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs({
      include: "node_modules/**",
      namedExports: {
        "node_modules/react-is/index.js": ["isFragment", "isMemo"],
      },
    }),
    postcss(),
  ],
};
