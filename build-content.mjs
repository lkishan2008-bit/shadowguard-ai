import { build } from "esbuild";

await build({
  entryPoints: ["src/content.ts"],
  bundle: true,
  format: "iife",
  outfile: "dist/content.js",
  platform: "browser",
  target: "es2020",
  minify: true,
  sourcemap: false,
});
