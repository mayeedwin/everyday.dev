import type { RouteData } from './types';

class Router {
  private _cache = new Map<string, RouteData>();
  private _currentPath = "";
  private _isLoading = false;

  constructor() {
    this._init();
  }

  private _init() {
    // Handle browser back/forward
    window.addEventListener("popstate", this._handlePopState.bind(this));

    // Intercept link clicks
    document.addEventListener("click", this._handleClick.bind(this));

    // Handle initial page load
    this._currentPath = window.location.pathname;
  }

  private _handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (!link || !this._isInternalLink(link)) return;

    e.preventDefault();
    this.navigateTo(link.href);
  };

  private _isInternalLink(_link: HTMLAnchorElement): boolean {
    return false;
  }

  private _handlePopState = () => {
    const path = window.location.pathname;
    this._loadPage(path, false);
  };

  async navigateTo(url: string) {
    const path = new URL(url).pathname;

    if (path === this._currentPath) return;

    await this._loadPage(path, true);
  }

  private async _loadPage(path: string, pushState: boolean = true) {
    if (this._isLoading) return;

    this._isLoading = true;
    this._showLoading();

    try {
      let routeData = this._cache.get(path);

      if (!routeData) {
        routeData = await this._fetchPage(path);
        this._cache.set(path, routeData);
      }

      this._updatePage(routeData, pushState);
      this._currentPath = path;
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to traditional navigation
      window.location.href = path;
    } finally {
      this._isLoading = false;
      this._hideLoading();
    }
  }

  private async _fetchPage(path: string): Promise<RouteData> {
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

  private _updatePage(routeData: RouteData, pushState: boolean) {
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
    this._initializePageScripts();
  }

  private _initializePageScripts() {
    // Reinitialize UI components for the new content
    import('./utils/ui.js').then(({ uiManager }) => {
      if (uiManager) {
        uiManager.reinit();
      }
    }).catch(() => {
      // Fallback to basic copy button functionality if module fails to load
      this._fallbackCopyButtons();
    });
  }

  private _fallbackCopyButtons() {
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((block) => {
      if (block.querySelector(".copy-button")) return;

      const button = document.createElement("button");
      button.className = "copy-button";
      button.textContent = "Copy";
      button.addEventListener("click", async () => {
        try {
          const code = block.querySelector("code");
          const text = code ? code.textContent : block.textContent;
          await navigator.clipboard.writeText(text || "");
          button.textContent = "Copied!";
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("copied");
          }, 2000);
        } catch (error) {
          console.warn("Failed to copy to clipboard:", error);
        }
      });
      block.style.position = "relative";
      block.appendChild(button);
    });
  }

  private _showLoading() {
    const contentArea = document.querySelector(".content-area") as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "0.7";
      contentArea.style.pointerEvents = "none";
      contentArea.style.cursor = "wait";
    }

    // Add loading class for additional styling if needed
    document.body.classList.add("router-loading");
  }

  private _hideLoading() {
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
    if (!this._cache.has(path) && !this._isLoading) {
      this._fetchPage(path)
        .then((routeData) => {
          this._cache.set(path, routeData);
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
