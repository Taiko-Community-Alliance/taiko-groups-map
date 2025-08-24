const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");
const css = require("rollup-plugin-import-css");
const remoteCsv2JsonResolver = require('./src/rollup-plugin-fetch-csv-json.js');
const replace = require('@rollup/plugin-replace');

module.exports = {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife", // suitable for <script> tag
    sourcemap: false,
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    remoteCsv2JsonResolver(),
    css({ output: "styles.css" }),
    resolve(),
    commonjs(),
    terser(),
  ],
};
