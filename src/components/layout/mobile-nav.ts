import type { UIElements } from "../../types";

export class MobileNav {
  private elements: UIElements;

  constructor() {
    this.elements = this._getElements();
    this._init();
  }

  private _getElements(): UIElements {
    return {
      toggle: document.querySelector(
        ".mobile-nav-toggle"
      ) as HTMLElement | null,
      sidebar: document.querySelector(".profile-sidebar") as HTMLElement | null,
      overlay: document.querySelector(".sidebar-overlay") as HTMLElement | null,
      closeBtn: document.querySelector(
        ".sidebar-close-btn"
      ) as HTMLElement | null
    };
  }

  private _init() {
    const { sidebar, overlay } = this.elements;
    if (sidebar && overlay) {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    }
    this._bindEvents();
  }

  private _bindEvents() {
    const { toggle, sidebar, overlay, closeBtn } = this.elements;

    if (!toggle || !sidebar || !overlay) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle();
    });

    overlay.addEventListener("click", () => this.close());

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("show")) {
        this.close();
      }
    });
  }

  public toggle() {
    const { sidebar } = this.elements;
    if (!sidebar) return;

    const isVisible = sidebar.classList.contains("show");

    if (isVisible) {
      this.close();
    } else {
      this.open();
    }
  }

  public open() {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.add("show");
    overlay.classList.add("show");
    toggle.classList.add("active");

    document.body.style.overflow = "hidden";
  }

  public close() {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.remove("show");
    overlay.classList.remove("show");
    toggle.classList.remove("active");

    document.body.style.overflow = "";
  }
}
