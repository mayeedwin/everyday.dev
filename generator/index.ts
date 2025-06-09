import { promises as fs } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import type {
  Post,
  PostsData,
  TemplateData,
  BlogTemplateData,
  SiteConfig,
  NavigationItem,
  SocialLink
} from "./index.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const rootDir = resolve(__dirname, "..");

// Load configuration
const configPath = join(rootDir, "site.config.json");
const config: SiteConfig = JSON.parse(await fs.readFile(configPath, "utf-8"));

const WORDS_PER_MINUTE = config.build.wordsPerMinute;
const CURRENT_YEAR = new Date().getFullYear();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string): string => {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(str, Prism.languages[lang], lang);
      } catch {}
    }
    return md.utils.escapeHtml(str);
  }
});

// Template loading functions
const loadTemplate = async (templateName: string): Promise<string> => {
  try {
    const templatePath = join(
      rootDir,
      config.build.templateDir,
      `${templateName}.html`
    );
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    console.error(`❌ Error loading template ${templateName}:`, error);
    throw error;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
};

const calculateReadingTime = (content: string): string => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return `${minutes} min read`;
};

const generateNavigationHTML = (
  navigation: NavigationItem[],
  activePage?: string
): string => {
  return navigation
    .map((item) => {
      const isActive =
        activePage && item.href.includes(activePage) ? " active" : "";
      const iconSvg = item.icon 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
             <path d="${item.icon}"/>
           </svg>` 
        : '';
      return `<li class="nav-item">
        <a href="${item.href}" class="nav-link${isActive}"${
        item.external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>
          ${iconSvg}
          <span>${item.label}</span>
        </a>
    </li>`;
    })
    .join("\n                    ");
};

const generateProfileNavigationHTML = (
  navigation: NavigationItem[],
  activePage?: string
): string => {
  return navigation
    .map((item) => {
      const isActive =
        activePage && item.href.includes(activePage) ? " active" : "";
      const iconSvg = item.icon 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
             <path d="${item.icon}"/>
           </svg>` 
        : '';
      return `<li><a href="${item.href}" class="nav-link${isActive}"${
        item.external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>
        ${iconSvg}
        <span>${item.label}</span>
      </a></li>`;
    })
    .join("\n                        ");
};

const generateSocialLinksHTML = (socialLinks: SocialLink[]): string => {
  return socialLinks
    .map(
      (link) =>
        `<a href="${link.href}" class="social-link" aria-label="${link.label}" target="_blank" rel="noopener noreferrer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="${link.iconPath}"/>
                        </svg>
                    </a>`
    )
    .join("\n                    ");
};

const replaceTemplateVariables = (
  template: string,
  data: TemplateData,
  activePage?: string
): string => {
  const socialLinksJson = JSON.stringify(config.author.socialLinks.map((link: SocialLink) => link.href));
  const keywordsJson = JSON.stringify(config.seo.keywords);
  const technologiesJson = JSON.stringify([
    "JavaScript", "TypeScript", "React", "Node.js", "Web Technologies", "Software Engineering"
  ]);

  let result = template
    .replace(/{{title}}/g, data.title || "")
    .replace(/{{excerpt}}/g, data.excerpt || "")
    .replace(/{{date}}/g, data.date || "")
    .replace(/{{dateISO}}/g, data.dateISO || "")
    .replace(/{{readingTime}}/g, data.readingTime || "")
    .replace(/{{content}}/g, data.content || "")
    .replace(/{{slug}}/g, data.slug || "")
    .replace(/{{posts}}/g, data.posts || "")
    .replace(/{{currentYear}}/g, String(data.currentYear || CURRENT_YEAR))
    .replace(/{{siteName}}/g, config.site.textLogo || config.site.name)
    .replace(/{{siteTitle}}/g, config.site.title)
    .replace(/{{siteSubtitle}}/g, config.site.subtitle || config.author.bio)
    .replace(/{{siteDescription}}/g, config.site.description)
    .replace(/{{siteUrl}}/g, config.site.url)
    .replace(/{{siteFavicon}}/g, config.site.favicon)
    .replace(/{{siteBanner}}/g, config.site.banner)
    .replace(/{{authorName}}/g, config.author.name)
    .replace(/{{authorTitle}}/g, config.author.title)
    .replace(/{{authorJobTitle}}/g, config.author.jobTitle)
    .replace(/{{authorRecognition}}/g, config.author.recognition || config.author.jobTitle)
    .replace(/{{authorBio}}/g, config.author.bio)
    .replace(/{{authorAvatar}}/g, config.author.avatar)
    .replace(/{{authorContactEmail}}/g, config.author.contact?.email || "")
    .replace(/{{authorContactTwitter}}/g, config.author.contact?.twitter || "")
    .replace(/{{authorSocialLinksJson}}/g, socialLinksJson)
    .replace(/{{seoKeywords}}/g, config.seo.keywords.join(", "))
    .replace(/{{seoKeywordsJson}}/g, keywordsJson)
    .replace(/{{seoTechnologiesJson}}/g, technologiesJson)
    .replace(
      /{{navigation}}/g,
      generateNavigationHTML(config.navigation, activePage)
    )
    .replace(
      /{{navigationWithActive}}/g,
      generateNavigationHTML(config.navigation, activePage)
    )
    .replace(
      /{{profileNavigation}}/g,
      generateProfileNavigationHTML(config.navigation, activePage)
    )
    .replace(
      /{{profileNavigationWithActive}}/g,
      generateProfileNavigationHTML(config.navigation, activePage)
    )
    .replace(
      /{{socialLinks}}/g,
      generateSocialLinksHTML(config.author.socialLinks)
    );

  return result;
};

// Content validation functions
const validatePost = (post: Post): boolean => {
  if (!post.title || !post.excerpt || !post.slug || !post.date) {
    console.error(`❌ Invalid post data:`, post);
    return false;
  }

  // Validate date format
  if (isNaN(new Date(post.date).getTime())) {
    console.error(`❌ Invalid date format for post: ${post.title}`);
    return false;
  }

  // Validate slug format (no spaces, special characters)
  if (!/^[a-z0-9-]+$/.test(post.slug)) {
    console.error(
      `❌ Invalid slug format for post: ${post.title}. Slug should only contain lowercase letters, numbers, and hyphens.`
    );
    return false;
  }

  return true;
};

const validateMarkdownContent = (
  content: string,
  postTitle: string
): boolean => {
  if (!content || content.trim().length === 0) {
    console.error(`❌ Empty markdown content for post: ${postTitle}`);
    return false;
  }

  // Check for potential security issues
  if (content.includes("<script>") || content.includes("javascript:")) {
    console.error(
      `❌ Potentially unsafe content detected in post: ${postTitle}`
    );
    return false;
  }

  return true;
};

const generatePostHTML = (post: Post): string => {
  const postCard = `
      <article class="post-card">
        <div class="post-meta">
          <time class="post-date">${formatDate(post.date)}</time>
        </div>
        <h3 class="post-title">
          <a href="/reads/${post.slug}/">${post.title}</a>
        </h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-actions">
          <a href="/reads/${post.slug}/" class="read-more">
            Read More →
          </a>
        </div>
      </article>
    `;
  return postCard;
};

const generateSite = async (): Promise<void> => {
  try {
    console.log("🚀 Generating static site...");

    // Load templates
    const blogTemplate = await loadTemplate("blog");
    const homepageTemplate = await loadTemplate("homepage");

    const blogPagesDir = join(rootDir, config.build.outputDir);
    try {
      await fs.rm(blogPagesDir, { recursive: true, force: true });
    } catch {}

    const postsData = await fs.readFile(
      join(rootDir, "markdown/posts.json"),
      "utf-8"
    );
    const { posts }: PostsData = JSON.parse(postsData);

    // Validate all posts before generation
    const validPosts = posts.filter((post) => {
      if (!validatePost(post)) {
        console.warn(`⚠️  Skipping invalid post: ${post.title || "Unknown"}`);
        return false;
      }
      return true;
    });

    if (validPosts.length === 0) {
      throw new Error("No valid posts found to generate");
    }

    console.log(`📝 Processing ${validPosts.length} valid posts...`);

    const generatedPosts: Post[] = [];

    for (const post of validPosts) {
      try {
        const markdownPath = join(rootDir, "markdown", `${post.slug}.md`);
        const markdownContent = await fs.readFile(markdownPath, "utf-8");

        if (!validateMarkdownContent(markdownContent, post.title)) {
          console.warn(`⚠️  Skipping post with invalid content: ${post.title}`);
          continue;
        }

        const htmlContent = md.render(markdownContent);

        const postDir = join(rootDir, config.build.outputDir, post.slug);
        await fs.mkdir(postDir, { recursive: true });

        const templateData: BlogTemplateData = {
          title: post.title,
          excerpt: post.excerpt,
          date: formatDate(post.date),
          dateISO: post.date,
          readingTime: calculateReadingTime(markdownContent),
          content: htmlContent,
          slug: post.slug,
          currentYear: CURRENT_YEAR
        };

        const html = replaceTemplateVariables(blogTemplate, templateData);

        await fs.writeFile(join(postDir, "index.html"), html);
        generatedPosts.push(post);

        console.log(`✅ Generated: ${post.slug}`);
      } catch (error) {
        console.error(`❌ Error generating post ${post.slug}:`, error);
        continue;
      }
    }

    // Generate homepage
    const sortedPosts = generatedPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const postsHTML = sortedPosts.map(generatePostHTML).join("");

    const homepageData = {
      posts: postsHTML,
      currentYear: CURRENT_YEAR
    };

    const homepageHTML = replaceTemplateVariables(
      homepageTemplate,
      homepageData
    );
    await fs.writeFile(join(rootDir, "index.html"), homepageHTML);

    // Generate speaking page
    try {
      const speakingTemplate = await loadTemplate("speaking");
      const speakingData = {
        currentYear: CURRENT_YEAR
      };
      const speakingHTML = replaceTemplateVariables(
        speakingTemplate,
        speakingData,
        "speaking"
      );
      const speakingDir = join(rootDir, "speaking");
      await fs.mkdir(speakingDir, { recursive: true });
      await fs.writeFile(join(speakingDir, "index.html"), speakingHTML);
      console.log(`✅ Generated speaking page`);
    } catch (error) {
      console.error(`❌ Error generating speaking page:`, error);
    }

    console.log(
      `✅ Generated ${generatedPosts.length} blog posts + homepage + speaking page`
    );
    console.log("📝 Generated files:");
    console.log("   - index.html (homepage)");
    console.log("   - speaking/index.html (speaking page)");
    generatedPosts.forEach((post) => {
      console.log(`   - ${config.build.outputDir}/${post.slug}/index.html`);
    });
  } catch (error) {
    console.error("❌ Error generating site:", error);
    process.exit(1);
  }
};

generateSite();
