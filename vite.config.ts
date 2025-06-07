import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Read posts.json to get all blog post slugs
const postsJsonPath = resolve(__dirname, "src/data/posts.json");
let input: Record<string, string> = {
  main: resolve(__dirname, "index.html"),
  speaking: resolve(__dirname, "speaking/index.html")
};

// Only add blog post entries if they exist (after generation)
if (existsSync(postsJsonPath)) {
  try {
    const postsData = readFileSync(postsJsonPath, "utf-8");
    const { posts }: { posts: Array<{ slug: string }> } = JSON.parse(postsData);

    // Add each blog post as an entry point if the directory exists
    posts.forEach((post) => {
      const postPath = resolve(__dirname, `reads/${post.slug}/index.html`);
      if (existsSync(postPath)) {
        input[`reads-${post.slug}`] = postPath;
      }
    });
  } catch (error) {
    console.warn("Could not read posts.json, building without blog posts");
  }
}

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    rollupOptions: {
      input
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
