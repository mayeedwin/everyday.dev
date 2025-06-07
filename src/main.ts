import "./styles/main.css";
import "./router";
import "./utils/ui";
import { Header } from "./components/layout/header";
import { MobileNav } from "./components/layout/mobile-nav";

// Initialize layout components
document.addEventListener('DOMContentLoaded', () => {
  Header.init();
  new MobileNav();
});
