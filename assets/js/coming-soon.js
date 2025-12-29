// /assets/js/coming-soon.js
// Renders a reusable "Coming Soon" layout driven by a per-page config object.

(function(){
  const defaultConfig = {
    pageName: "This page",
    summary: "We're building out this corner of the Dreaming Tower. Check back soon for the finished entry.",
    metaDescription: "A new Cyber Lorekeeper page is under construction.",
    lead: "Work is underway. Here’s what we’re polishing before it opens to visitors.",
    promises: [
      { text: "A polished layout that matches the rest of the Lorekeeper's archives." },
      { text: "Lore-first storytelling with a clear bridge to real-world takeaways." },
      { text: "A way to subscribe so you know the moment it unlocks." },
    ],
    highlights: [
      { title: "Progress track", body: "A single template shared by every unfinished page so the experience stays consistent." },
      { title: "Reader-first CTA", body: "Clear ways to subscribe, explore live sections, or send feedback while we build." },
      { title: "World + real-world", body: "Room for both in-universe snippets and the practical security parallels behind them." },
    ],
    statuses: [
      { label: "Status", value: "In Progress" },
      { label: "ETA", value: "Revealing soon" },
      { label: "Focus", value: "Story polish" },
    ],
    primaryCta: { label: "Notify me", href: "/#email" },
    secondaryCta: { label: "Return home", href: "/" },
  };

  const config = normalizeConfig(window.COMING_SOON_PAGE || {});

  document.addEventListener("DOMContentLoaded", () => {
    render(config);
    hydratePartials();
  });

  function normalizeConfig(raw){
    const merged = { ...defaultConfig, ...raw };

    merged.promises = Array.isArray(raw.promises) && raw.promises.length
      ? raw.promises
      : defaultConfig.promises;

    merged.highlights = Array.isArray(raw.highlights) && raw.highlights.length
      ? raw.highlights
      : defaultConfig.highlights;

    merged.statuses = Array.isArray(raw.statuses) && raw.statuses.length
      ? raw.statuses
      : defaultConfig.statuses;

    merged.primaryCta = { ...defaultConfig.primaryCta, ...(raw.primaryCta || {}) };
    merged.secondaryCta = { ...defaultConfig.secondaryCta, ...(raw.secondaryCta || {}) };

    merged.metaDescription = raw.metaDescription || raw.summary || defaultConfig.metaDescription;

    return merged;
  }

  function render(cfg){
    const title = `${cfg.pageName} | Coming Soon | The Cyber Lorekeeper`;
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', cfg.metaDescription);

    document.querySelectorAll('[data-page-name]').forEach(el => {
      el.textContent = cfg.pageName;
    });

    setText('[data-summary]', cfg.summary);
    setText('[data-lede]', cfg.lead);

    renderPromises(cfg.promises);
    renderHighlights(cfg.highlights);
    renderStatuses(cfg.statuses);
    renderCtas(cfg.primaryCta, cfg.secondaryCta);
  }

  function setText(selector, value){
    const el = document.querySelector(selector);
    if (el && value) el.textContent = value;
  }

  function renderPromises(items){
    const list = document.getElementById('promiseList');
    if (!list) return;
    list.innerHTML = '';

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-3 rounded-lg border border-rift/40 bg-abyss/40 p-3 text-sm text-stardust/85 shadow-card';

      const icon = document.createElement('span');
      icon.className = 'coming-check mt-0.5';
      icon.setAttribute('aria-hidden','true');
      icon.textContent = '✓';

      const copy = document.createElement('p');
      copy.textContent = item.text || '';
      copy.style.margin = '0';

      li.appendChild(icon);
      li.appendChild(copy);
      list.appendChild(li);
    });
  }

  function renderHighlights(items){
    const grid = document.getElementById('comingHighlights');
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'coming-card p-5 h-full';

      const title = document.createElement('h3');
      title.className = 'coming-highlight-title';
      title.textContent = item.title || '';

      const body = document.createElement('p');
      body.className = 'coming-highlight-body';
      body.textContent = item.body || '';

      card.appendChild(title);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderStatuses(items){
    const wrap = document.getElementById('comingStatus');
    if (!wrap) return;
    wrap.innerHTML = '';

    items.forEach(item => {
      const tile = document.createElement('div');
      tile.className = 'tile';

      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = item.label || '';

      const value = document.createElement('div');
      value.className = 'value';
      value.textContent = item.value || '';

      tile.appendChild(label);
      tile.appendChild(value);
      wrap.appendChild(tile);
    });
  }

  function renderCtas(primary, secondary){
    const primaryBtn = document.querySelector('[data-primary-cta]');
    const secondaryBtn = document.querySelector('[data-secondary-cta]');

    if (primaryBtn){
      primaryBtn.textContent = primary.label;
      primaryBtn.setAttribute('href', primary.href);
    }

    if (secondaryBtn){
      secondaryBtn.textContent = secondary.label;
      secondaryBtn.setAttribute('href', secondary.href);
    }
  }

  async function hydratePartials(){
    await loadPartial('site-header', '/partials/header.html');
    initHeaderNav();

    await loadPartial('site-footer', '/partials/footer.html');
    initFooterYear();
  }

  async function loadPartial(targetId, url) {
    const el = document.getElementById(targetId);
    if (!el) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) return;
      el.innerHTML = await res.text();
    } catch (err) {
      console.warn(`Failed to load partial: ${url}`, err);
    }
  }

  function initHeaderNav() {
    const navToggle = document.getElementById("navToggle");
    const mobileNavPanel = document.getElementById("mobileNavPanel");

    if (!navToggle || !mobileNavPanel) return;

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNavPanel.classList.toggle("hidden", isOpen);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNavPanel.classList.add("hidden");
      }
    });
  }

  function initFooterYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }
})();
