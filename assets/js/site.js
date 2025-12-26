// /assets/js/site.js
(function ensureFavicons() {
  const defs = [
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/favicon-32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/images/favicon-16.png" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/images/apple-touch-icon.png" },
    { rel: "shortcut icon", href: "/images/favicon.ico" },
  ];

  const head = document.head;
  defs.forEach(d => {
    // treat rel+href as identity
    const sel = `link[rel="${d.rel}"][href="${d.href}"]`;
    if (head.querySelector(sel)) return;

    const link = document.createElement("link");
    Object.entries(d).forEach(([k, v]) => link.setAttribute(k, v));
    head.appendChild(link);
  });
})();
