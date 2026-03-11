document.addEventListener("DOMContentLoaded", () => {
  // Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Bouton « Revenir en haut » (affiché au défilement)
  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Revenir en haut de la page");
  backToTop.innerHTML = "↑";
  document.body.appendChild(backToTop);

  const scrollThreshold = 300;
  function updateBackToTop() {
    if (window.scrollY > scrollThreshold) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Exemple de structure pour gérer tes projets plus tard en JS.
  // Tu pourras soit lier ces données aux cartes HTML existantes,
  // soit générer automatiquement les cartes à partir de ce tableau.
  const projects = [
    {
      title: "Dashboard étudiant",
      description:
        "Interface web pour suivre les cours, les notes et les tâches à rendre.",
      technologies: ["HTML", "CSS", "JavaScript"],
      url: "#",
    },
    {
      title: "Portfolio minimal",
      description:
        "Site responsive pour présenter un profil, des compétences et quelques projets.",
      technologies: ["HTML", "CSS Grid"],
      url: "#",
    },
    {
      title: "Application de tâches",
      description:
        "Application de to‑do list pour gérer les tâches quotidiennes.",
      technologies: ["JavaScript", "LocalStorage"],
      url: "#",
    },
  ];

  // window.portfolioProjects = projects; // Décommente si tu veux y accéder dans la console.

  // Animations d'apparition au chargement (stagger léger)
  const animatedElements = [];

  const heroContent = document.querySelector(".hero-content");
  const heroVisual = document.querySelector(".hero-visual");

  if (heroContent) animatedElements.push(heroContent);
  if (heroVisual) animatedElements.push(heroVisual);

  const projectSectionHeader = document.querySelector(
    ".section-projects .section-header",
  );
  if (projectSectionHeader) animatedElements.push(projectSectionHeader);

  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => animatedElements.push(card));

  const aboutText = document.querySelector(".section-about .about-text");
  const aboutSkills = document.querySelector(".section-about .about-skills");
  if (aboutText) animatedElements.push(aboutText);
  if (aboutSkills) animatedElements.push(aboutSkills);

  const footerContact = document.querySelector(".footer-contact");
  const footerCopy = document.querySelector(".footer-copy");
  if (footerContact) animatedElements.push(footerContact);
  if (footerCopy) animatedElements.push(footerCopy);

  animatedElements.forEach((el, index) => {
    const delay = 0.12 * index;
    el.classList.add("animate-on-load");
    el.style.animationDelay = `${delay}s`;
  });

  // Page À propos : fade-in des sections au scroll
  const aboutReveals = document.querySelectorAll(".about-reveal");
  if (aboutReveals.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    aboutReveals.forEach((section) => observer.observe(section));
  }

  // Page d'accueil : fade-in des sections au scroll
  const sectionReveals = document.querySelectorAll(".section-reveal");
  if (sectionReveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.08 }
    );
    sectionReveals.forEach((section) => revealObserver.observe(section));
  }
});
