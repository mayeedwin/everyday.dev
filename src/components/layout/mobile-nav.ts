import type { UIElements } from '../../types';

/**
 * Mobile navigation component
 */
export class MobileNav {
  private elements: UIElements;

  constructor() {
    this.elements = this.getElements();
    this.init();
  }

  private getElements(): UIElements {
    return {
      toggle: document.querySelector('.mobile-nav-toggle') as HTMLElement | null,
      sidebar: document.querySelector('.profile-sidebar') as HTMLElement | null,
      overlay: document.querySelector('.sidebar-overlay') as HTMLElement | null,
      closeBtn: document.querySelector('.sidebar-close-btn') as HTMLElement | null
    };
  }

  private init(): void {
    // Ensure sidebar starts hidden
    const { sidebar, overlay } = this.elements;
    if (sidebar && overlay) {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    }
    this.bindEvents();
  }

  private bindEvents(): void {
    const { toggle, sidebar, overlay, closeBtn } = this.elements;
    
    if (!toggle || !sidebar || !overlay) return;

    // Toggle button click
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Overlay click to close
    overlay.addEventListener('click', () => this.close());

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('show')) {
        this.close();
      }
    });
  }

  public toggle(): void {
    const { sidebar } = this.elements;
    if (!sidebar) return;
    
    const isVisible = sidebar.classList.contains('show');
    
    if (isVisible) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.add('show');
    overlay.classList.add('show');
    toggle.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  public close(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    toggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}