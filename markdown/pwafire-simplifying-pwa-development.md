# PWAFire: Simplifying PWA Development with Clean APIs

Progressive Web Apps (PWAs) are powerful, but the APIs can be verbose and inconsistent across browsers. That's why I created **PWAFire** - a lightweight library that provides clean, simple APIs for common PWA features.

## The Problem with Native PWA APIs

Working with native browser APIs for PWA features often means:

- **Verbose boilerplate code** for simple tasks
- **Inconsistent browser support** and quirks
- **Complex fallback logic** for unsupported features
- **Repetitive feature detection** across projects

```javascript
// Native Web Share API - verbose and needs fallbacks
if (navigator.share) {
  try {
    await navigator.share({
      title: document.title,
      url: window.location.href
    });
  } catch (err) {
    // Handle error or fallback to clipboard
    await navigator.clipboard.writeText(window.location.href);
  }
} else {
  // Fallback implementation
  await navigator.clipboard.writeText(window.location.href);
}
```

## PWAFire's Solution

PWAFire wraps these complex APIs into simple, consistent methods:

```javascript
import { webShare } from "pwafire/web-share";
import { copyText } from "pwafire/clipboard";

// Clean, simple sharing with automatic fallbacks
await webShare({
  title: document.title,
  url: window.location.href
});

// Or just copy to clipboard
await copyText(window.location.href);
```

## Real-World Usage: This Blog's Floating Action Button

The floating action button on this very blog uses PWAFire. Here's the actual implementation:

```javascript
import { copyText } from "pwafire/clipboard";
import { webShare } from "pwafire/web-share";

// Copy link functionality
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    await copyText(window.location.href);
    // Show success feedback
    copyButton.classList.add("copied");
    copyButton.textContent = "Copied!";
  });
}

// Share functionality with automatic fallbacks
if (shareButton) {
  shareButton.addEventListener("click", async () => {
    await webShare({
      title: document.title,
      url: window.location.href
    });
  });
}
```

PWAFire automatically handles:

- **Feature detection** - checks if Web Share is supported
- **Graceful fallbacks** - falls back to clipboard if sharing isn't available
- **Cross-browser compatibility** - works on all modern browsers
- **Error handling** - provides consistent error responses

## Key Features

### 📋 Clipboard API

```javascript
import { copyText } from "pwafire/clipboard";

await copyText("Hello, World!");
```

### 📤 Web Share API

```javascript
import { webShare } from "pwafire/web-share";

await webShare({
  title: "Check this out!",
  text: "Amazing content",
  url: "https://example.com"
});
```

### 🔔 Push Notifications

```javascript
import { pushNotification } from "pwafire/notification";

await pushNotification({
  title: "New Message",
  body: "You have a new notification"
});
```

### 📱 App Installation

```javascript
import { installApp } from "pwafire/install";

await installApp();
```

### 🔍 Feature Detection

Sometimes you need to check if a feature is supported before using it. PWAFire provides simple detection methods:

```javascript
import { isSupported } from "pwafire/detect";

// Check if Web Share is supported
if (await isSupported("webShare")) {
  // Show share button
  shareButton.style.display = "block";
} else {
  // Show alternative copy button
  copyButton.style.display = "block";
}

// Check multiple features at once
const features = await isSupported(["webShare", "clipboard", "notification"]);
console.log(features); // { webShare: true, clipboard: true, notification: false }
```

**Without PWAFire** - Complex feature detection:

```javascript
// Manual feature detection - verbose and error-prone
function checkWebShareSupport() {
  return 'share' in navigator && 
         typeof navigator.share === 'function';
}

function checkClipboardSupport() {
  return 'clipboard' in navigator && 
         'writeText' in navigator.clipboard;
}

function checkNotificationSupport() {
  return 'Notification' in window && 
         Notification.permission !== 'denied';
}

// Use the checks
if (checkWebShareSupport()) {
  // Show share options
} else if (checkClipboardSupport()) {
  // Show copy option
} else {
  // Show fallback
}
```

**With PWAFire** - Simple and reliable:

```javascript
import { isSupported } from "pwafire/detect";

// One method for all feature detection
const canShare = await isSupported("webShare");
const canCopy = await isSupported("clipboard");
const canNotify = await isSupported("notification");

// Build UI based on capabilities
buildShareUI({ canShare, canCopy, canNotify });
```

## Why PWAFire?

**🚀 Developer Experience First**

- Clean, intuitive APIs
- Consistent method signatures
- Automatic error handling

**🌐 Cross-Platform**

- Works on all modern browsers
- Mobile and desktop support
- Automatic feature detection

**📦 Lightweight**

- Tree-shakable modules
- Only import what you need
- No dependencies

**🔧 Production Ready**

- Used in real applications
- Comprehensive error handling
- TypeScript support

## Getting Started

```bash
npm install pwafire
```

```javascript
// Import only what you need
import { copyText } from "pwafire/clipboard";
import { webShare } from "pwafire/web-share";

// Use anywhere in your app
document.getElementById("share").addEventListener("click", async () => {
  await webShare({
    title: "My App",
    url: window.location.href
  });
});
```

## The Future of PWA Development

PWAs are becoming the standard for modern web applications. Tools like PWAFire make it easier for developers to adopt PWA features without getting bogged down in API complexity.

Whether you're building a blog (like this one), an e-commerce site, or a complex web application, PWAFire provides the building blocks you need to create engaging, app-like experiences on the web.

**Ready to simplify your PWA development?** Check out [PWAFire on GitHub](https://github.com/pwafire/pwafire) and start building better web experiences today.
