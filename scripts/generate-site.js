import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        const highlighted = Prism.highlight(str, Prism.languages[lang], lang)
        return `<div class="code-block-container"><pre class="language-${lang}"><code>${highlighted}</code></pre><button class="copy-button" onclick="copyCode(this)">Copy</button></div>`
      } catch (__) {}
    }
    const escaped = md.utils.escapeHtml(str)
    return `<div class="code-block-container"><pre class="language-text"><code>${escaped}</code></pre><button class="copy-button" onclick="copyCode(this)">Copy</button></div>`
  }
})

// Blog post template
const blogTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{{excerpt}}" />
    <meta name="author" content="Maye" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{{title}}" />
    <meta property="og:description" content="{{excerpt}}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="{{title}}" />
    <meta property="twitter:description" content="{{excerpt}}" />
    
    <title>{{title}} - EverydayDev</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/src/styles/main.css" />
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <a href="/" class="nav-logo">everyday.dev</a>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link">WATCH</a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">JOIN</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <div class="app-container">
        <!-- Left Sidebar - Profile -->
        <aside class="profile-sidebar">
            <div class="profile-content">
                <div class="profile-avatar">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Profile" class="avatar-img" />
                    <div class="avatar-ring"></div>
                </div>
                
                <div class="profile-info">
                    <h1 class="profile-name">Maye</h1>
                    <p class="profile-title">Software Engineer</p>
                    <p class="profile-bio">EverydayDev is my coding journal with good vibes only. The daily discoveries, late-night breakthroughs, and lessons that hit different when you're in the zone. For developers who know that the best code comes from the right headspace and energy.</p>
                </div>
                
                <nav class="profile-nav">
                    <ul class="nav-links">
                        <li><a href="#" class="nav-link">WATCH</a></li>
                        <li><a href="#" class="nav-link">JOIN</a></li>
                    </ul>
                </nav>
                
                <div class="profile-social">
                    <a href="https://github.com/mayeedwin" class="social-link" aria-label="GitHub">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a href="https://twitter.com/mayeedwin1" class="social-link" aria-label="Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    <a href="https://linkedin.com/in/mayeedwin" class="social-link" aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                </div>
                
                <div class="profile-copyright">
                    © ${new Date().getFullYear()} Maye. All rights reserved.
                </div>
            </div>
        </aside>
        
        <!-- Right Content Area -->
        <main class="content-area">
            <!-- Sticky navigation bar -->
            <nav class="sticky-nav">
                <div class="sticky-nav-content">
                    <a href="/" class="back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5"/>
                            <path d="m12 19-7-7 7-7"/>
                        </svg>
                    </a>
                    <div class="current-article">
                        <span class="article-indicator">Reading:</span>
                        <span class="article-title">{{title}}</span>
                    </div>
                </div>
            </nav>

            <!-- Blog post content -->
            <article class="blog-post">
                <header class="post-header">
                    <div class="post-meta">
                        <time class="post-date">{{date}}</time>
                        <span class="post-reading-time">{{readingTime}}</span>
                    </div>
                    <h1 class="post-title">{{title}}</h1>
                    <p class="post-excerpt">{{excerpt}}</p>
                </header>

                <div class="post-body">
                    {{content}}
                </div>
            </article>
        </main>
    </div>

    <script type="module" src="/src/main.ts"></script>
    <script>
        // Disable Prism auto-highlighting since we already processed code blocks
        window.Prism = window.Prism || {};
        window.Prism.manual = true;
    </script>
    <script>
        function copyCode(button) {
            const codeBlock = button.parentElement.querySelector('code');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>`

// Homepage template
const homepageTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="EverydayDev - A coding journal with good vibes only. Daily discoveries, late-night breakthroughs, and lessons for developers." />
    <meta name="author" content="Maye" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="EverydayDev - Coding Journal" />
    <meta property="og:description" content="A coding journal with good vibes only. Daily discoveries, late-night breakthroughs, and lessons for developers." />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="EverydayDev - Coding Journal" />
    <meta property="twitter:description" content="A coding journal with good vibes only. Daily discoveries, late-night breakthroughs, and lessons for developers." />
    
    <title>EverydayDev - Coding Journal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/src/styles/main.css" />
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <a href="/" class="nav-logo">everyday.dev</a>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link">WATCH</a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">JOIN</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <div class="app-container">
        <!-- Left Sidebar - Profile -->
        <aside class="profile-sidebar">
            <div class="profile-content">
                <div class="profile-avatar">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Profile" class="avatar-img" />
                    <div class="avatar-ring"></div>
                </div>
                
                <div class="profile-info">
                    <h1 class="profile-name">Maye</h1>
                    <p class="profile-title">Software Engineer</p>
                    <p class="profile-bio">EverydayDev is my coding journal with good vibes only. The daily discoveries, late-night breakthroughs, and lessons that hit different when you're in the zone. For developers who know that the best code comes from the right headspace and energy.</p>
                </div>
                
                <nav class="profile-nav">
                    <ul class="nav-links">
                        <li><a href="#" class="nav-link">WATCH</a></li>
                        <li><a href="#" class="nav-link">JOIN</a></li>
                    </ul>
                </nav>
                
                <div class="profile-social">
                    <a href="https://github.com/mayeedwin" class="social-link" aria-label="GitHub">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a href="https://twitter.com/mayeedwin1" class="social-link" aria-label="Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    <a href="https://linkedin.com/in/mayeedwin" class="social-link" aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                </div>
                
                <div class="profile-copyright">
                    © ${new Date().getFullYear()} Maye. All rights reserved.
                </div>
            </div>
        </aside>
        
        <!-- Right Content Area -->
        <main class="content-area">
            <div class="home-content">
                <section class="welcome-section">
                    <h2 class="welcome-title">Latest Entries</h2>
                    <p class="welcome-subtitle">Daily discoveries and breakthrough moments in code</p>
                </section>
                
                <section class="blog-posts">
                    <div class="posts-grid">
                        {{posts}}
                    </div>
                </section>
            </div>
        </main>
    </div>

    <script type="module" src="/src/main.ts"></script>
    <script>
        // Disable Prism auto-highlighting since we already processed code blocks
        window.Prism = window.Prism || {};
        window.Prism.manual = true;
    </script>
</body>
</html>`

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

async function generateSite() {
  try {
    console.log('🚀 Generating static site...')

    // Read posts.json
    const postsData = await fs.readFile(path.join(rootDir, 'public/posts/posts.json'), 'utf-8')
    const { posts } = JSON.parse(postsData)

    // Generate individual blog post pages
    for (const post of posts) {
      // Read markdown content
      const markdownPath = path.join(rootDir, 'public/posts', `${post.slug}.md`)
      const markdownContent = await fs.readFile(markdownPath, 'utf-8')
      
      // Convert markdown to HTML
      const htmlContent = md.render(markdownContent)
      
      // Create post directory
      const postDir = path.join(rootDir, 'reads', post.slug)
      await fs.mkdir(postDir, { recursive: true })

      // Generate HTML from template
      const html = blogTemplate
        .replace(/{{title}}/g, post.title)
        .replace(/{{excerpt}}/g, post.excerpt)
        .replace(/{{date}}/g, formatDate(post.date))
        .replace(/{{readingTime}}/g, post.readingTime)
        .replace(/{{content}}/g, htmlContent)

      // Write the HTML file
      await fs.writeFile(path.join(postDir, 'index.html'), html)
    }

    // Generate homepage with post list
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    const postsHTML = sortedPosts.map(post => `
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
    `).join('')

    const homepageHTML = homepageTemplate.replace('{{posts}}', postsHTML)
    await fs.writeFile(path.join(rootDir, 'index.html'), homepageHTML)

    console.log(`✅ Generated ${posts.length} blog posts + homepage`)
    console.log('📝 Generated files:')
    console.log('   - index.html (homepage)')
    posts.forEach(post => {
      console.log(`   - reads/${post.slug}/index.html`)
    })

  } catch (error) {
    console.error('❌ Error generating site:', error)
    process.exit(1)
  }
}

generateSite()