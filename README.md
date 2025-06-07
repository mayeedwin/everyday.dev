# EverydayDev

A modern, TypeScript-powered static site with shared UI utilities and responsive design. Built for developers who want to share real experiences, quick wins, and the human side of coding.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate static files
npm run generate

# Build for production
npm run build
```

Visit `http://localhost:3000` to see your site in action!

## 📁 Project Structure

```sh
everyday.dev/
├── generator/              # Static site generator (TypeScript)
│   ├── index.ts           # Main generator logic
│   └── index.models.ts    # TypeScript interfaces
├── markdown/              # Content source
│   ├── posts.json         # Post metadata
│   └── clean-code-fifteen-minutes.md  # Markdown files
├── src/                   # Frontend assets & utilities
│   ├── styles/
│   │   ├── main.css       # Main stylesheet with CSS variables
│   │   └── blog.css       # Blog-specific styles
│   ├── utils/
│   │   ├── ui.ts          # Shared UI utilities & components
│   │   └── markdown.ts    # Markdown processing utilities
│   ├── types/
│   │   └── speaking.ts    # TypeScript interfaces for speaking data
│   ├── router.ts          # Client-side routing (disabled for normal navigation)
│   └── main.ts            # TypeScript entry point
├── speaking/              # Speaking engagements page
│   ├── index.html         # Speaking page
│   └── index.ts           # Speaking page logic
├── reads/                 # Generated blog post HTML files (auto-created)
├── public/                # Static assets
│   ├── data/             # Data files served as static assets
│   │   └── speaking.json # Speaking engagements data
│   └── *.ico, *.svg      # Images and icons
└── index.html             # Generated homepage
```

## ✍️ Adding New Posts

### 1. Create the Markdown File

Add your new post to `markdown/`:

```bash
touch markdown/my-new-post.md
```

Write your content in markdown:

```markdown
# My Awesome Discovery

Today I learned something amazing...

## The Problem

I was working on...

## The Solution

Turns out the answer was...
```

### 2. Update posts.json

Add your post metadata to `markdown/posts.json`:

```json
{
  "posts": [
    {
      "slug": "my-new-post",
      "title": "My Awesome Discovery",
      "excerpt": "A short description of what this post is about",
      "date": "2024-01-20"
    }
  ]
}
```

**Note**: The `readingTime` field is automatically calculated from your markdown content, so you don't need to include it.

### 3. Generate the Site

```bash
npm run generate
```

Your new post will be available at `/reads/my-new-post/`

## 🎤 Managing Speaking Engagements

The site includes a dedicated speaking page that showcases talks, workshops, and presentations.

### Adding Speaking Engagements

Update `public/data/speaking.json` with your talk details:

```json
{
  "speaking": [
    {
      "id": "unique-talk-id",
      "title": "Your Talk Title",
      "date": "2024-01-20",
      "location": "City, Country",
      "duration": "45 minutes",
      "audience": "300+ developers",
      "description": "Brief description of what the talk covers...",
      "topics": ["JavaScript", "TypeScript", "Web Performance"],
      "links": {
        "slides": "https://slides.com/your-slides",
        "video": "https://youtube.com/watch?v=...",
        "event": "https://conference-website.com"
      }
    }
  ]
}
```

The speaking page automatically:

- Displays talks in a clean, card-based layout
- Shows metadata like date, type, and audience size
- Includes topic tags and action links
- Provides contact information for booking inquiries

## 🛠️ How It Works

### The Generator

The heart of the project is a TypeScript-powered static site generator (`generator/index.ts`) that:

1. **Cleans the slate**: Removes the old `reads/` folder to ensure fresh content
2. **Reads metadata**: Loads post information from `markdown/posts.json`
3. **Processes markdown**: Converts each `.md` file to HTML with syntax highlighting
4. **Calculates reading time**: Automatically estimates reading time based on word count
5. **Generates pages**: Creates individual HTML pages for each post
6. **Builds homepage**: Creates the main page with a list of all posts

### Shared UI Architecture

The project features a modular, reusable UI system:

- **Shared utilities** (`src/utils/ui.ts`): Centralized UI functionality for mobile navigation, copy buttons, and common interactions
- **TypeScript interfaces** (`src/types/`): Type-safe data structures
- **Modular components**: Reusable navigation and layout components
- **No code duplication**: All pages use the same underlying utilities

### Auto-Regeneration

The site rebuilds automatically when you:

- Run `npm run dev` (generates + starts dev server)
- Run `npm run build` (generates + builds for production)
- Run `npm run generate` (just generates the static files)

### Styling & Design

- Modern CSS with comprehensive design system using CSS custom properties
- Mobile-first responsive design with proper mobile navigation
- Clean typography optimized for reading
- Thin scrollbars and smooth interactions
- Active navigation states and hover effects
- Compact speaking page layout optimized for content display

## 🎨 Customization

### Changing the Design

Edit `src/styles/main.css` to customize:

- Colors (CSS custom properties at the top)
- Typography
- Layout and spacing
- Component styles

### Modifying Templates

The HTML templates are in `generator/index.ts`:

- `blogTemplate`: Individual post pages
- `homepageTemplate`: Main homepage

### Adding Features

Want to add new functionality? The project is fully TypeScript with:

- **Type-safe interfaces** in `src/types/` and `generator/index.models.ts`
- **Shared utilities** in `src/utils/` for reusable functionality
- **Modular architecture** with clean separation of concerns
- **Modern async/await patterns** and clean error handling
- **No code duplication** - add once, use everywhere

## 📝 Content Guidelines

### Post Structure

Each post should have:

- A clear, descriptive title
- An engaging excerpt (appears on homepage)
- Meaningful content that adds value
- Personal voice and real experiences

### Metadata Fields

In `posts.json`:

- `slug`: URL-friendly identifier (no spaces, lowercase)
- `title`: Display title for the post
- `excerpt`: Short description (1-2 sentences)
- `date`: Publication date (YYYY-MM-DD format)

### Writing Tips

- **Be personal**: Share your actual experiences
- **Be specific**: Real examples are better than abstract concepts
- **Be helpful**: What would past-you have wanted to know?
- **Be human**: It's okay to talk about struggles and failures

## 🚀 Deployment

The generator creates static HTML files that can be deployed anywhere:

### GitHub Pages

```bash
npm run build
# Deploy the `dist/` folder
```

### Netlify

- Connect your repo
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel

```bash
npm run build
vercel --prod
```

## 🔧 Development

### Package Scripts

- `npm run dev`: Generate site + start development server
- `npm run build`: Generate site + build for production
- `npm run generate`: Generate static files only
- `npm run preview`: Generate + preview production build
- `npm run clean`: Remove generated files

### Tech Stack

- **TypeScript**: Type-safe development with modular architecture and arrow functions
- **Vite**: Fast development and building with hot reload
- **Markdown-it**: Markdown processing with syntax highlighting
- **Prism.js**: Code syntax highlighting
- **Modern CSS**: No frameworks, comprehensive design system with CSS custom properties
- **Shared UI utilities**: Centralized TypeScript utilities for consistent UX
- **Static data**: JSON files served from `public/data/` for automatic deployment

## 🤝 Contributing

This is a personal project, but if you find bugs or have suggestions:

1. Open an issue describing the problem
2. If you want to contribute code, fork and submit a PR
3. Keep the focus on simplicity and developer experience

## 📄 License

MIT License - feel free to use this as a template for your own coding journal!

---

**Happy coding!** ✨

Remember: The best learning happens when you document your journey. Keep writing, keep sharing, keep growing.
