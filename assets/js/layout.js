// /assets/js/layout.js
// Loads shared header/footer partials and wires basic layout interactions.

async function loadPartial(targetId, url) {
  const mount = document.getElementById(targetId);
  if (!mount) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      console.warn(`Failed to load partial: ${url}`);
      return;
    }
    mount.innerHTML = await res.text();
  } catch (err) {
    console.warn(`Error loading partial ${url}`, err);
  }
}

function wireMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const mobileNavPanel = document.getElementById("mobileNavPanel");

  if (!navToggle || !mobileNavPanel) return;

  const closePanel = () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobileNavPanel.classList.add("hidden");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileNavPanel.classList.toggle("hidden", isOpen);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });
}

function stampCurrentYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("#year, [data-current-year]").forEach((node) => {
    node.textContent = year;
  });
}

async function bootLayout() {
  await loadPartial("site-header", "/partials/header.html");
  await loadPartial("site-footer", "/partials/footer.html");

  wireMobileNav();
  stampCurrentYear();
}

// Expose for optional manual control; auto-run on DOM ready.
window.lorekeeperLayout = { bootLayout };

document.addEventListener("DOMContentLoaded", () => {
  bootLayout();
});
