import MarkdownIt from "markdown-it";
import Prism from "prismjs";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: string;
  slug: string;
  content?: string;
}

export interface BlogPostMeta {
  posts: BlogPost[];
}

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(
          str,
          Prism.languages[lang],
          lang
        )}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="language-text"><code class="language-text">${md.utils.escapeHtml(
      str
    )}</code></pre>`;
  }
});

export const renderMarkdown = (content: string): string => {
  return md.render(content);
}

export const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const loadBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch("/posts/posts.json");
    if (!response.ok) {
      throw new Error(`Failed to load posts: ${response.statusText}`);
    }
    const data: BlogPostMeta = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    throw error;
  }
}

export const loadBlogPost = async (slug: string): Promise<BlogPost> => {
  try {
    const posts = await loadBlogPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      throw new Error(`Post not found: ${slug}`);
    }

    const response = await fetch(`/posts/${slug}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load post content: ${response.statusText}`);
    }

    const content = await response.text();

    return {
      ...post,
      content: renderMarkdown(content)
    };
  } catch (error) {
    console.error("Error loading blog post:", error);
    throw error;
  }
}

export const getRelatedPosts = (
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] => {
  return allPosts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, limit);
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
