export class Header {
  static ACTIVE_CLASS = "active";

  static setActiveNavLink(pathname: string) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove(this.ACTIVE_CLASS);
    });

    const matchingLinks = document.querySelectorAll(
      `a[href="${pathname}"], a[href="${pathname}/"]`
    );
    matchingLinks.forEach((link) => {
      link.classList.add(this.ACTIVE_CLASS);
    });
  }

  static init() {
    this.setActiveNavLink(window.location.pathname);

    window.addEventListener("popstate", () => {
      this.setActiveNavLink(window.location.pathname);
    });
  }
}
