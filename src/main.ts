import "./styles/main.css";
import "./router";
import "./utils/ui";
import { Header } from "./components/layout/header";
import { MobileNav } from "./components/layout/mobile-nav";
import { copyText } from "pwafire/clipboard";
import { webShare } from "pwafire/web-share";
import { webShare as checkWebShare } from "pwafire/check";

document.addEventListener("DOMContentLoaded", () => {
  Header.init();
  new MobileNav();
  initFloatingActions();
});
function initFloatingActions() {
  const fabContainer = document.querySelector(".floating-actions");
  const fabTrigger = document.querySelector(".fab-trigger");
  const copyButton = document.querySelector(".copy-link");
  const shareButton = document.querySelector(".share-native");

  if (!fabContainer || !fabTrigger) return;

  fabTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    fabContainer.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!fabContainer.contains(e.target as Node)) {
      fabContainer.classList.remove("open");
    }
  });

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await copyText(window.location.href);
        copyButton.classList.add("copied");
        const span = copyButton.querySelector("span");
        const originalText = span?.textContent;
        if (span) span.textContent = "Copied!";

        setTimeout(() => {
          copyButton.classList.remove("copied");
          if (span) span.textContent = originalText ?? "";
        }, 2000);

        fabContainer.classList.remove("open");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    });
  }

  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const title = document.title;
      const url = window.location.href;
      if (checkWebShare()) {
        await webShare({
          title,
          url
        });
      } else {
        await copyText(url);
      }
    });
  }
}
