# EverydayDev

A TypeScript-powered static site generator for developer blogs. Built for sharing coding experiences and insights.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## ⚠️ Important: Generated Files

**Do NOT edit `index.html` directly** - it's automatically generated from templates.

- Edit templates in `generator/templates/` instead
- The generator overwrites `index.html` on every build
- Run `npm run generate` to rebuild after template changes

## 📝 Adding Posts

1. Create `markdown/your-post.md`
2. Add metadata to `markdown/posts.json`
3. Run `npm run generate`

## 🎤 Speaking

Update `public/data/speaking.json` to manage speaking engagements.

## 🖼️ Images

All images are stored in `public/images/`. When adding new images:
1. Place them in `public/images/`
2. Reference them as `/images/filename.ext` in templates and config

## 🔧 Development

```bash
npm run dev     # Generate + start dev server
npm run build   # Generate + build for production  
npm run generate # Generate static files only
```

## 🚀 Deployment

Build creates static files in `dist/` that can be deployed anywhere.
