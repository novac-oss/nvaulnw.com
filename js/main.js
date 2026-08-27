/* =========================================================
   N VaulNW — main.js
   Nav, mobile menu, smooth scroll, utility
   ========================================================= */

(function () {
  "use strict";

  // -------- Topbar scroll behaviour --------
  const topbar = document.querySelector(".topbar");
  let lastY = 0;
  let ticking = false;
  const onScroll = () => {
    if (!topbar) return;
    const y = window.scrollY;
    topbar.classList.toggle("is-scrolled", y > 40);
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // -------- Mobile menu --------
  const toggle = document.querySelector(".menu-toggle");
  let overlay = document.querySelector(".mobile-nav__overlay");
  let panel = document.querySelector(".mobile-nav");

  const ensureMobileNav = () => {
    if (panel) return panel;
    const tmpl = `
      <div class="mobile-nav__overlay" data-mobile-overlay></div>
      <aside class="mobile-nav" data-mobile-panel aria-hidden="true">
        <button class="mobile-nav__close" type="button" data-mobile-close aria-label="Close menu">
          <img src="/images/icons/icon-close.svg" alt="" width="20" height="20">
        </button>
        <a href="/home/">Home</a>
        <a href="/services/">Services</a>
        <a href="/contact/">Contact Us</a>
        <a href="/contact/" class="mobile-nav__cta">Start a project</a>
      </aside>`;
    const wrap = document.createElement("div");
    wrap.innerHTML = tmpl;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    overlay = document.querySelector("[data-mobile-overlay]");
    panel = document.querySelector("[data-mobile-panel]");
    panel.querySelector("[data-mobile-close]").addEventListener("click", closeMobileNav);
    overlay.addEventListener("click", closeMobileNav);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("is-open")) closeMobileNav();
    });
    return panel;
  };

  const openMobileNav = () => {
    ensureMobileNav();
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const closeMobileNav = () => {
    if (!panel) return;
    panel.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      ensureMobileNav();
      if (panel.classList.contains("is-open")) closeMobileNav();
      else openMobileNav();
    });
  }

  // -------- Smooth scroll for in-page links --------
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    history.pushState(null, "", href);
  });

  // -------- Mark current nav link --------
  const path = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".topnav a, .mobile-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (href === path || (href === "/home/" && (path === "/" || path === "/home")) || (href !== "/" && path.startsWith(href))) {
      a.setAttribute("aria-current", "page");
    }
  });

  // -------- Reveal-on-scroll registration --------
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger, .mascot-pop");
  if (reduce) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }
})();
