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
      toggle: document.querySelector('.mobile-nav-toggle'),
      sidebar: document.querySelector('.profile-sidebar'),
      overlay: document.querySelector('.sidebar-overlay')
    };
  }

  private init(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    const { toggle, sidebar, overlay } = this.elements;
    
    if (!toggle || !sidebar || !overlay) return;

    // Toggle button click
    toggle.addEventListener('click', () => this.toggle());

    // Overlay click to close
    overlay.addEventListener('click', () => this.close());

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        this.close();
      }
    });
  }

  public toggle(): void {
    const { sidebar } = this.elements;
    if (!sidebar) return;

    if (sidebar.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.add('active');
    overlay.classList.add('active');
    toggle.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  public close(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}