interface RouteData {
  title: string;
  content: string;
  url: string;
}

class Router {
  private cache = new Map<string, RouteData>();
  private currentPath = "";
  private isLoading = false;

  constructor() {
    this.init();
  }

  private init() {
    // Handle browser back/forward
    window.addEventListener("popstate", this.handlePopState.bind(this));

    // Intercept link clicks
    document.addEventListener("click", this.handleClick.bind(this));

    // Handle initial page load
    this.currentPath = window.location.pathname;
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (!link || !this.isInternalLink(link)) return;

    e.preventDefault();
    this.navigateTo(link.href);
  };

  private isInternalLink(link: HTMLAnchorElement): boolean {
    return (
      link.hostname === window.location.hostname &&
      !link.hasAttribute("target") &&
      !link.href.includes("mailto:") &&
      !link.href.includes("tel:")
    );
  }

  private handlePopState = () => {
    const path = window.location.pathname;
    this.loadPage(path, false);
  };

  async navigateTo(url: string) {
    const path = new URL(url).pathname;

    if (path === this.currentPath) return;

    await this.loadPage(path, true);
  }

  private async loadPage(path: string, pushState: boolean = true) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      let routeData = this.cache.get(path);

      if (!routeData) {
        routeData = await this.fetchPage(path);
        this.cache.set(path, routeData);
      }

      this.updatePage(routeData, pushState);
      this.currentPath = path;
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to traditional navigation
      window.location.href = path;
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  private async fetchPage(path: string): Promise<RouteData> {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("title")?.textContent || "";
    const contentArea = doc.querySelector(".content-area");

    if (!contentArea) {
      throw new Error("Content area not found");
    }

    return {
      title,
      content: contentArea.innerHTML,
      url: path
    };
  }

  private updatePage(routeData: RouteData, pushState: boolean) {
    // Update content area
    const contentArea = document.querySelector(".content-area");
    if (contentArea) {
      contentArea.innerHTML = routeData.content;
    }

    // Update document title
    document.title = routeData.title;

    // Update URL
    if (pushState) {
      history.pushState(
        { path: routeData.url },
        routeData.title,
        routeData.url
      );
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-initialize any JavaScript for the new content
    this.initializePageScripts();
  }

  private initializePageScripts() {
    // Re-add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((block) => {
      // Remove existing copy button if any
      const existingButton = block.querySelector(".copy-button");
      if (existingButton) {
        existingButton.remove();
      }

      const button = document.createElement("button");
      button.className = "copy-button";
      button.textContent = "Copy";
      button.addEventListener("click", () => {
        const code = block.querySelector("code");
        const text = code ? code.textContent : block.textContent;
        navigator.clipboard.writeText(text || "").then(() => {
          button.textContent = "Copied!";
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("copied");
          }, 2000);
        });
      });
      block.style.position = "relative";
      block.appendChild(button);
    });
  }

  private showLoading() {
    const contentArea = document.querySelector(".content-area") as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "0.7";
      contentArea.style.pointerEvents = "none";
      contentArea.style.cursor = "wait";
    }

    // Add loading class for additional styling if needed
    document.body.classList.add("router-loading");
  }

  private hideLoading() {
    const contentArea = document.querySelector(".content-area") as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "1";
      contentArea.style.pointerEvents = "auto";
      contentArea.style.cursor = "auto";
    }

    document.body.classList.remove("router-loading");
  }

  // Preload page on hover
  preloadPage(path: string) {
    if (!this.cache.has(path) && !this.isLoading) {
      this.fetchPage(path)
        .then((routeData) => {
          this.cache.set(path, routeData);
        })
        .catch(() => {
          // Silently fail preloading
        });
    }
  }
}

// Export router instance
export const router = new Router();

// Add preloading on hover
document.addEventListener(
  "mouseenter",
  (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    
    const link = target.closest("a");

    if (link && link.hostname === window.location.hostname) {
      const path = new URL(link.href).pathname;
      router.preloadPage(path);
    }
  },
  true
);
