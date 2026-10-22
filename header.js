/*! Fixs Arts Header – header.js
 *  Pakai: <script src="https://fixsarts.github.io/header/header.js"></script>
 *  Override setting (opsional) SEBELUM script ini: window.FixsHeaderConfig = { ... }
 *  header.css otomatis dimuat dari folder yang sama (kecuali sudah dipasang lewat <link rel="stylesheet">).
 */
(function () {
  "use strict";
  var script = document.currentScript;

  var defaults = {
    logoUrl: "https://fixsarts.github.io/footer/assets/Icon%20Fixs%20Arts.gif",
    brand: "Fixs Arts",
    homeUrl: "/",
    cartUrl: "#cart",
    cartCount: 0,
    showSearch: true,
    showCart: true,
    searchPlaceholder: "Cari layanan…",
    theme: "dark",              // "dark" | "light"
    hideOnScrollDown: false,    // true = sembunyi saat scroll turun, muncul saat scroll naik
    mount: "#fa-header-root",   // selector; kalau tidak ada, header dibuat di paling atas <body>
    onSearch: null,             // function (query) {}
    links: [
      { label: "Home", href: "#home" },
      { label: "Layanan", href: "#layanan" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Tentang", href: "#tentang" },
      { label: "Tools", children: [
        { label: "Generator Invoice", href: "#" },
        { label: "Image to Frame", href: "#" },
        { label: "Nota", href: "#" }
      ]}
    ]
  };
  var config = Object.assign({}, defaults, window.FixsHeaderConfig || {});

  // Muat CSS otomatis kalau belum ada
  var hasCss = [].some.call(document.querySelectorAll('link[rel="stylesheet"]'), function (l) { return /header(\.min)?\.css/.test(l.href); });
  if (!hasCss && script && script.src) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = script.src.replace(/header(\.min)?\.js.*$/, "header.css");
    document.head.appendChild(link);
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var caret = '<svg class="fa-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var searchForm = '<form class="fa-search" role="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" name="q" placeholder="' + esc(config.searchPlaceholder) + '" aria-label="Cari"></form>';
  var cartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>';

  function build() {
    var items = config.links.map(function (l, i) {
      if (!l.children) return '<li><a class="fa-link" href="' + esc(l.href) + '">' + esc(l.label) + "</a></li>";
      return '<li class="fa-item"><button class="fa-toggle" type="button" aria-expanded="false" aria-controls="fa-m' + i + '">' + esc(l.label) + caret +
        '</button><ul class="fa-menu" id="fa-m' + i + '">' +
        l.children.map(function (c) { return '<li><a href="' + esc(c.href) + '">' + esc(c.label) + "</a></li>"; }).join("") + "</ul></li>";
    }).join("");

    var root = document.querySelector(config.mount);
    if (!root) { root = document.createElement("div"); document.body.insertBefore(root, document.body.firstChild); }

    root.innerHTML = '<header class="fa-header" data-theme="' + esc(config.theme) + '"><div class="fa-bar">' +
      '<a class="fa-brand" href="' + esc(config.homeUrl) + '"><img class="fa-logo" src="' + esc(config.logoUrl) + '" alt="' + esc(config.brand) + '"></a>' +
      '<nav aria-label="Utama"><ul class="fa-nav">' + (config.showSearch ? '<li class="fa-msearch">' + searchForm + "</li>" : "") + items + "</ul></nav>" +
      '<div class="fa-right">' + (config.showSearch ? searchForm : "") +
      (config.showCart ? '<a class="fa-cart" href="' + esc(config.cartUrl) + '" aria-label="Keranjang">' + cartIcon + '<span class="fa-badge">' + config.cartCount + "</span></a>" : "") +
      '<button class="fa-burger" type="button" aria-label="Buka menu" aria-expanded="false"><span></span><span></span><span></span></button></div></div></header>';

    var header = root.querySelector(".fa-header");
    var burger = header.querySelector(".fa-burger");
    var badge = header.querySelector(".fa-badge");
    var dropdowns = [].slice.call(header.querySelectorAll(".fa-item"));
    var topLinks = [].slice.call(header.querySelectorAll(".fa-nav > li > .fa-link"));

    // Link aktif: cocokkan dengan URL sekarang, fallback ke link pertama kalau semuanya anchor (#)
    var here = location.href.replace(/\/$/, "");
    var active = topLinks.filter(function (a) { return a.href.replace(/\/$/, "") === here; })[0];
    if (!active && topLinks[0] && /^#/.test(topLinks[0].getAttribute("href"))) active = topLinks[0];
    if (active) active.setAttribute("aria-current", "page");

    function closeAll(except) {
      dropdowns.forEach(function (d) {
        if (d === except) return;
        d.classList.remove("is-open");
        d.querySelector(".fa-toggle").setAttribute("aria-expanded", "false");
      });
    }
    function setNav(o) { header.classList.toggle("nav-open", o); burger.setAttribute("aria-expanded", o); }

    dropdowns.forEach(function (d) {
      var btn = d.querySelector(".fa-toggle");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !d.classList.contains("is-open");
        closeAll(d); d.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open);
      });
    });
    burger.addEventListener("click", function (e) { e.stopPropagation(); setNav(!header.classList.contains("nav-open")); });
    document.addEventListener("click", function (e) { if (!header.contains(e.target)) { closeAll(); setNav(false); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); setNav(false); } });
    header.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (a.classList.contains("fa-link")) {
          topLinks.forEach(function (x) { x.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "page");
        }
        closeAll(); setNav(false);
      });
    });

    header.querySelectorAll(".fa-search").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = f.q.value.trim();
        if (typeof config.onSearch === "function") config.onSearch(q);
        document.dispatchEvent(new CustomEvent("fixsarts:search", { detail: { q: q } }));
      });
    });

    var api = window.FixsHeader = {
      config: config,
      cart: config.cartCount,
      setCart: function (n) {
        api.cart = n;
        if (!badge) return;
        badge.textContent = n;
        badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
      }
    };

    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 24);
      if (config.hideOnScrollDown && !header.classList.contains("nav-open")) header.classList.toggle("is-hidden", y > lastY && y > 160);
      lastY = y; ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();
  }

  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
