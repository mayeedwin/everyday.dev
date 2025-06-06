# EverydayDev: Quick Site Overview

Welcome to my coding journal! This is where I document daily discoveries, late-night breakthroughs, and lessons that hit different. Built for quick daily reads with good vibes only.

## What Powers This Site

⚡ **Lightning-fast** - Vite + TypeScript + Static generation
🎨 **Clean design** - Responsive, readable, smooth
🔥 **Code highlighting** - Beautiful syntax colors with copy buttons

## Code Examples

### JavaScript

```javascript
// Modern async/await pattern
const fetchData = async (id) => {
  try {
    const response = await fetch(`/api/data/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
```

### CSS

```css
/* Custom properties for theming */
:root {
  --primary: #2563eb;
  --text: #1f2937;
  --bg: #ffffff;
}

.card {
  background: var(--bg);
  color: var(--text);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Python

```python
# Quick data processing
from dataclasses import dataclass
from typing import List

@dataclass
class Post:
    title: str
    content: str
    tags: List[str]

def filter_posts(posts: List[Post], tag: str) -> List[Post]:
    return [post for post in posts if tag in post.tags]
```

## Quick Features

- ✅ **Copy code** with one click
- ✅ **Sticky navigation** shows current article
- ✅ **Fast loading** - optimized for speed
- ✅ **Mobile friendly** - works everywhere

## Getting Started

```bash
# Clone and run
git clone your-repo
npm install
npm run dev
```

That's it! Ready to document your coding journey.

---

_Built for developers who value speed, simplicity, and good vibes._
