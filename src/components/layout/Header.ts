/**
 * Header component for navigation
 */
export class Header {
  private static readonly ACTIVE_CLASS = 'active';

  /**
   * Set active navigation link
   */
  static setActiveNavLink(pathname: string): void {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove(Header.ACTIVE_CLASS);
    });

    // Add active class to matching nav links
    const matchingLinks = document.querySelectorAll(`a[href="${pathname}"], a[href="${pathname}/"]`);
    matchingLinks.forEach(link => {
      link.classList.add(Header.ACTIVE_CLASS);
    });
  }

  /**
   * Initialize header functionality
   */
  static init(): void {
    // Set initial active state
    this.setActiveNavLink(window.location.pathname);

    // Update active state on navigation
    window.addEventListener('popstate', () => {
      this.setActiveNavLink(window.location.pathname);
    });
  }
}