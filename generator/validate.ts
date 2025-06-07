import { promises as fs } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import type { Post, PostsData } from "./index.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const rootDir = resolve(__dirname, "..");

// Load configuration
const configPath = join(rootDir, "config.json");
const config = JSON.parse(await fs.readFile(configPath, "utf-8"));

const validatePost = (post: Post): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!post.title) errors.push("Missing title");
  if (!post.excerpt) errors.push("Missing excerpt");
  if (!post.slug) errors.push("Missing slug");
  if (!post.date) errors.push("Missing date");
  
  // Validate date format
  if (post.date && isNaN(new Date(post.date).getTime())) {
    errors.push("Invalid date format");
  }
  
  // Validate slug format
  if (post.slug && !/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push("Invalid slug format (should only contain lowercase letters, numbers, and hyphens)");
  }
  
  return { valid: errors.length === 0, errors };
};

const validateMarkdownFile = async (post: Post): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  try {
    const markdownPath = join(rootDir, "markdown", `${post.slug}.md`);
    const content = await fs.readFile(markdownPath, "utf-8");
    
    if (!content || content.trim().length === 0) {
      errors.push("Empty markdown file");
    }
    
    if (content.includes('<script>') || content.includes('javascript:')) {
      errors.push("Potentially unsafe content detected");
    }
    
    // Check for proper markdown structure
    if (!content.includes('#') && !content.includes('##')) {
      errors.push("No headings found in markdown");
    }
    
  } catch (error) {
    errors.push(`Cannot read markdown file: ${error}`);
  }
  
  return { valid: errors.length === 0, errors };
};

const validateTemplates = async (): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  try {
    const templateDir = join(rootDir, config.build.templateDir);
    const requiredTemplates = ['blog.html', 'homepage.html'];
    
    for (const template of requiredTemplates) {
      try {
        const templatePath = join(templateDir, template);
        const content = await fs.readFile(templatePath, "utf-8");
        
        if (!content.includes('{{')) {
          errors.push(`Template ${template} appears to have no template variables`);
        }
        
        if (!content.includes('</html>')) {
          errors.push(`Template ${template} appears to be incomplete HTML`);
        }
        
      } catch (error) {
        errors.push(`Cannot read template ${template}: ${error}`);
      }
    }
  } catch (error) {
    errors.push(`Cannot access template directory: ${error}`);
  }
  
  return { valid: errors.length === 0, errors };
};

const validateContent = async (): Promise<void> => {
  console.log("🔍 Validating content...");
  
  let hasErrors = false;
  
  try {
    // Validate configuration
    console.log("📋 Validating configuration...");
    if (!config.site?.name || !config.author?.name) {
      console.error("❌ Invalid configuration: missing required fields");
      hasErrors = true;
    } else {
      console.log("✅ Configuration is valid");
    }
    
    // Validate templates
    console.log("📄 Validating templates...");
    const templateValidation = await validateTemplates();
    if (!templateValidation.valid) {
      console.error("❌ Template validation failed:");
      templateValidation.errors.forEach(error => console.error(`   - ${error}`));
      hasErrors = true;
    } else {
      console.log("✅ Templates are valid");
    }
    
    // Validate posts
    console.log("📝 Validating posts...");
    const postsData = await fs.readFile(join(rootDir, "markdown/posts.json"), "utf-8");
    const { posts }: PostsData = JSON.parse(postsData);
    
    let validPostsCount = 0;
    
    for (const post of posts) {
      const postValidation = validatePost(post);
      const markdownValidation = await validateMarkdownFile(post);
      
      const allErrors = [...postValidation.errors, ...markdownValidation.errors];
      
      if (allErrors.length > 0) {
        console.error(`❌ Post "${post.title || post.slug}" has errors:`);
        allErrors.forEach(error => console.error(`   - ${error}`));
        hasErrors = true;
      } else {
        validPostsCount++;
        console.log(`✅ Post "${post.title}" is valid`);
      }
    }
    
    console.log(`\n📊 Validation Summary:`);
    console.log(`   Total posts: ${posts.length}`);
    console.log(`   Valid posts: ${validPostsCount}`);
    console.log(`   Invalid posts: ${posts.length - validPostsCount}`);
    
    if (hasErrors) {
      console.error("\n❌ Validation failed! Please fix the errors above.");
      process.exit(1);
    } else {
      console.log("\n✅ All content is valid!");
    }
    
  } catch (error) {
    console.error("❌ Validation error:", error);
    process.exit(1);
  }
};

validateContent();