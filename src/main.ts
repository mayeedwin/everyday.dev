import "./styles/main.css";
import "./router";
import "./utils/ui";
import { Header } from "./components/layout/Header";
import { MobileNav } from "./components/layout/MobileNav";

// Initialize layout components
document.addEventListener('DOMContentLoaded', () => {
  Header.init();
  new MobileNav();
});
