import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// ⚠️ Replace "resume-analyser-intern-project-2025" with your GitHub repo name
export default defineConfig({
    base: "/resume-analyzer-intern-proj-/",
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
