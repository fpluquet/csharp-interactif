import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const githubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  plugins: [vue()],
  base: githubPages ? "/csharp-interactif/" : "/",
});
