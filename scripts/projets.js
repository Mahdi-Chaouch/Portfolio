document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    const target = document.getElementById(hash);
    if (target) {
      const details = target.closest(".project-more");
      if (details && details.hidden) {
        const btn = document.querySelector(`[aria-controls="${details.id}"]`);
        if (btn) {
          btn.setAttribute("aria-expanded", "true");
          details.hidden = false;
        }
      }
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  // Toggle "Savoir plus"
  const toggles = document.querySelectorAll(".project-toggle");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const controlsId = btn.getAttribute("aria-controls");
      const details = controlsId ? document.getElementById(controlsId) : null;
      if (!details) return;

      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !isExpanded);
      details.hidden = isExpanded;
    });
  });

  // Bouton "Voir les screenshots" : ouvrir la section + scroller vers les images
  const screenshotButtons = document.querySelectorAll(".btn-screenshots");
  screenshotButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const href = btn.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      event.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const details = target.closest(".project-more");
      if (details && details.hidden) {
        const toggle = document.querySelector(
          `[aria-controls="${details.id}"]`,
        );
        if (toggle) {
          toggle.setAttribute("aria-expanded", "true");
          details.hidden = false;
        }
      }

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  // Compteur GitHub : afficher étoiles, forks, dernier commit (données statiques ou API)
  const githubBlocks = document.querySelectorAll(".project-github-stats[data-repo]");
  githubBlocks.forEach((block) => {
    const repo = block.getAttribute("data-repo");
    const starsEl = block.querySelector(".github-stars");
    const forksEl = block.querySelector(".github-forks");
    const commitEl = block.querySelector(".github-commit");

    if (!repo) {
      if (starsEl) starsEl.textContent = "0";
      if (forksEl) forksEl.textContent = "0";
      if (commitEl) commitEl.textContent = "—";
      return;
    }

    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (starsEl) starsEl.textContent = data.stargazers_count ?? 0;
        if (forksEl) forksEl.textContent = data.forks_count ?? 0;
        return fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`);
      })
      .then((res) => res.ok ? res.json() : [])
      .then((commits) => {
        if (commitEl && commits[0] && commits[0].commit) {
          const date = new Date(commits[0].commit.author?.date || commits[0].commit.committer?.date);
          commitEl.textContent = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
        } else if (commitEl) {
          commitEl.textContent = "—";
        }
      })
      .catch(() => {
        if (starsEl) starsEl.textContent = "—";
        if (forksEl) forksEl.textContent = "—";
        if (commitEl) commitEl.textContent = "—";
      });
  });

  // Lightbox : clic sur un screenshot → plein écran
  const lightbox = document.getElementById("screenshot-lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");
  const lightboxBackdrop = lightbox?.querySelector(".lightbox__backdrop");
  const lightboxClose = lightbox?.querySelector(".lightbox__close");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Screenshot";
    lightbox.classList.add("lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("lightbox--open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-screenshots-grid img").forEach((img) => {
    img.setAttribute("role", "button");
    img.setAttribute("tabindex", "0");
    img.title = "Agrandir";
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("lightbox--open")) {
      closeLightbox();
    }
  });
});
