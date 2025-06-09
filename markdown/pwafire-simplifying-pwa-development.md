# Quick intro

I created **PWAFire** - a lightweight library that provides clean, simple APIs for common PWA features.

## The Problem with Native PWA APIs

Working with native browser APIs for PWA features often means:

- **Verbose boilerplate code** for simple tasks
- **Inconsistent browser support** and quirks
- **Complex fallback logic** for unsupported features
- **Repetitive feature detection** across projects

PWAFire wraps these complex APIs into simple, consistent methods:

```javascript
import { webShare } from "pwafire/web-share";
import { copyText } from "pwafire/clipboard";

// e.g share stuff through native os share dialog
await webShare({
  title: document.title,
  url: window.location.href
});

// Or just copy to clipboard
await copyText(window.location.href);
```

Automatically handles:

- **Feature detection** - checks if Web Share is supported
- **Cross-browser compatibility** - works on all modern browsers
- **Error handling** - provides consistent error responses

**Ready to simplify your PWA development?** Check out [docs.pwafire.org](https://docs.pwafire.org) and start building better web experiences today.
