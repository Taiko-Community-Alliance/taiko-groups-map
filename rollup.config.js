const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");
const json = require("@rollup/plugin-json");
const css = require("rollup-plugin-import-css");

module.exports = {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife", // suitable for <script> tag
    sourcemap: false,
  },
  plugins: [
    json(),
    css({ output: "styles.css" }),
    resolve(),
    commonjs(),
    terser(),
  ],
};
