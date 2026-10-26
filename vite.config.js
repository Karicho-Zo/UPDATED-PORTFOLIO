import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// script.js is a classic (non-module) script so the page also works when opened straight from disk.
// Vite doesn't bundle classic scripts, so copy it into the build output next to index.html.
export default {
  plugins: [
    {
      name: "copy-classic-script",
      closeBundle() {
        copyFileSync(resolve("script.js"), resolve("dist/script.js"));
      },
    },
  ],
};
