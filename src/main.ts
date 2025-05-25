import "./styles/main.css";

class HomePage {
  constructor() {
    this.init();
  }

  private init(): void {
    this.setupViewTransitions();
    this.setupNavigation();
    this.setupSkeletonLoading();
  }

  private setupViewTransitions(): void {
    // Check if View Transitions API is supported
    if ('startViewTransition' in document) {
      // Add view transition support for navigation
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href]') as HTMLAnchorElement;
        
        if (link && !link.href.includes('#') && link.origin === location.origin) {
          e.preventDefault();
          
          // Start view transition
          const transition = (document as any).startViewTransition(() => {
            // Navigate to new page
            window.location.href = link.href;
          });
          
          // Optional: Handle transition failures
          transition.catch((error: Error) => {
            console.warn('View transition failed:', error);
            window.location.href = link.href;
          });
        }
      });
    }
  }

  private setupSkeletonLoading(): void {
    // Add loading states to prevent layout shift
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.addEventListener('scroll', this.debounce(() => {
        // Add intersection observer for lazy loading if needed
        this.observeImages();
      }, 100) as EventListener);
    }
  }

  private observeImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait) as unknown as number;
    };
  }

  private setupNavigation(): void {
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");

    if (mobileMenu && navMenu) {
      mobileMenu.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        navMenu.classList.toggle("active");
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HomePage();
});

// Add page visibility API for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations and reduce activity when page is hidden
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
  }
});
