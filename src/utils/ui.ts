/**
 * UI Utilities - Shared components and functionality
 */

import type { UIElements } from '../types';

export class UIManager {
  private elements: UIElements;

  constructor() {
    this.elements = this.getUIElements();
    this.init();
  }

  private getUIElements(): UIElements {
    return {
      toggle: document.querySelector('.mobile-nav-toggle'),
      sidebar: document.querySelector('.profile-sidebar'),
      overlay: document.querySelector('.sidebar-overlay')
    };
  }

  private init(): void {
    this.initSidebarToggle();
    this.initCopyButtons();
  }

  /**
   * Initialize mobile sidebar toggle functionality
   */
  private initSidebarToggle(): void {
    const { toggle, sidebar, overlay } = this.elements;
    
    if (!toggle || !sidebar || !overlay) return;

    // Toggle button click handler
    toggle.addEventListener('click', () => {
      this.toggleSidebar();
    });

    // Overlay click handler
    overlay.addEventListener('click', () => {
      this.closeSidebar();
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        this.closeSidebar();
      }
    });
  }

  /**
   * Toggle sidebar open/closed state
   */
  public toggleSidebar(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  /**
   * Open the sidebar
   */
  public openSidebar(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.add('active');
    overlay.classList.add('active');
    toggle.classList.add('active');
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the sidebar
   */
  public closeSidebar(): void {
    const { toggle, sidebar, overlay } = this.elements;
    if (!toggle || !sidebar || !overlay) return;

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Initialize copy buttons for code blocks
   */
  private initCopyButtons(): void {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((block) => {
      // Skip if already has copy button
      if (block.querySelector('.copy-button')) return;
      
      this.addCopyButton(block as HTMLElement);
    });
  }

  /**
   * Add copy button to a code block
   */
  private addCopyButton(block: HTMLElement): void {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    
    button.addEventListener('click', async () => {
      await this.copyCodeToClipboard(block, button);
    });
    
    block.style.position = 'relative';
    block.appendChild(button);
  }

  /**
   * Copy code content to clipboard
   */
  private async copyCodeToClipboard(block: HTMLElement, button: HTMLElement): Promise<void> {
    try {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;
      
      if (text) {
        await navigator.clipboard.writeText(text);
        this.showCopySuccess(button);
      }
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      this.showCopyError(button);
    }
  }

  /**
   * Show copy success feedback
   */
  private showCopySuccess(button: HTMLElement): void {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }

  /**
   * Show copy error feedback
   */
  private showCopyError(button: HTMLElement): void {
    const originalText = button.textContent;
    button.textContent = 'Failed';
    button.classList.add('error');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('error');
    }, 2000);
  }

  /**
   * Reinitialize UI components (useful after dynamic content changes)
   */
  public reinit(): void {
    this.elements = this.getUIElements();
    this.initCopyButtons();
  }
}

/**
 * Date formatting utilities
 */
export class DateFormatter {
  /**
   * Format date for display
   */
  static format(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  }

  /**
   * Sort array by date property
   */
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

/**
 * DOM utilities
 */
export class DOMUtils {
  /**
   * Safely query and update element content
   */
  static updateElement(selector: string, content: string): boolean {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = content;
      return true;
    }
    return false;
  }

  /**
   * Create element with attributes and content
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Record<string, string> = {},
    content: string = ''
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

  /**
   * Add event listener with optional cleanup
   */
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

/**
 * Error handling utilities
 */
export class ErrorHandler {
  /**
   * Show user-friendly error message
   */
  static showError(container: HTMLElement, message: string, retryCallback?: () => void): void {
    const errorHtml = `
      <div class="error-message">
        <p>${message}</p>
        ${retryCallback ? '<button onclick="this.parentElement.retryCallback()" class="retry-button">Retry</button>' : ''}
      </div>
    `;
    
    container.innerHTML = errorHtml;
    
    if (retryCallback) {
      const errorElement = container.querySelector('.error-message') as any;
      errorElement.retryCallback = retryCallback;
    }
  }

  /**
   * Handle async operations with error handling
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorCallback?: (error: Error) => void
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Operation failed:', err);
      
      if (errorCallback) {
        errorCallback(err);
      }
      
      return null;
    }
  }
}

// Auto-initialize UI when DOM is ready
let uiManager: UIManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
  });
} else {
  uiManager = new UIManager();
}

export { uiManager };