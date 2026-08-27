/* =========================================================
   N VaulNW — animations.js
   IntersectionObserver reveals, parallax, counters
   ========================================================= */

(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  // -------- Hero parallax (bg-grid + bg-orbs) --------
  const hero = document.querySelector(".hero");
  const bgGrid = document.querySelector(".hero .bg-layer--grid");
  const bgOrbs = document.querySelector(".hero .bg-layer--orbs");
  const heroIllust = document.querySelector(".hero__visual img.illust, .hero__visual .illust");

  let scrollY = window.scrollY;
  let ticking = false;

  const applyParallax = () => {
    if (hero) {
      const heroTop = hero.getBoundingClientRect().top;
      const offset = Math.max(0, -heroTop);
      if (bgGrid) bgGrid.style.transform = `translate3d(0, ${offset * 0.18}px, 0)`;
      if (bgOrbs) bgOrbs.style.transform = `translate3d(0, ${offset * 0.08}px, 0)`;
      if (heroIllust) heroIllust.style.transform = `translate3d(0, ${offset * -0.06}px, 0) scale(${1 - Math.min(0.04, offset * 0.00006)})`;
    }
    scrollY = window.scrollY;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  applyParallax();

  // -------- Stat counters (fire once on view) --------
  const counters = document.querySelectorAll(".stat[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const easeOutQuad = (t) => t * (2 - t);
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const value = target * easeOutQuad(t);
        el.textContent = decimals > 0
          ? value.toFixed(decimals)
          : Math.floor(value).toLocaleString("en-US");
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = decimals > 0
          ? target.toFixed(decimals)
          : Math.floor(target).toLocaleString("en-US");
      };
      requestAnimationFrame(tick);
    };

    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => counterIO.observe(c));
  }

  // -------- Subtle tilt on hero illustration --------
  if (heroIllust) {
    const visual = heroIllust.closest(".hero__visual");
    if (visual) {
      visual.addEventListener("mousemove", (e) => {
        const rect = visual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroIllust.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
      });
      visual.addEventListener("mouseleave", () => {
        heroIllust.style.transform = "";
      });
    }
  }
})();
