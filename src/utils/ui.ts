import type { UIElements } from "@/types";

export class UIManager {
  private elements: UIElements;

  constructor() {
    this.elements = this._getUIElements();
    this._init();
  }

  private _getUIElements(): UIElements {
    return {
      toggle: document.querySelector(".mobile-nav-toggle"),
      sidebar: document.querySelector(".profile-sidebar"),
      overlay: document.querySelector(".sidebar-overlay")
    };
  }

  private _init() {
    this._initSidebarToggle();
    this._initCopyButtons();
    this._initPostCardNavigation();
  }

  private _initSidebarToggle() {
    const { toggle, sidebar, overlay } = this.elements;

    if (!toggle || !sidebar || !overlay) return;

    toggle.addEventListener("click", () => {
      this.toggleSidebar();
    });

    overlay.addEventListener("click", () => {
      this.closeSidebar();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("active")) {
        this.closeSidebar();
      }
    });
  }

  public toggleSidebar() {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    const isActive = sidebar.classList.contains("active");

    if (isActive) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  public openSidebar() {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.add("active");
    overlay.classList.add("active");
    toggle.classList.add("active");

    document.body.style.overflow = "hidden";
  }

  public closeSidebar() {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    toggle.classList.remove("active");

    document.body.style.overflow = "";
  }

  private _initCopyButtons() {
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((block) => {
      if (block.querySelector(".copy-button")) return;

      this._addCopyButton(block as HTMLElement);
    });
  }

  private _addCopyButton(block: HTMLElement) {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");

    button.addEventListener("click", async () => {
      await this._copyCodeToClipboard(block, button);
    });

    block.style.position = "relative";
    block.appendChild(button);
  }

  private async _copyCodeToClipboard(
    block: HTMLElement,
    button: HTMLElement
  ): Promise<void> {
    try {
      const code = block.querySelector("code");
      const text = code ? code.textContent : block.textContent;

      if (text) {
        await navigator.clipboard.writeText(text);
        this._showCopySuccess(button);
      }
    } catch (error) {
      console.warn("Failed to copy to clipboard:", error);
      this._showCopyError(button);
    }
  }

  private _showCopySuccess(button: HTMLElement) {
    const originalText = button.textContent;
    button.textContent = "Copied!";
    button.classList.add("copied");

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("copied");
    }, 2000);
  }

  private _showCopyError(button: HTMLElement) {
    const originalText = button.textContent;
    button.textContent = "Failed";
    button.classList.add("error");

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("error");
    }, 2000);
  }

  private _initPostCardNavigation() {
    const postCards = document.querySelectorAll(".post-card");

    postCards.forEach((card) => {
      if (card.hasAttribute("data-nav-initialized")) return;

      this._addPostCardNavigation(card as HTMLElement);
    });
  }

  private _addPostCardNavigation(card: HTMLElement) {
    const primaryLink = card.querySelector(
      ".post-title a"
    ) as HTMLAnchorElement;

    if (!primaryLink) return;

    const href = primaryLink.href;

    card.style.cursor = "pointer";

    const handleCardClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a, button")
      ) {
        return;
      }

      window.location.href = href;
    };

    card.addEventListener("click", handleCardClick);

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Read post: ${primaryLink.textContent}`);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = href;
      }
    };

    card.addEventListener("keydown", handleKeyDown);

    card.setAttribute("data-nav-initialized", "true");
  }

  public reinit() {
    this.elements = this._getUIElements();
    this._initCopyButtons();
    this._initPostCardNavigation();
  }
}

export class DateFormatter {
  static format(
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };

    return dateObj.toLocaleDateString("en-US", {
      ...defaultOptions,
      ...options
    });
  }

  static sortByDate<T extends Record<string, any>>(
    items: T[],
    dateProperty: keyof T,
    ascending: boolean = false
  ): T[] {
    return items.sort((a, b) => {
      const dateA = new Date(a[dateProperty]).getTime();
      const dateB = new Date(b[dateProperty]).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
}

export class DOMUtils {
  static updateElement(selector: string, content: string): boolean {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = content;
      return true;
    }
    return false;
  }

  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Record<string, string> = {},
    content: string = ""
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    if (content) {
      element.innerHTML = content;
    }

    return element;
  }

  static addEventListenerWithCleanup(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    target.addEventListener(type, listener, options);

    return () => {
      target.removeEventListener(type, listener, options);
    };
  }
}

export class ErrorHandler {
  static showError(
    container: HTMLElement,
    message: string,
    retryCallback?: () => void
  ) {
    const errorHtml = `
      <div class="error-message">
        <p>${message}</p>
        ${
          retryCallback
            ? '<button onclick="this.parentElement.retryCallback()" class="retry-button">Retry</button>'
            : ""
        }
      </div>
    `;

    container.innerHTML = errorHtml;

    if (retryCallback) {
      const errorElement = container.querySelector(".error-message") as any;
      errorElement.retryCallback = retryCallback;
    }
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorCallback?: (error: Error) => void
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Operation failed:", err);

      if (errorCallback) {
        errorCallback(err);
      }

      return null;
    }
  }
}

let uiManager: UIManager;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    uiManager = new UIManager();
  });
} else {
  uiManager = new UIManager();
}

export { uiManager };
