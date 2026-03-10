document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
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
});
