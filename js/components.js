/* =========================================================
   N VaulNW — components.js
   FAQ accordion, form validation, legal TOC generation
   ========================================================= */

(function () {
  "use strict";

  // -------- Legal page TOC --------
  const tocList = document.querySelector("[data-toc-list]");
  if (tocList) {
    const sections = document.querySelectorAll(".legal__body h2[id], .legal__body h3[id]");
    const buildToc = () => {
      const items = [];
      sections.forEach((heading) => {
        const id = heading.id;
        const text = heading.textContent.trim();
        if (!id) return;
        const isSub = heading.tagName === "H3";
        items.push({ id, text, isSub });
      });
      tocList.innerHTML = items.map((it) => {
        return `<li${it.isSub ? ' class="toc-sub"' : ""}><a href="#${it.id}" data-toc-link="${it.id}">${it.text}</a></li>`;
      }).join("");

      const links = tocList.querySelectorAll("[data-toc-link]");
      links.forEach((a) => {
        a.addEventListener("click", () => {
          links.forEach((x) => x.classList.remove("is-active"));
          a.classList.add("is-active");
        });
      });
    };
    buildToc();

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const link = tocList.querySelector(`[data-toc-link="${id}"]`);
            if (link) {
              tocList.querySelectorAll("[data-toc-link]").forEach((x) => x.classList.remove("is-active"));
              link.classList.add("is-active");
            }
          }
        });
      }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
      sections.forEach((s) => obs.observe(s));
    }
  }

  // -------- Contact form validation --------
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const setError = (field, msg) => {
    const wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.toggle("field--error", Boolean(msg));
    const err = wrap.querySelector(".field__error");
    if (err) err.textContent = msg || "";
  };
  const validate = () => {
    let ok = true;
    form.querySelectorAll("[required]").forEach((f) => {
      const val = (f.value || "").trim();
      if (!val) { setError(f, "This field is required."); ok = false; return; }
      if (f.type === "email" && !emailRe.test(val)) { setError(f, "Please enter a valid email address."); ok = false; return; }
      setError(f, "");
    });
    return ok;
  };

  form.addEventListener("submit", (e) => {
    if (!validate()) {
      e.preventDefault();
      const status = form.querySelector(".form__status");
      if (status) {
        status.classList.remove("is-success");
        status.classList.add("is-error");
        status.textContent = "Please fix the highlighted fields and try again.";
      }
      return;
    }
    const status = form.querySelector(".form__status");
    if (status) {
      status.classList.remove("is-error");
      status.classList.add("is-success");
      status.textContent = "Opening your mail client with the message pre-filled…";
    }
  });

  form.addEventListener("input", (e) => {
    const f = e.target;
    if (!f.matches("[required]")) return;
    if ((f.value || "").trim()) setError(f, "");
  });
})();
